import { Collapse } from 'antd';
import { PlayCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Course } from '@/types';
import { useProgressStore } from '@/store/useProgressStore';
import styles from './ChapterTree.module.css';

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }
  if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

interface ChapterTreeProps {
  course: Course;
}

export default function ChapterTree({ course }: ChapterTreeProps) {
  const navigate = useNavigate();
  const getProgress = useProgressStore((s) => s.getProgress);

  const items = course.chapters.map((chapter) => ({
    key: chapter.id,
    label: (
      <div className={styles.chapterHeader}>
        <span className={styles.chapterTitle}>{chapter.title}</span>
        <span className={styles.lessonBadge}>{chapter.lessons.length} 节课</span>
      </div>
    ),
    children: (
      <ul className={styles.lessonList}>
        {chapter.lessons.map((lesson) => {
          const progress = getProgress(course.id, lesson.id);
          const isCompleted = progress?.completed ?? false;
          return (
            <li
              key={lesson.id}
              className={styles.lessonItem}
              onClick={() => navigate(`/course/${course.id}/lesson/${lesson.id}`)}
            >
              {isCompleted ? (
                <CheckCircleFilled className={styles.completedIcon} />
              ) : (
                <PlayCircleOutlined className={styles.playIcon} />
              )}
              <span className={styles.lessonTitle}>{lesson.title}</span>
              <span className={styles.lessonDuration}>{formatDuration(lesson.durationSec)}</span>
            </li>
          );
        })}
      </ul>
    ),
  }));

  return (
    <div className={styles.chapterTree}>
      <Collapse accordion items={items} />
    </div>
  );
}
