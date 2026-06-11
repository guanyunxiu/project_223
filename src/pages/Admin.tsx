import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, X } from 'lucide-react';
import { Modal, message } from 'antd';
import { fetchCourseList, addCourse, removeCourse } from '@/api/api';
import type { CourseInput, ChapterInput, LessonInput, CourseListItem } from '@/types';
import styles from './Admin.module.css';

const DEFAULT_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

interface LessonForm {
  title: string;
  videoUrl: string;
  durationSec: string;
}

interface ChapterForm {
  title: string;
  lessons: LessonForm[];
}

function emptyLesson(): LessonForm {
  return { title: '', videoUrl: DEFAULT_VIDEO, durationSec: '' };
}

function emptyChapter(): ChapterForm {
  return { title: '', lessons: [emptyLesson()] };
}

export default function Admin() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [chapters, setChapters] = useState<ChapterForm[]>([emptyChapter()]);
  const [submitting, setSubmitting] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ['courseList'],
    queryFn: fetchCourseList,
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCoverUrl('');
    setChapters([emptyChapter()]);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const addChapter = () => {
    setChapters([...chapters, emptyChapter()]);
  };

  const removeChapter = (idx: number) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== idx));
  };

  const updateChapter = (idx: number, field: string, value: string) => {
    const updated = [...chapters];
    (updated[idx] as any)[field] = value;
    setChapters(updated);
  };

  const addLesson = (chIdx: number) => {
    const updated = [...chapters];
    updated[chIdx].lessons.push(emptyLesson());
    setChapters(updated);
  };

  const removeLesson = (chIdx: number, lesIdx: number) => {
    const updated = [...chapters];
    if (updated[chIdx].lessons.length <= 1) return;
    updated[chIdx].lessons = updated[chIdx].lessons.filter((_, i) => i !== lesIdx);
    setChapters(updated);
  };

  const updateLesson = (chIdx: number, lesIdx: number, field: string, value: string) => {
    const updated = [...chapters];
    (updated[chIdx].lessons[lesIdx] as any)[field] = value;
    setChapters(updated);
  };

  const handleDeleteCourse = (course: CourseListItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除课程「${course.title}」吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const ok = removeCourse(course.id);
        if (ok) {
          message.success('课程删除成功');
          queryClient.invalidateQueries({ queryKey: ['courseList'] });
        } else {
          message.error('无法删除内置课程');
        }
      },
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      message.error('请输入课程标题');
      return;
    }
    if (!description.trim()) {
      message.error('请输入课程描述');
      return;
    }
    if (!coverUrl.trim()) {
      message.error('请输入课程封面 URL');
      return;
    }

    for (let ci = 0; ci < chapters.length; ci++) {
      const ch = chapters[ci];
      if (!ch.title.trim()) {
        message.error(`请输入第 ${ci + 1} 章标题`);
        return;
      }
      for (let li = 0; li < ch.lessons.length; li++) {
        const les = ch.lessons[li];
        if (!les.title.trim()) {
          message.error(`第 ${ci + 1} 章 第 ${li + 1} 节请输入标题`);
          return;
        }
        if (!les.videoUrl.trim()) {
          message.error(`第 ${ci + 1} 章 第 ${li + 1} 节请输入视频地址`);
          return;
        }
        const dur = parseInt(les.durationSec, 10);
        if (!dur || dur <= 0) {
          message.error(`第 ${ci + 1} 章 第 ${li + 1} 节请输入有效的视频时长`);
          return;
        }
      }
    }

    setSubmitting(true);

    const courseChapters: ChapterInput[] = chapters.map((ch, chIdx) => ({
      title: ch.title,
      sortOrder: chIdx + 1,
      lessons: ch.lessons.map((les, lesIdx): LessonInput => ({
        title: les.title,
        videoUrl: les.videoUrl,
        durationSec: parseInt(les.durationSec, 10),
        sortOrder: lesIdx + 1,
      })),
    }));

    const input: CourseInput = {
      title,
      description,
      coverUrl,
      chapters: courseChapters,
    };

    setTimeout(() => {
      addCourse(input);
      message.success('课程创建成功');
      queryClient.invalidateQueries({ queryKey: ['courseList'] });
      setSubmitting(false);
      closeModal();
    }, 500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>课程管理</h1>
        <button className={styles.addButton} onClick={openModal}>
          <Plus size={18} />
          新建课程
        </button>
      </div>

      {courses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>暂无课程，点击右上角创建新课程</p>
        </div>
      ) : (
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <img className={styles.cover} src={course.coverUrl} alt={course.title} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{course.title}</h3>
                <p className={styles.cardDesc}>{course.description}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    {formatDuration(course.totalDurationSec)} · {course.learnerCount} 人学习
                  </span>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteCourse(course)}
                  >
                    <Trash2 size={12} /> 删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>新建课程</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>课程标题</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="请输入课程标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>课程描述</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="请输入课程描述"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>封面图片 URL</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="请输入封面图片 URL"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
              </div>

              <div className={styles.chapterSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>章节与课时</h3>
                  <button className={styles.addChapterButton} onClick={addChapter}>
                    + 添加章节
                  </button>
                </div>

                {chapters.map((chapter, chIdx) => (
                  <div key={chIdx} className={styles.chapterBlock}>
                    <div className={styles.chapterHeader}>
                      <span className={styles.chapterIndex}>第 {chIdx + 1} 章</span>
                      {chapters.length > 1 && (
                        <button
                          className={styles.removeChapterButton}
                          onClick={() => removeChapter(chIdx)}
                        >
                          删除章节
                        </button>
                      )}
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: 12 }}>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="章节标题"
                        value={chapter.title}
                        onChange={(e) => updateChapter(chIdx, 'title', e.target.value)}
                      />
                    </div>

                    <div className={styles.lessonList}>
                      {chapter.lessons.map((lesson, lesIdx) => (
                        <div key={lesIdx} className={styles.lessonBlock}>
                          <div className={styles.lessonHeader}>
                            <span className={styles.lessonIndex}>第 {lesIdx + 1} 节</span>
                            {chapter.lessons.length > 1 && (
                              <button
                                className={styles.removeLessonButton}
                                onClick={() => removeLesson(chIdx, lesIdx)}
                              >
                                删除
                              </button>
                            )}
                          </div>
                          <div className={styles.lessonRow}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="课时标题"
                              value={lesson.title}
                              onChange={(e) => updateLesson(chIdx, lesIdx, 'title', e.target.value)}
                            />
                            <input
                              className={styles.formInput}
                              type="number"
                              placeholder="视频时长(秒)"
                              value={lesson.durationSec}
                              onChange={(e) => updateLesson(chIdx, lesIdx, 'durationSec', e.target.value)}
                            />
                          </div>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="视频地址 URL"
                            value={lesson.videoUrl}
                            onChange={(e) => updateLesson(chIdx, lesIdx, 'videoUrl', e.target.value)}
                          />
                        </div>
                      ))}
                      <button
                        className={styles.addLessonButton}
                        onClick={() => addLesson(chIdx)}
                      >
                        + 添加课时
                      </button>
                    </div>
                  </div>
                  ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={closeModal}>
                取消
              </button>
              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '创建中...' : '创建课程'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
