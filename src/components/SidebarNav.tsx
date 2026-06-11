import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled, LockFilled } from '@ant-design/icons';
import { useProgressStore } from '@/store/useProgressStore';
import type { Course } from '@/types';
import styles from './SidebarNav.module.css';

interface SidebarNavProps {
  course: Course;
  currentLessonId: string;
  courseId: string;
}

export default function SidebarNav({ course, currentLessonId, courseId }: SidebarNavProps) {
  const navigate = useNavigate();
  const progressMap = useProgressStore((s) => s.progressMap);
  const isLessonUnlocked = useProgressStore((s) => s.isLessonUnlocked);
  const isChapterUnlocked = useProgressStore((s) => s.isChapterUnlocked);
  const getChapterProgress = useProgressStore((s) => s.getChapterProgress);

  const isCompleted = (lessonId: string) => {
    const key = `${courseId}::${lessonId}`;
    return progressMap[key]?.completed ?? false;
  };

  const handleLessonClick = (chapterId: string, lessonId: string) => {
    if (isLessonUnlocked(course, chapterId, lessonId)) {
      navigate(`/course/${courseId}/lesson/${lessonId}`);
    }
  };

  const sortedChapters = [...course.chapters].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.courseTitle}>{course.title}</div>
      <div className={styles.chapterList}>
        {sortedChapters.map((chapter) => {
          const chapterUnlocked = isChapterUnlocked(course, chapter.id);
          const chapterProgress = getChapterProgress(course, chapter.id);
          return (
            <div key={chapter.id} className={styles.chapter}>
              <div className={styles.chapterTitle}>
                <span>{chapter.title}</span>
                {!chapterUnlocked && <LockFilled className={styles.lockIcon} />}
              </div>
              <div className={styles.chapterProgress}>
                <div className={styles.chapterProgressBar}>
                  <div
                    className={styles.chapterProgressFill}
                    style={{ width: `${chapterProgress.percentage}%` }}
                  />
                </div>
                <span className={styles.chapterProgressText}>
                  {chapterProgress.completed}/{chapterProgress.total}
                </span>
              </div>
              {chapter.lessons
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const completed = isCompleted(lesson.id);
                  const unlocked = chapterUnlocked && isLessonUnlocked(course, chapter.id, lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`${styles.lesson} ${isCurrent ? styles.lessonActive : ''} ${!unlocked ? styles.lessonLocked : ''}`}
                      onClick={() => handleLessonClick(chapter.id, lesson.id)}
                    >
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      <div className={styles.lessonIcons}>
                        {!unlocked && <LockFilled className={styles.lockIconSmall} />}
                        {completed && <CheckCircleFilled className={styles.completedIcon} />}
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
