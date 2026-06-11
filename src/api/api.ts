import type { Course, CourseListItem, LearningProgress, LearningRecord, User, UserRole, CourseInput } from '@/types';
import {
  getAllCourseListItems,
  getAnyCourseById,
  getAllLessons,
  registerUser as mockRegisterUser,
  loginUser as mockLoginUser,
  logoutUser as mockLogoutUser,
  getCurrentUser as mockGetCurrentUser,
  createCourse as mockCreateCourse,
  deleteCourse as mockDeleteCourse,
} from './mock-data';

const PROGRESS_KEY = 'online-classroom-progress';

function loadProgressMap(): Record<string, LearningProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgressMap(map: Record<string, LearningProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

export function fetchCourseList(): CourseListItem[] {
  return getAllCourseListItems();
}

export function fetchCourseDetail(courseId: string): Course | null {
  return getAnyCourseById(courseId) ?? null;
}

export function fetchProgress(courseId: string, lessonId: string): LearningProgress | null {
  const map = loadProgressMap();
  const key = `${courseId}::${lessonId}`;
  return map[key] ?? null;
}

export function reportProgress(
  courseId: string,
  lessonId: string,
  watchedSec: number,
): LearningProgress {
  const map = loadProgressMap();
  const key = `${courseId}::${lessonId}`;
  const course = getAnyCourseById(courseId);
  const lesson = course ? getAllLessons(courseId).find((l) => l.id === lessonId) : undefined;
  const completed = lesson ? watchedSec / lesson.durationSec >= 0.9 : false;
  const existing = map[key];
  const progress: LearningProgress = {
    lessonId,
    courseId,
    watchedSec: Math.max(watchedSec, existing?.watchedSec ?? 0),
    completed: completed || (existing?.completed ?? false),
    lastWatchedAt: new Date().toISOString(),
  };
  map[key] = progress;
  saveProgressMap(map);
  return progress;
}

export function fetchLearningRecords(): LearningRecord[] {
  const map = loadProgressMap();
  const courseIds = new Set<string>();
  Object.values(map).forEach((p) => courseIds.add(p.courseId));

  const records: LearningRecord[] = [];
  courseIds.forEach((cid) => {
    const course = getAnyCourseById(cid);
    if (!course) return;
    const allLessons = getAllLessons(cid);
    let latest: LearningProgress | null = null;
    let completedCount = 0;
    for (const les of allLessons) {
      const p = map[`${cid}::${les.id}`];
      if (p) {
        if (!latest || p.lastWatchedAt > latest.lastWatchedAt) {
          latest = p;
        }
        if (p.completed) completedCount++;
      }
    }
    if (!latest) return;
    const lastLesson = allLessons.find((l) => l.id === latest!.lessonId);
    const lastChapter = course.chapters.find((ch) => ch.id === lastLesson?.chapterId);
    records.push({
      courseId: cid,
      courseTitle: course.title,
      courseCoverUrl: course.coverUrl,
      lastLessonId: latest.lessonId,
      lastLessonTitle: lastLesson?.title ?? '',
      lastChapterTitle: lastChapter?.title ?? '',
      totalLessons: allLessons.length,
      completedLessons: completedCount,
      lastWatchedAt: latest.lastWatchedAt,
    });
  });

  records.sort((a, b) => b.lastWatchedAt.localeCompare(a.lastWatchedAt));
  return records;
}

export function login(username: string, password: string): User | null {
  return mockLoginUser(username, password);
}

export function register(username: string, password: string, role: UserRole = 'student'): User | null {
  return mockRegisterUser(username, password, role);
}

export function logout(): void {
  mockLogoutUser();
}

export function getCurrentUser(): User | null {
  return mockGetCurrentUser();
}

export function addCourse(input: CourseInput): Course {
  return mockCreateCourse(input);
}

export function removeCourse(courseId: string): boolean {
  return mockDeleteCourse(courseId);
}
