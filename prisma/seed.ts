import { PrismaClient, TaskStatus, TaskPriority, WorkspaceRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Mevcut verileri temizle
  console.log("🧹 Clearing existing data...");
  await prisma.comment.deleteMany();
  await prisma.taskLabel.deleteMany();
  await prisma.label.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.taskAttachment.deleteMany();
  await prisma.recurringTask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // 1. Kullanıcılar oluştur
  console.log("👤 Creating users...");
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@bpms.io",
      name: "Bayhan Admin",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      emailVerified: new Date(),
    },
  });

  const editor1 = await prisma.user.create({
    data: {
      email: "editor1@bpms.io",
      name: "Ayşe Yılmaz",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayse",
      emailVerified: new Date(),
    },
  });

  const editor2 = await prisma.user.create({
    data: {
      email: "editor2@bpms.io",
      name: "Mehmet Demir",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehmet",
      emailVerified: new Date(),
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: "viewer@bpms.io",
      name: "Zeynep Kaya",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=zeynep",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Users created:", [admin.email, editor1.email, editor2.email, viewer.email]);

  // 2. Workspace oluştur
  console.log("🏢 Creating workspace...");
  const workspace = await prisma.workspace.create({
    data: {
      name: "Bayhan Core",
      members: {
        create: [
          { userId: admin.id, role: WorkspaceRole.admin },
          { userId: editor1.id, role: WorkspaceRole.editor },
          { userId: editor2.id, role: WorkspaceRole.editor },
          { userId: viewer.id, role: WorkspaceRole.viewer },
        ],
      },
    },
  });

  console.log("✅ Workspace created:", workspace.name);

  // 3. Projeler oluştur
  console.log("📁 Creating projects...");
  const project1 = await prisma.project.create({
    data: {
      name: "CRM Pipeline",
      description: "Müşteri ilişkileri yönetimi ve satış pipeline otomasyonu",
      color: "#ff1e56",
      icon: "workflow",
      workspaceId: workspace.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Analytics Dashboard",
      description: "Gerçek zamanlı veri analizi ve raporlama sistemi",
      color: "#ff006e",
      icon: "barchart",
      workspaceId: workspace.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Mobile App",
      description: "iOS ve Android için native mobil uygulama",
      color: "#ff4d6d",
      icon: "zap",
      workspaceId: workspace.id,
    },
  });

  console.log("✅ Projects created:", [project1.name, project2.name, project3.name]);

  // 4. Label'lar oluştur
  console.log("🏷️ Creating labels...");
  const labels = await Promise.all([
    prisma.label.create({
      data: { name: "Frontend", color: "#3b82f6", projectId: project1.id },
    }),
    prisma.label.create({
      data: { name: "Backend", color: "#10b981", projectId: project1.id },
    }),
    prisma.label.create({
      data: { name: "Urgent", color: "#ef4444", projectId: project1.id },
    }),
    prisma.label.create({
      data: { name: "Design", color: "#8b5cf6", projectId: project2.id },
    }),
    prisma.label.create({
      data: { name: "Bug", color: "#f59e0b", projectId: project2.id },
    }),
    prisma.label.create({
      data: { name: "Feature", color: "#06b6d4", projectId: project3.id },
    }),
  ]);

  console.log("✅ Labels created:", labels.length);

  // 5. Task'lar oluştur
  console.log("📋 Creating tasks...");

  const taskTitles = [
    // CRM Pipeline tasks
    { title: "Lead skorlama algoritması", project: project1, assignee: editor1, status: TaskStatus.doing, priority: TaskPriority.high },
    { title: "Email template sistemi", project: project1, assignee: editor2, status: TaskStatus.todo, priority: TaskPriority.medium },
    { title: "Müşteri segmentasyonu", project: project1, assignee: editor1, status: TaskStatus.done, priority: TaskPriority.high },
    { title: "Pipeline dashboard UI", project: project1, assignee: admin, status: TaskStatus.doing, priority: TaskPriority.urgent },
    { title: "Otomasyon kuralları", project: project1, assignee: editor2, status: TaskStatus.todo, priority: TaskPriority.medium },
    { title: "API entegrasyonu", project: project1, assignee: editor1, status: TaskStatus.done, priority: TaskPriority.high },
    { title: "Raporlama modülü", project: project1, assignee: admin, status: TaskStatus.todo, priority: TaskPriority.low },
    { title: "Notification sistemi", project: project1, assignee: editor2, status: TaskStatus.doing, priority: TaskPriority.medium },

    // Analytics Dashboard tasks
    { title: "Real-time veri akışı", project: project2, assignee: editor2, status: TaskStatus.doing, priority: TaskPriority.urgent },
    { title: "Grafik kütüphanesi seçimi", project: project2, assignee: editor1, status: TaskStatus.done, priority: TaskPriority.high },
    { title: "KPI widget'ları", project: project2, assignee: admin, status: TaskStatus.todo, priority: TaskPriority.high },
    { title: "Export fonksiyonu", project: project2, assignee: editor2, status: TaskStatus.todo, priority: TaskPriority.medium },
    { title: "Filtre sistemi", project: project2, assignee: editor1, status: TaskStatus.doing, priority: TaskPriority.medium },
    { title: "Dark mode desteği", project: project2, assignee: admin, status: TaskStatus.done, priority: TaskPriority.low },
    { title: "Mobile responsive", project: project2, assignee: editor1, status: TaskStatus.todo, priority: TaskPriority.high },
    { title: "Performance optimizasyonu", project: project2, assignee: editor2, status: TaskStatus.doing, priority: TaskPriority.urgent },

    // Mobile App tasks
    { title: "React Native setup", project: project3, assignee: editor1, status: TaskStatus.done, priority: TaskPriority.high },
    { title: "Auth ekranları", project: project3, assignee: editor2, status: TaskStatus.doing, priority: TaskPriority.high },
    { title: "Push notification", project: project3, assignee: admin, status: TaskStatus.todo, priority: TaskPriority.medium },
    { title: "Offline mode", project: project3, assignee: editor1, status: TaskStatus.todo, priority: TaskPriority.low },
    { title: "App Store hazırlık", project: project3, assignee: editor2, status: TaskStatus.todo, priority: TaskPriority.medium },
    { title: "Beta test süreci", project: project3, assignee: admin, status: TaskStatus.doing, priority: TaskPriority.high },
    { title: "Crash reporting", project: project3, assignee: editor1, status: TaskStatus.done, priority: TaskPriority.urgent },
    { title: "Analytics entegrasyonu", project: project3, assignee: editor2, status: TaskStatus.todo, priority: TaskPriority.medium },
    { title: "UI/UX iyileştirmeleri", project: project3, assignee: admin, status: TaskStatus.doing, priority: TaskPriority.high },
  ];

  const createdTasks = [];
  for (let i = 0; i < taskTitles.length; i++) {
    const t = taskTitles[i];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 10);

    const task = await prisma.task.create({
      data: {
        title: t.title,
        description: `${t.title} için detaylı açıklama ve gereksinimler burada yer alacak.`,
        status: t.status,
        priority: t.priority,
        dueDate,
        order: i,
        projectId: t.project.id,
        assigneeId: t.assignee.id,
      },
    });

    createdTasks.push(task);

    // Her task'a 1-3 label ekle
    const projectLabels = labels.filter((l) => l.projectId === t.project.id);
    if (projectLabels.length > 0) {
      const numLabels = Math.min(projectLabels.length, Math.floor(Math.random() * 3) + 1);
      const shuffled = projectLabels.sort(() => 0.5 - Math.random());
      for (let j = 0; j < numLabels; j++) {
        await prisma.taskLabel.create({
          data: {
            taskId: task.id,
            labelId: shuffled[j].id,
          },
        });
      }
    }
  }

  console.log("✅ Tasks created:", createdTasks.length);

  // 6. Subtask'lar oluştur
  console.log("📝 Creating subtasks...");
  let subtaskCount = 0;
  for (const task of createdTasks.slice(0, 10)) {
    const numSubtasks = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numSubtasks; i++) {
      await prisma.subtask.create({
        data: {
          title: `Alt görev ${i + 1}`,
          completed: Math.random() > 0.5,
          order: i,
          taskId: task.id,
        },
      });
      subtaskCount++;
    }
  }
  console.log("✅ Subtasks created:", subtaskCount);

  // 7. Yorumlar oluştur
  console.log("💬 Creating comments...");
  const commentTexts = [
    "Bu konuda ilerleme kaydettik, yarın update paylaşacağım.",
    "Harika iş! 🎉",
    "Bunu öncelik olarak ele almamız gerekiyor.",
    "Test sonuçları olumlu görünüyor.",
    "Bir sorun fark ettim, kontrol eder misiniz?",
    "PR hazır, review bekliyorum.",
    "Design onaylandı, implementasyona başlayabiliriz.",
    "Deadline konusunda güncelleme yapalım mı?",
    "Bu feature için ek kaynak gerekebilir.",
    "Müşteri geri bildirimi olumlu!",
  ];

  const users = [admin, editor1, editor2, viewer];
  let commentCount = 0;

  for (const task of createdTasks.slice(0, 15)) {
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numComments; i++) {
      await prisma.comment.create({
        data: {
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          taskId: task.id,
          userId: users[Math.floor(Math.random() * users.length)].id,
        },
      });
      commentCount++;
    }
  }
  console.log("✅ Comments created:", commentCount);

  // 8. User Preferences oluştur
  console.log("⚙️ Creating user preferences...");
  for (const user of users) {
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        theme: "dark",
        language: "tr",
        timezone: "Europe/Istanbul",
        notifications: true,
        emailNotifications: true,
      },
    });
  }
  console.log("✅ User preferences created");

  console.log("\n✨ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: 4 (admin, 2 editors, 1 viewer)`);
  console.log(`   - Workspace: 1`);
  console.log(`   - Projects: 3`);
  console.log(`   - Labels: ${labels.length}`);
  console.log(`   - Tasks: ${createdTasks.length}`);
  console.log(`   - Subtasks: ${subtaskCount}`);
  console.log(`   - Comments: ${commentCount}`);
  console.log("\n🔐 Test credentials:");
  console.log(`   - Admin: admin@bpms.io / Password123!`);
  console.log(`   - Editor: editor1@bpms.io / Password123!`);
  console.log(`   - Editor: editor2@bpms.io / Password123!`);
  console.log(`   - Viewer: viewer@bpms.io / Password123!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

