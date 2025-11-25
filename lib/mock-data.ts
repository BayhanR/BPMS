export type MockUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "admin" | "editor" | "viewer";
  online: boolean;
  activeTasks: number;
  lastComment?: string;
};

export type MockProject = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
};

export type MockLabel = {
  id: string;
  name: string;
  color: string;
  projectId: string;
};

export type MockTask = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  startDate?: string;
  assigneeId: string;
  projectId: string;
  labelIds: string[];
};

export const mockUsers: MockUser[] = [
  {
    id: "u-nevra",
    name: "Nevra Güneş",
    email: "nevra@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=47",
    role: "admin",
    online: true,
    activeTasks: 8,
    lastComment: "Spatial dashboard için QA onayını bekliyorum.",
  },
  {
    id: "u-baris",
    name: "Barış Akgül",
    email: "baris@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=14",
    role: "editor",
    online: true,
    activeTasks: 6,
    lastComment: "Realtime veri katmanını %70 optimize ettim.",
  },
  {
    id: "u-duru",
    name: "Duru Aybars",
    email: "duru@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=25",
    role: "viewer",
    online: false,
    activeTasks: 3,
    lastComment: "Takım içi workshop notlarını paylaştım.",
  },
  {
    id: "u-mert",
    name: "Mert Soydan",
    email: "mert@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=5",
    role: "editor",
    online: true,
    activeTasks: 5,
    lastComment: "Ops otomasyon pipeline'ı canlıda.",
  },
  {
    id: "u-irem",
    name: "İrem Tolan",
    email: "irem@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=31",
    role: "viewer",
    online: true,
    activeTasks: 3,
    lastComment: "AI copilotta yeni hintleri pushladım.",
  },
];

export const mockProjects: MockProject[] = [
  {
    id: "p-focus",
    name: "Focus Deck OS",
    description: "Spatial proje seçimi ve deck mimarisi için çekirdek platform.",
    color: "#ff1e56",
    icon: "workflow",
  },
  {
    id: "p-athena",
    name: "Athena Analytics",
    description: "Gerçek zamanlı KPI kontrol odası ve veri katmanı.",
    color: "#ff006e",
    icon: "barchart",
  },
  {
    id: "p-rift",
    name: "Rift Automations",
    description: "Kod tabanlı otomasyon motoru ve AI copilotu.",
    color: "#ff4d6d",
    icon: "zap",
  },
];

export const mockLabels: MockLabel[] = [
  { id: "l-insight", name: "Insight", color: "#ff4d6d", projectId: "p-athena" },
  { id: "l-ops", name: "Ops", color: "#ff1e56", projectId: "p-rift" },
  { id: "l-ai", name: "AI", color: "#ff006e", projectId: "p-rift" },
  { id: "l-design", name: "Design", color: "#ff5c8d", projectId: "p-focus" },
  { id: "l-motion", name: "Motion", color: "#ff1744", projectId: "p-focus" },
  { id: "l-api", name: "API", color: "#ff3b58", projectId: "p-athena" },
  { id: "l-hotfix", name: "Hotfix", color: "#ff2349", projectId: "p-rift" },
  { id: "l-growth", name: "Growth", color: "#ff667a", projectId: "p-focus" },
];

const statuses: Array<MockTask["status"]> = ["todo", "doing", "done"];
const priorities: Array<MockTask["priority"]> = ["low", "medium", "high", "urgent"];

const baseDate = new Date();
baseDate.setHours(9, 0, 0, 0);

export const mockTasks: MockTask[] = Array.from({ length: 25 }).map((_, idx) => {
  const project = mockProjects[idx % mockProjects.length];
  const assignee = mockUsers[idx % mockUsers.length];
  const labelPool = mockLabels.filter((label) => label.projectId === project.id);
  const due = new Date(baseDate);
  due.setDate(baseDate.getDate() + idx - 10);

  const start = new Date(due);
  start.setDate(due.getDate() - Math.max(1, (idx % 4) + 1));

  return {
    id: `task-${idx + 1}`,
    title: `${project.name} · Akış ${idx + 1}`,
    description: "Kırmızı-siyah tasarım sistemine uygun modül optimizasyonu.",
    status: statuses[idx % statuses.length],
    priority: priorities[idx % priorities.length],
    dueDate: due.toISOString(),
    startDate: start.toISOString(),
    assigneeId: assignee.id,
    projectId: project.id,
    labelIds: labelPool.slice(0, Math.max(1, (idx % labelPool.length) + 1)).map((label) => label.id),
  };
});

