// Mock Database using LocalStorage for persistence in demo
export const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science"];

export const INITIAL_CONTENT = [
  {
    id: "c1",
    teacherId: "t1",
    teacherName: "John Teacher",
    title: "Introduction to Calculus",
    subject: "Mathematics",
    description: "Basic concepts of derivatives and integrals.",
    fileUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
    startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    endTime: new Date(Date.now() + 3600000).toISOString(),   // 1 hour from now
    rotationDuration: 30,
    status: "approved",
    createdAt: new Date().toISOString()
  },
  {
    id: "c2",
    teacherId: "t1",
    teacherName: "John Teacher",
    title: "The Periodic Table",
    subject: "Chemistry",
    description: "Understanding elements and their properties.",
    fileUrl: "https://images.unsplash.com/photo-1532187875605-2fe358511423?w=800&auto=format&fit=crop",
    startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 90000000).toISOString(),
    rotationDuration: 45,
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "c3",
    teacherId: "t2",
    teacherName: "Jane Smith",
    title: "World War II Overview",
    subject: "History",
    description: "Key events and consequences of the global conflict.",
    fileUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&auto=format&fit=crop",
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() - 3600000).toISOString(),
    rotationDuration: 60,
    status: "rejected",
    rejectionReason: "Incomplete description and low-quality preview image.",
    createdAt: new Date().toISOString()
  }
];

export const getStore = () => {
  if (typeof window === 'undefined') return { content: [] };
  const stored = localStorage.getItem("broadcast_store");
  if (!stored) {
    localStorage.setItem("broadcast_store", JSON.stringify({ content: INITIAL_CONTENT }));
    return { content: INITIAL_CONTENT };
  }
  return JSON.parse(stored);
};

export const saveStore = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("broadcast_store", JSON.stringify(data));
  }
};
