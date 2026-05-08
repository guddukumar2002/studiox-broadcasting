// Mock Database using LocalStorage for persistence in demo
export const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science"];

const TEACHERS = [
  { id: "t1", name: "John Teacher" },
  { id: "t2", name: "Jane Smith" },
  { id: "t3", name: "Robert Brown" },
];

const STATUSES = ["approved", "pending", "rejected"];

// Reliable Unsplash images — using /photos/:id/download?w=800 format which never breaks
const IMAGES = [
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532187875605-2fe358511423?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80&auto=format&fit=crop",
];

// Fallback placeholder when any image fails to load
export const IMG_FALLBACK = "https://placehold.co/800x450/EFF6FF/2563EB?text=StudioX";

const TITLES = [
  "Introduction to Calculus", "The Periodic Table", "World War II Overview",
  "Newton's Laws of Motion", "Cell Biology Basics", "Photosynthesis Explained",
  "Algebra Fundamentals", "Organic Chemistry", "The French Revolution",
  "Plate Tectonics", "Data Structures in CS", "Quantum Physics Intro",
  "Trigonometry Basics", "Atomic Structure", "The Cold War",
  "Climate & Weather Patterns", "Algorithms & Complexity", "Genetics & DNA",
  "Electromagnetic Waves", "World Geography Overview",
];

function generateLargeDataset(count = 50) {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const teacher    = TEACHERS[i % TEACHERS.length];
    const subject    = SUBJECTS[i % SUBJECTS.length];
    const status     = STATUSES[i % STATUSES.length];
    const offsetMs   = (i - 10) * 3600000;
    const startTime  = new Date(now + offsetMs).toISOString();
    const endTime    = new Date(now + offsetMs + 7200000).toISOString();
    return {
      id: `seed_${i + 1}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      title: TITLES[i % TITLES.length] + (i >= TITLES.length ? ` (${Math.floor(i / TITLES.length) + 1})` : ""),
      subject,
      description: `A comprehensive lesson on ${subject.toLowerCase()} covering key concepts and real-world applications for students.`,
      fileUrl: IMAGES[i % IMAGES.length],
      startTime,
      endTime,
      rotationDuration: 30 + (i % 4) * 15,
      status,
      ...(status === "rejected" ? { rejectionReason: "Content needs more detail and better quality visuals." } : {}),
      createdAt: new Date(now - i * 86400000).toISOString(),
    };
  });
}

export const INITIAL_CONTENT = generateLargeDataset(50);

export const getStore = () => {
  if (typeof window === "undefined") return { content: INITIAL_CONTENT };
  try {
    const stored = localStorage.getItem("broadcast_store");
    if (!stored) {
      const initial = { content: INITIAL_CONTENT };
      localStorage.setItem("broadcast_store", JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch {
    return { content: INITIAL_CONTENT };
  }
};

export const saveStore = (data) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("broadcast_store", JSON.stringify(data));
    } catch {
      // localStorage quota exceeded — fail silently in demo
    }
  }
};

if (typeof window !== "undefined") {
  window.__resetStore = () => {
    localStorage.removeItem("broadcast_store");
    window.location.reload();
  };
}
