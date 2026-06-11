import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { fetchCourseDetail } from '@/api/api';
import { useProgressStore } from '@/store/useProgressStore';
import VideoPlayerCore from '@/components/VideoPlayerCore';
import SidebarNav from '@/components/SidebarNav';
import styles from './VideoPlayer.module.css';

export default function VideoPlayer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const loadProgress = useProgressStore((s) => s.loadProgress);
  const progressMap = useProgressStore((s) => s.progressMap);
  const reportProgress = useProgressStore((s) => s.reportProgress);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseDetail(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (courseId && lessonId) {
      loadProgress(courseId, lessonId);
    }
  }, [courseId, lessonId, loadProgress]);

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
