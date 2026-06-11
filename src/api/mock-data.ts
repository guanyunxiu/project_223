import type { Course, CourseListItem, User, UserRole, CourseInput } from '@/types';

const BIG_BUCK_BUNNY = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const ELEPHANTS_DREAM = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
const FOR_BIGGER_BLAZES = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const FOR_BIGGER_ESCAPES = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
const FOR_BIGGER_FUN = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
const FOR_BIGGER_JOYRIDES = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
const SUBARU_OUTBACK = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4';
const VOLKSWAGEN_GT = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4';

const coverUrl = (seed: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(seed)}&image_size=landscape_16_9`;

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'React 18 高级实战：从架构到性能优化',
    description: '深入 React 18 并发模式、Suspense、Transition、Server Components 等核心特性，结合真实业务场景掌握性能调优技巧。课程涵盖状态管理最佳实践、自定义 Hooks 设计模式、渲染性能分析等高级主题，助你从 React 使用者进阶为架构设计者。',
    coverUrl: coverUrl('Modern React development workspace with code editor, component diagrams, and futuristic UI elements on dark background'),
    totalDurationSec: 7200,
    learnerCount: 3842,
    chapters: [
      {
        id: 'ch-1-1',
        courseId: 'course-1',
        title: '并发模式与 Suspense',
        sortOrder: 1,
        lessons: [
          { id: 'les-1-1-1', chapterId: 'ch-1-1', courseId: 'course-1', title: '并发模式原理解析', videoUrl: BIG_BUCK_BUNNY, durationSec: 1800, sortOrder: 1 },
          { id: 'les-1-1-2', chapterId: 'ch-1-1', courseId: 'course-1', title: 'Suspense 实战：数据获取新模式', videoUrl: ELEPHANTS_DREAM, durationSec: 2100, sortOrder: 2 },
          { id: 'les-1-1-3', chapterId: 'ch-1-1', courseId: 'course-1', title: 'Transition 与 useDeferredValue', videoUrl: FOR_BIGGER_BLAZES, durationSec: 1500, sortOrder: 3 },
        ],
      },
      {
        id: 'ch-1-2',
        courseId: 'course-1',
        title: '状态管理深度实践',
        sortOrder: 2,
        lessons: [
          { id: 'les-1-2-1', chapterId: 'ch-1-2', courseId: 'course-1', title: 'Zustand 架构设计模式', videoUrl: FOR_BIGGER_ESCAPES, durationSec: 1920, sortOrder: 1 },
          { id: 'les-1-2-2', chapterId: 'ch-1-2', courseId: 'course-1', title: 'TanStack Query 缓存策略', videoUrl: FOR_BIGGER_FUN, durationSec: 1680, sortOrder: 2 },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'TypeScript 类型体操与工程化实战',
    description: '从类型系统底层原理出发，掌握条件类型、映射类型、模板字面量类型等高级技巧。结合大型项目工程化实践，涵盖类型安全的 API 层设计、泛型组件开发、类型推导与收窄策略，让你的代码兼具表达力与安全性。',
    coverUrl: coverUrl('TypeScript code flowing through geometric patterns, type system visualization with blue and purple gradient background'),
    totalDurationSec: 9000,
    learnerCount: 2156,
    chapters: [
      {
        id: 'ch-2-1',
        courseId: 'course-2',
        title: '类型系统核心原理',
        sortOrder: 1,
        lessons: [
          { id: 'les-2-1-1', chapterId: 'ch-2-1', courseId: 'course-2', title: '条件类型与 infer 推导', videoUrl: BIG_BUCK_BUNNY, durationSec: 2400, sortOrder: 1 },
          { id: 'les-2-1-2', chapterId: 'ch-2-1', courseId: 'course-2', title: '映射类型与键重映射', videoUrl: ELEPHANTS_DREAM, durationSec: 1800, sortOrder: 2 },
          { id: 'les-2-1-3', chapterId: 'ch-2-1', courseId: 'course-2', title: '模板字面量类型实战', videoUrl: FOR_BIGGER_BLAZES, durationSec: 1560, sortOrder: 3 },
        ],
      },
      {
        id: 'ch-2-2',
        courseId: 'course-2',
        title: '工程化类型安全',
        sortOrder: 2,
        lessons: [
          { id: 'les-2-2-1', chapterId: 'ch-2-2', courseId: 'course-2', title: '类型安全的 API 层设计', videoUrl: FOR_BIGGER_JOYRIDES, durationSec: 2100, sortOrder: 1 },
          { id: 'les-2-2-2', chapterId: 'ch-2-2', courseId: 'course-2', title: '泛型组件与类型推导', videoUrl: SUBARU_OUTBACK, durationSec: 1920, sortOrder: 2 },
          { id: 'les-2-2-3', chapterId: 'ch-2-2', courseId: 'course-2', title: '声明文件与类型增强', videoUrl: VOLKSWAGEN_GT, durationSec: 1440, sortOrder: 3 },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    title: '前端性能优化全攻略',
    description: '系统性掌握前端性能优化方法论，从网络传输、资源加载、渲染管线到运行时性能，全方位提升应用体验。课程包含 Lighthouse 深度解读、Core Web Vitals 优化、长任务治理、内存泄漏排查等实战内容。',
    coverUrl: coverUrl('Performance optimization dashboard with speed meters, charts, and code optimization visualizations on dark tech background'),
    totalDurationSec: 5400,
    learnerCount: 5671,
    chapters: [
      {
        id: 'ch-3-1',
        courseId: 'course-3',
        title: '加载性能优化',
        sortOrder: 1,
        lessons: [
          { id: 'les-3-1-1', chapterId: 'ch-3-1', courseId: 'course-3', title: '资源加载策略与预加载', videoUrl: BIG_BUCK_BUNNY, durationSec: 1500, sortOrder: 1 },
          { id: 'les-3-1-2', chapterId: 'ch-3-1', courseId: 'course-3', title: '代码分割与懒加载实战', videoUrl: ELEPHANTS_DREAM, durationSec: 1800, sortOrder: 2 },
        ],
      },
      {
        id: 'ch-3-2',
        courseId: 'course-3',
        title: '运行时性能优化',
        sortOrder: 2,
        lessons: [
          { id: 'les-3-2-1', chapterId: 'ch-3-2', courseId: 'course-3', title: '长任务治理与调度策略', videoUrl: FOR_BIGGER_BLAZES, durationSec: 2100, sortOrder: 1 },
          { id: 'les-3-2-2', chapterId: 'ch-3-2', courseId: 'course-3', title: '内存泄漏排查与修复', videoUrl: FOR_BIGGER_ESCAPES, durationSec: 1680, sortOrder: 2 },
        ],
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Node.js 微服务架构设计',
    description: '从单体到微服务的架构演进之路，掌握 Node.js 微服务核心设计模式。涵盖服务拆分策略、通信机制（gRPC/消息队列）、分布式事务、服务网格、可观测性等关键话题，助你构建高可用、可扩展的后端架构。',
    coverUrl: coverUrl('Microservices architecture diagram with interconnected nodes, data flow visualization, server infrastructure on blue dark background'),
    totalDurationSec: 10800,
    learnerCount: 1923,
    chapters: [
      {
        id: 'ch-4-1',
        courseId: 'course-4',
        title: '微服务基础架构',
        sortOrder: 1,
        lessons: [
          { id: 'les-4-1-1', chapterId: 'ch-4-1', courseId: 'course-4', title: '服务拆分原则与策略', videoUrl: BIG_BUCK_BUNNY, durationSec: 2700, sortOrder: 1 },
          { id: 'les-4-1-2', chapterId: 'ch-4-1', courseId: 'course-4', title: '服务间通信：REST vs gRPC', videoUrl: ELEPHANTS_DREAM, durationSec: 2400, sortOrder: 2 },
          { id: 'les-4-1-3', chapterId: 'ch-4-1', courseId: 'course-4', title: '消息队列与异步通信', videoUrl: FOR_BIGGER_FUN, durationSec: 1800, sortOrder: 3 },
        ],
      },
      {
        id: 'ch-4-2',
        courseId: 'course-4',
        title: '分布式系统挑战',
        sortOrder: 2,
        lessons: [
          { id: 'les-4-2-1', chapterId: 'ch-4-2', courseId: 'course-4', title: '分布式事务与一致性', videoUrl: FOR_BIGGER_JOYRIDES, durationSec: 2100, sortOrder: 1 },
          { id: 'les-4-2-2', chapterId: 'ch-4-2', courseId: 'course-4', title: '可观测性：日志、指标与链路追踪', videoUrl: SUBARU_OUTBACK, durationSec: 1800, sortOrder: 2 },
        ],
      },
    ],
  },
  {
    id: 'course-5',
    title: 'CSS 现代布局与动画进阶',
    description: '告别传统布局思维，全面掌握 Grid、Container Queries、Scroll-driven Animations 等现代 CSS 特性。课程从设计系统搭建到复杂交互动画实现，帮你打造兼具美感与性能的前端视觉体验。',
    coverUrl: coverUrl('Creative CSS layout and animation showcase with colorful gradients, geometric shapes, motion effects on dark artistic background'),
    totalDurationSec: 6300,
    learnerCount: 4287,
    chapters: [
      {
        id: 'ch-5-1',
        courseId: 'course-5',
        title: '现代布局体系',
        sortOrder: 1,
        lessons: [
          { id: 'les-5-1-1', chapterId: 'ch-5-1', courseId: 'course-5', title: 'Grid 高级布局模式', videoUrl: BIG_BUCK_BUNNY, durationSec: 1800, sortOrder: 1 },
          { id: 'les-5-1-2', chapterId: 'ch-5-1', courseId: 'course-5', title: 'Container Queries 响应式设计', videoUrl: ELEPHANTS_DREAM, durationSec: 1500, sortOrder: 2 },
        ],
      },
      {
        id: 'ch-5-2',
        courseId: 'course-5',
        title: '动画与交互',
        sortOrder: 2,
        lessons: [
          { id: 'les-5-2-1', chapterId: 'ch-5-2', courseId: 'course-5', title: 'Scroll-driven Animations 实战', videoUrl: FOR_BIGGER_BLAZES, durationSec: 2100, sortOrder: 1 },
          { id: 'les-5-2-2', chapterId: 'ch-5-2', courseId: 'course-5', title: 'View Transitions API 页面过渡', videoUrl: FOR_BIGGER_ESCAPES, durationSec: 1680, sortOrder: 2 },
          { id: 'les-5-2-3', chapterId: 'ch-5-2', courseId: 'course-5', title: '性能友好的动画编排', videoUrl: FOR_BIGGER_FUN, durationSec: 1200, sortOrder: 3 },
        ],
      },
    ],
  },
  {
    id: 'course-6',
    title: 'Web 安全攻防实战',
    description: '从前端到后端，系统掌握 Web 安全攻防技术。涵盖 XSS、CSRF、SQL 注入等经典攻击原理与防御，深入 CSP、CORS、OAuth 2.0 安全实践，结合渗透测试工具链，构建纵深防御体系。',
    coverUrl: coverUrl('Cybersecurity shield and lock with digital data streams, network protection visualization on dark navy background'),
    totalDurationSec: 8100,
    learnerCount: 3105,
    chapters: [
      {
        id: 'ch-6-1',
        courseId: 'course-6',
        title: '前端安全攻防',
        sortOrder: 1,
        lessons: [
          { id: 'les-6-1-1', chapterId: 'ch-6-1', courseId: 'course-6', title: 'XSS 攻击原理与防御', videoUrl: BIG_BUCK_BUNNY, durationSec: 2100, sortOrder: 1 },
          { id: 'les-6-1-2', chapterId: 'ch-6-1', courseId: 'course-6', title: 'CSRF 与 CORS 深度解析', videoUrl: ELEPHANTS_DREAM, durationSec: 2400, sortOrder: 2 },
        ],
      },
      {
        id: 'ch-6-2',
        courseId: 'course-6',
        title: '认证与授权安全',
        sortOrder: 2,
        lessons: [
          { id: 'les-6-2-1', chapterId: 'ch-6-2', courseId: 'course-6', title: 'OAuth 2.0 与 OIDC 安全实践', videoUrl: FOR_BIGGER_JOYRIDES, durationSec: 1800, sortOrder: 1 },
          { id: 'les-6-2-2', chapterId: 'ch-6-2', courseId: 'course-6', title: 'JWT 安全陷阱与最佳实践', videoUrl: VOLKSWAGEN_GT, durationSec: 1800, sortOrder: 2 },
        ],
      },
    ],
  },
];

export function getCourseList(): CourseListItem[] {
  return mockCourses.map(({ chapters, ...rest }) => rest);
}

export function getCourseById(courseId: string): Course | undefined {
  return mockCourses.find((c) => c.id === courseId);
}

export function getAllLessons(courseId: string) {
  const course = getCourseById(courseId);
  if (!course) return [];
  return course.chapters.flatMap((ch) => ch.lessons);
}

export function getLesson(courseId: string, lessonId: string) {
  return getAllLessons(courseId).find((l) => l.id === lessonId);
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'online-classroom-users';
const CURRENT_USER_KEY = 'online-classroom-current-user';
const COURSES_KEY = 'online-classroom-courses';

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  const defaultUsers: StoredUser[] = [
    {
      id: 'user-admin',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-student',
      username: 'student',
      password: 'student123',
      role: 'student',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(username: string, password: string, role: UserRole = 'student'): User | null {
  const users = loadUsers();
  if (users.find((u) => u.username === username)) {
    return null;
  }
  const newUser: StoredUser = {
    id: genId('user'),
    username,
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  const { password: _, ...user } = newUser;
  return user;
}

export function loginUser(username: string, password: string): User | null {
  const users = loadUsers();
  const found = users.find((u) => u.username === username && u.password === password);
  if (!found) return null;
  const { password: _, ...user } = found;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadCustomCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomCourses(courses: Course[]) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export function getAllCourses(): Course[] {
  return [...loadCustomCourses(), ...mockCourses];
}

export function getAllCourseListItems(): CourseListItem[] {
  return getAllCourses().map(({ chapters, ...rest }) => rest);
}

export function getAnyCourseById(courseId: string): Course | undefined {
  return getAllCourses().find((c) => c.id === courseId);
}

export function createCourse(input: CourseInput): Course {
  const customCourses = loadCustomCourses();
  const courseId = genId('course');
  const chapters = input.chapters.map((ch, chIdx) => {
    const chapterId = genId('ch');
    return {
      id: chapterId,
      courseId,
      title: ch.title,
      sortOrder: ch.sortOrder ?? chIdx + 1,
      lessons: ch.lessons.map((les, lesIdx) => ({
        id: genId('les'),
        chapterId,
        courseId,
        title: les.title,
        videoUrl: les.videoUrl,
        durationSec: les.durationSec,
        sortOrder: les.sortOrder ?? lesIdx + 1,
      })),
    };
  });
  const totalDurationSec = chapters.reduce(
    (sum, ch) => sum + ch.lessons.reduce((s, l) => s + l.durationSec, 0),
    0,
  );
  const newCourse: Course = {
    id: courseId,
    title: input.title,
    description: input.description,
    coverUrl: input.coverUrl,
    totalDurationSec,
    learnerCount: 0,
    chapters,
  };
  customCourses.unshift(newCourse);
  saveCustomCourses(customCourses);
  return newCourse;
}

export function deleteCourse(courseId: string): boolean {
  const customCourses = loadCustomCourses();
  const idx = customCourses.findIndex((c) => c.id === courseId);
  if (idx === -1) return false;
  customCourses.splice(idx, 1);
  saveCustomCourses(customCourses);
  return true;
}
