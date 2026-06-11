import { create } from 'zustand';
import type { LearningProgress, Course, Chapter, Lesson } from '@/types';
import { reportProgress as apiReportProgress, fetchProgress } from '@/api/api';

interface ProgressState {
  progressMap: Record<string, LearningProgress>;
  getProgress: (courseId: string, lessonId: string) => LearningProgress | null;
  loadProgress: (courseId: string, lessonId: string) => void;
  loadCourseProgress: (course: Course) => void;
  reportProgress: (courseId: string, lessonId: string, watchedSec: number) => void;
  reset: () => void;
  isLessonUnlocked: (course: Course, chapterId: string, lessonId: string) => boolean;
  isChapterUnlocked: (course: Course, chapterId: string) => boolean;
  getChapterProgress: (course: Course, chapterId: string) => { completed: number; total: number; percentage: number };
  getCourseProgress: (course: Course) => { watchedSec: number; totalSec: number; percentage: number; completedLessons: number; totalLessons: number };
}

function getSortedChapters(course: Course): Chapter[] {
  return [...course.chapters].sort((a, b) => a.sortOrder - b.sortOrder);
}

function getSortedLessons(chapter: Chapter): Lesson[] {
  return [...chapter.lessons].sort((a, b) => a.sortOrder - b.sortOrder);
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

  isLessonUnlocked: (course, chapterId, lessonId) => {
    const { progressMap } = get();
    const chapters = getSortedChapters(course);
    const chapterIdx = chapters.findIndex((ch) => ch.id === chapterId);
    if (chapterIdx === -1) return false;

    if (chapterIdx > 0) {
      const prevChapter = chapters[chapterIdx - 1];
      const prevLessons = getSortedLessons(prevChapter);
      const allPrevCompleted = prevLessons.every((les) => {
        const key = `${course.id}::${les.id}`;
        return progressMap[key]?.completed ?? false;
      });
      if (!allPrevCompleted) return false;
    }

    const currentChapter = chapters[chapterIdx];
    const lessons = getSortedLessons(currentChapter);
    const lessonIdx = lessons.findIndex((l) => l.id === lessonId);
    if (lessonIdx === -1) return false;

    if (lessonIdx === 0) return true;

    const prevLesson = lessons[lessonIdx - 1];
    const prevKey = `${course.id}::${prevLesson.id}`;
    return progressMap[prevKey]?.completed ?? false;
  },

  isChapterUnlocked: (course, chapterId) => {
    const { progressMap } = get();
    const chapters = getSortedChapters(course);
    const chapterIdx = chapters.findIndex((ch) => ch.id === chapterId);
    if (chapterIdx === -1) return false;
    if (chapterIdx === 0) return true;

    const prevChapter = chapters[chapterIdx - 1];
    const prevLessons = getSortedLessons(prevChapter);
    return prevLessons.every((les) => {
      const key = `${course.id}::${les.id}`;
      return progressMap[key]?.completed ?? false;
    });
  },

  getChapterProgress: (course, chapterId) => {
    const { progressMap } = get();
    const chapter = course.chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return { completed: 0, total: 0, percentage: 0 };

    const lessons = chapter.lessons;
    const total = lessons.length;
    let completed = 0;

    lessons.forEach((les) => {
      const key = `${course.id}::${les.id}`;
      if (progressMap[key]?.completed) {
        completed++;
      }
    });

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  },

  getCourseProgress: (course) => {
    const { progressMap } = get();
    let watchedSec = 0;
    let totalSec = 0;
    let completedLessons = 0;
    let totalLessons = 0;

    course.chapters.forEach((ch) => {
      ch.lessons.forEach((les) => {
        totalSec += les.durationSec;
        totalLessons++;
        const key = `${course.id}::${les.id}`;
        const p = progressMap[key];
        if (p) {
          watchedSec += Math.min(p.watchedSec, les.durationSec);
          if (p.completed) {
            completedLessons++;
          }
        }
      });
    });

    return {
      watchedSec,
      totalSec,
      percentage: totalSec > 0 ? (watchedSec / totalSec) * 100 : 0,
      completedLessons,
      totalLessons,
    };
  },
}));
