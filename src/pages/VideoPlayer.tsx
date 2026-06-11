import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { LockFilled } from '@ant-design/icons';
import { fetchCourseDetail } from '@/api/api';
import { useProgressStore } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/useAuthStore';
import VideoPlayerCore from '@/components/VideoPlayerCore';
import SidebarNav from '@/components/SidebarNav';
import styles from './VideoPlayer.module.css';

export default function VideoPlayer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const loadCourseProgress = useProgressStore((s) => s.loadCourseProgress);
  const progressMap = useProgressStore((s) => s.progressMap);
  const reportProgress = useProgressStore((s) => s.reportProgress);
  const isLessonUnlocked = useProgressStore((s) => s.isLessonUnlocked);
  const user = useAuthStore((s) => s.user);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseDetail(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (course && user) {
      loadCourseProgress(course);
    }
  }, [course, user, loadCourseProgress]);

  if (isLoading || !course || !lessonId || !courseId) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  const currentLesson = course.chapters
    .flatMap((ch) => ch.lessons)
    .find((l) => l.id === lessonId);

  if (!currentLesson) {
    return (
      <div className={styles.loading}>
        <p>课时未找到</p>
      </div>
    );
  }

  const lessonUnlocked = isLessonUnlocked(course, currentLesson.chapterId, lessonId);

  if (!lessonUnlocked) {
    const sortedChapters = [...course.chapters].sort((a, b) => a.sortOrder - b.sortOrder);
    const firstLesson = sortedChapters[0]?.lessons[0];
    return (
      <div className={styles.container}>
        <div className={styles.playerArea}>
          <div className={styles.lockedLesson}>
            <LockFilled className={styles.lockIconLarge} />
            <h2 className={styles.lockedTitle}>课时未解锁</h2>
            <p className={styles.lockedDesc}>请先完成前面的课时学习后再解锁本节内容</p>
            {firstLesson && (
              <button
                className={styles.startFirstButton}
                onClick={() => navigate(`/course/${courseId}/lesson/${firstLesson.id}`)}
              >
                从第一节课开始
              </button>
            )}
          </div>
        </div>
        <SidebarNav
          course={course}
          currentLessonId={lessonId}
          courseId={courseId}
        />
      </div>
    );
  }

  const progressKey = `${courseId}::${lessonId}`;
  const resumeFrom = progressMap[progressKey]?.watchedSec ?? 0;

  const handleProgress = (watchedSec: number) => {
    if (courseId && lessonId) {
      reportProgress(courseId, lessonId, watchedSec);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerArea}>
        <VideoPlayerCore
          videoUrl={currentLesson.videoUrl}
          onProgress={handleProgress}
          resumeFrom={resumeFrom}
          durationSec={currentLesson.durationSec}
        />
        <div className={styles.lessonInfo}>
          <h1 className={styles.lessonTitle}>{currentLesson.title}</h1>
        </div>
      </div>
      <SidebarNav
        course={course}
        currentLessonId={lessonId}
        courseId={courseId}
      />
    </div>
  );
}
