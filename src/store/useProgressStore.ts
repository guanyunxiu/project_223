import { create } from 'zustand';
import type { LearningProgress, Course } from '@/types';
import { reportProgress as apiReportProgress, fetchProgress } from '@/api/api';

interface ProgressState {
  progressMap: Record<string, LearningProgress>;
  getProgress: (courseId: string, lessonId: string) => LearningProgress | null;
  loadProgress: (courseId: string, lessonId: string) => void;
  loadCourseProgress: (course: Course) => void;
  reportProgress: (courseId: string, lessonId: string, watchedSec: number) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressMap: {},

  getProgress: (courseId, lessonId) => {
    const key = `${courseId}::${lessonId}`;
    return get().progressMap[key] ?? null;
  },

  loadProgress: (courseId, lessonId) => {
    const p = fetchProgress(courseId, lessonId);
    if (p) {
      const key = `${courseId}::${lessonId}`;
      set((state) => ({
        progressMap: { ...state.progressMap, [key]: p },
      }));
    }
  },

  loadCourseProgress: (course) => {
    const newMap: Record<string, LearningProgress> = {};
    course.chapters.forEach((ch) => {
      ch.lessons.forEach((les) => {
        const p = fetchProgress(course.id, les.id);
        if (p) {
          newMap[`${course.id}::${les.id}`] = p;
        }
      });
    });
    if (Object.keys(newMap).length > 0) {
      set((state) => ({
        progressMap: { ...state.progressMap, ...newMap },
      }));
    }
  },

  reportProgress: (courseId, lessonId, watchedSec) => {
    const updated = apiReportProgress(courseId, lessonId, watchedSec);
    const key = `${courseId}::${lessonId}`;
    set((state) => ({
      progressMap: { ...state.progressMap, [key]: updated },
    }));
  },

  reset: () => {
    set({ progressMap: {} });
  },
}));
