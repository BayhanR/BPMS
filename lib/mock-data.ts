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
    id: "u-alya",
    name: "Alya Korkmaz",
    email: "alya@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=12",
    role: "admin",
    online: true,
    activeTasks: 7,
    lastComment: "Hafta sonu build'i ship'ledim.",
  },
  {
    id: "u-kerem",
    name: "Kerem Ersoy",
    email: "kerem@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=32",
    role: "editor",
    online: true,
    activeTasks: 5,
    lastComment: "Yeni API endpoint'i QA'ya attım.",
  },
  {
    id: "u-mira",
    name: "Mira Aydın",
    email: "mira@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=45",
    role: "viewer",
    online: false,
    activeTasks: 3,
    lastComment: "Next sprint'te UX revizyonu var.",
  },
  {
    id: "u-eren",
    name: "Eren Sağlam",
    email: "eren@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=25",
    role: "editor",
    online: true,
    activeTasks: 6,
    lastComment: "Realtime kanalındaki bug'ı çözdüm.",
  },
  {
    id: "u-lara",
    name: "Lara Demir",
    email: "lara@bpms.io",
    avatarUrl: "https://i.pravatar.cc/120?img=15",
    role: "viewer",
    online: false,
    activeTasks: 2,
    lastComment: "Yeni illüstrasyon seti hazır.",
  },
];

export const mockProjects: MockProject[] = [
  {
    id: "p-orion",
    name: "Orion CRM",
    description: "Enterprise CRM pipeline'ını otomatikleştiren yeni katman.",
    color: "#ff1e56",
    icon: "workflow",
  },
  {
    id: "p-nova",
    name: "Nova Analytics",
    description: "Gerçek zamanlı veri görselleştirme paneli.",
    color: "#ff4d6d",
    icon: "barchart",
  },
  {
    id: "p-helix",
    name: "Helix Mobile",
    description: "Modüler mobil workspace deneyimi.",
    color: "#ff006e",
    icon: "zap",
  },
];

export const mockLabels: MockLabel[] = [
  { id: "l-design", name: "Design", color: "#ff6b81", projectId: "p-orion" },
  { id: "l-dev", name: "Development", color: "#ff1e56", projectId: "p-orion" },
  { id: "l-ux", name: "UX", color: "#ff4d6d", projectId: "p-nova" },
  { id: "l-research", name: "Research", color: "#ff8fab", projectId: "p-nova" },
  { id: "l-api", name: "API", color: "#f72585", projectId: "p-helix" },
  { id: "l-hotfix", name: "Hotfix", color: "#ff1744", projectId: "p-helix" },
  { id: "l-copy", name: "Copy", color: "#ff5c8d", projectId: "p-orion" },
  { id: "l-growth", name: "Growth", color: "#ff9ebb", projectId: "p-nova" },
];

const statuses: Array<MockTask["status"]> = ["todo", "doing", "done"];
const priorities: Array<MockTask["priority"]> = ["low", "medium", "high", "urgent"];

const baseDate = new Date();

export const mockTasks: MockTask[] = Array.from({ length: 25 }).map((_, idx) => {
  const project = mockProjects[idx % mockProjects.length];
  const assignee = mockUsers[idx % mockUsers.length];
  const labelPool = mockLabels.filter((label) => label.projectId === project.id);
  const due = new Date(baseDate);
  due.setDate(baseDate.getDate() + idx - 5);

  return {
    id: `task-${idx + 1}`,
    title: `${project.name} - Görev ${idx + 1}`,
    description: "Yeni nesil modül için hazırlık ve QA adımları.",
    status: statuses[idx % statuses.length],
    priority: priorities[idx % priorities.length],
    dueDate: due.toISOString(),
    startDate: new Date(due.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    assigneeId: assignee.id,
    projectId: project.id,
    labelIds: labelPool.slice(0, (idx % labelPool.length) + 1).map((label) => label.id),
  };
});

