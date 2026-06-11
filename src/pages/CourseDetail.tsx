import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { fetchCourseDetail } from '@/api/api';
import ChapterTree from '@/components/ChapterTree';
import styles from './CourseDetail.module.css';

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) {
    return `${h} 小时 ${m} 分钟`;
  }
  return `${m} 分钟`;
}

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['courseDetail', courseId],
    queryFn: () => Promise.resolve(fetchCourseDetail(courseId!)),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className={styles.page}>
        <div className={styles.errorWrap}>课程未找到</div>
      </div>
    );
  }

  const totalLessons = course.chapters.reduce(
    (sum, ch) => sum + ch.lessons.length,
    0,
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.coverWrap}>
            <img
              className={styles.cover}
              src={course.coverUrl}
              alt={course.title}
            />
          </div>
          <div className={styles.info}>
            <h1 className={styles.title}>{course.title}</h1>
            <p className={styles.description}>{course.description}</p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {formatDuration(course.totalDurationSec)}
                </span>
                <span className={styles.statLabel}>总时长</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {course.learnerCount.toLocaleString()}
                </span>
                <span className={styles.statLabel}>学习人数</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {course.chapters.length}
                </span>
                <span className={styles.statLabel}>章节数</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {totalLessons}
                </span>
                <span className={styles.statLabel}>课时数</span>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className={styles.sectionTitle}>课程目录</h2>
          <ChapterTree course={course} />
        </section>
      </div>
    </div>
  );
}
