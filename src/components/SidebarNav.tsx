import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled } from '@ant-design/icons';
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

  const isCompleted = (lessonId: string) => {
    const key = `${courseId}::${lessonId}`;
    return progressMap[key]?.completed ?? false;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.courseTitle}>{course.title}</div>
      <div className={styles.chapterList}>
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className={styles.chapter}>
            <div className={styles.chapterTitle}>{chapter.title}</div>
            {chapter.lessons.map((lesson) => {
              const isCurrent = lesson.id === currentLessonId;
              const completed = isCompleted(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className={`${styles.lesson} ${isCurrent ? styles.lessonActive : ''}`}
                  onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
                >
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                  {completed && <CheckCircleFilled className={styles.completedIcon} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
