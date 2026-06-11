export interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  totalDurationSec: number;
  learnerCount: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  videoUrl: string;
  durationSec: number;
  sortOrder: number;
}

export interface LearningProgress {
  lessonId: string;
  courseId: string;
  watchedSec: number;
  completed: boolean;
  lastWatchedAt: string;
}

export interface LearningRecord {
  courseId: string;
  courseTitle: string;
  courseCoverUrl: string;
  lastLessonId: string;
  lastLessonTitle: string;
  lastChapterTitle: string;
  totalLessons: number;
  completedLessons: number;
  lastWatchedAt: string;
  progressPercent: number;
  watchedSec: number;
  totalSec: number;
}

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  totalDurationSec: number;
  learnerCount: number;
}

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface ChapterInput {
  title: string;
  sortOrder: number;
  lessons: LessonInput[];
}

export interface LessonInput {
  title: string;
  videoUrl: string;
  durationSec: number;
  sortOrder: number;
}

export interface CourseInput {
  title: string;
  description: string;
  coverUrl: string;
  chapters: ChapterInput[];
}
