import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_SUBJECTS = [
  { id: 'sub-1', name: 'Data Structures', code: 'CS201', color: 'indigo' },
  { id: 'sub-2', name: 'Calculus', code: 'MATH101', color: 'blue' },
  { id: 'sub-3', name: 'Programming', code: 'CS101', color: 'emerald' },
  { id: 'sub-4', name: 'Physics', code: 'PHY101', color: 'amber' },
  { id: 'sub-5', name: 'Thermodynamics', code: 'ME202', color: 'rose' },
  { id: 'sub-6', name: 'Communication Skills', code: 'HU101', color: 'purple' },
];

const INITIAL_QUESTIONS = [
  {
    id: 'q-1',
    subject: 'Data Structures',
    category: 'Conceptual',
    content: "I understand arrays, but I don't understand why linked lists are useful. Can someone explain it simply?",
    upvotes: 16,
    isResolved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    answers: [
      {
        id: 'ans-101',
        questionId: 'q-1',
        content: "Think of an **array** like booking an entire consecutive row in a movie theater. If you have 5 friends, you need 5 empty seats right next to each other. If someone wants to sit between you, everyone has to shift down one seat (slow!).\n\nA **linked list** is like a scavenger hunt. Your friends can sit anywhere in the theater. Each friend just holds a piece of paper pointing to where the next friend is sitting. If a new friend joins, you just change the pointer on one piece of paper without moving anyone!",
        authorType: 'Named',
        authorName: 'Rahul',
        academicInfo: '3rd Year · Computer Engineering',
        isSenior: true,
        explanationLevel: 'Beginner',
        upvotes: 21,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: 'ans-102',
        questionId: 'q-1',
        content: "From a time-complexity perspective:\n- Array insertion at the beginning: **O(n)** because every element must shift.\n- Linked List insertion at head: **O(1)** because you only adjust `newNode->next = head`.\n\nAlso, arrays require contiguous memory blocks, whereas linked list nodes are allocated dynamically on the heap on demand.",
        authorType: 'Anonymous',
        isSenior: false,
        explanationLevel: 'Intermediate',
        upvotes: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: 'q-2',
    subject: 'Data Structures',
    category: 'Conceptual',
    content: "Can someone explain pointers like I'm completely new to programming?",
    upvotes: 23,
    isResolved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    answers: [
      {
        id: 'ans-201',
        questionId: 'q-2',
        content: "Imagine your computer's memory is a giant apartment complex where every apartment has a unique door number (address, e.g. `0x7ffeeb`).\n\nA normal variable holds the **person** living inside the apartment (e.g. `int x = 42`).\n\nA **pointer** is just a sticky note that writes down someone's door number (e.g. `int *ptr = &x`).\n\nWhen you say `*ptr`, you're saying: *'Go to the door number written on this sticky note and look at what is inside.'* That's all dereferencing is!",
        authorType: 'Named',
        authorName: 'Priya',
        academicInfo: '4th Year · Computer Science',
        isSenior: true,
        explanationLevel: 'Beginner',
        upvotes: 29,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
      },
      {
        id: 'ans-202',
        questionId: 'q-2',
        content: "Why do we use pointers instead of copying values? If you have a huge struct (e.g. 50MB image), copying it to a function creates a duplicate in memory (costly). Passing a pointer sends just an 8-byte memory address so the function works directly on the original!",
        authorType: 'Anonymous',
        isSenior: false,
        explanationLevel: 'Intermediate',
        upvotes: 11,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      },
    ],
  },
  {
    id: 'q-3',
    subject: 'Calculus',
    category: 'Exam Prep',
    content: "How do I know when to use integration by parts vs u-substitution in our midterm?",
    upvotes: 14,
    isResolved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    answers: [
      {
        id: 'ans-301',
        questionId: 'q-3',
        content: "Here is the golden rule for exams:\n\n1. **Look for u-substitution first**: Check if the integrand contains a function AND its derivative (e.g., in $\\int 2x e^{x^2} dx$, the derivative of $x^2$ is $2x$).\n2. **Use Integration by Parts** when you have a product of two unrelated families of functions (e.g., $x \\cdot \\sin(x)$ or $x \\cdot e^x$).\n\nRemember the **LIATE** hierarchy to pick $u$:\n- **L**: Logarithmic\n- **I**: Inverse Trigonometric\n- **A**: Algebraic ($x^2, 3x$)\n- **T**: Trigonometric\n- **E**: Exponential",
        authorType: 'Named',
        authorName: 'Aman',
        academicInfo: '3rd Year · Mechanical Engineering',
        isSenior: true,
        explanationLevel: 'Intermediate',
        upvotes: 19,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      },
    ],
  },
  {
    id: 'q-4',
    subject: 'Programming',
    category: 'Lab',
    content: "Why does my C program compile cleanly but give a segmentation fault (core dumped) when running?",
    upvotes: 19,
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    answers: [
      {
        id: 'ans-401',
        questionId: 'q-4',
        content: "A **Segmentation Fault** means the compiler checked your syntax and found no grammar mistakes, but at runtime, your program tried to read or write to a memory location it does not own.\n\nTop 3 causes in C Lab assignments:\n1. **Uninitialized pointer**: `int *p; *p = 10;` (points to garbage memory! Allocate with `malloc` or point to existing variable first).\n2. **Array index out of bounds**: `arr[10]` on an array of size 10 (valid indices are 0 to 9).\n3. **scanf missing ampersand**: `scanf(\"%d\", num);` instead of `scanf(\"%d\", &num);`.",
        authorType: 'Anonymous',
        isSenior: false,
        explanationLevel: 'Beginner',
        upvotes: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
      },
    ],
  },
  {
    id: 'q-5',
    subject: 'Physics',
    category: 'Conceptual',
    content: "What's the easiest way to understand rotational inertia (moment of inertia)?",
    upvotes: 11,
    isResolved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    answers: [
      {
        id: 'ans-501',
        questionId: 'q-5',
        content: "Think of regular mass as *'how hard it is to push something in a straight line'*. Rotational inertia is *'how hard it is to spin something around an axis'*.\n\nThe key is distance from the pivot ($I = m r^2$).\n\nTry this right now: Hold a heavy ruler or hammer right near the heavy head and wiggle your wrist. Easy! Now hold it from the far tip of the handle and try to wiggle your wrist. It feels much heavier, even though the total mass didn't change! That extra resistance is rotational inertia.",
        authorType: 'Named',
        authorName: 'Sneha',
        academicInfo: '4th Year · Engineering Physics',
        isSenior: true,
        explanationLevel: 'Beginner',
        upvotes: 14,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  },
  {
    id: 'q-6',
    subject: 'Thermodynamics',
    category: 'Assignment',
    content: "What is the true physical meaning of entropy? Everywhere it says 'disorder' but our professor said that's misleading.",
    upvotes: 8,
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    answers: [
      {
        id: 'ans-601',
        questionId: 'q-6',
        content: "Your professor is spot on. 'Disorder' is a human metaphor, not thermodynamics.\n\nA much more rigorous physical intuition is **Energy Dispersion** or **Statistical Probability** ($S = k_B \\ln \\Omega$).\n\nEntropy measures how many microscopic ways (microstates) thermal energy can distribute itself across the particles without changing the macro temperature and pressure. Heat flows from hot to cold simply because there are vastly more ways for dispersed energy to exist than concentrated energy.",
        authorType: 'Named',
        authorName: 'Vikram',
        academicInfo: 'Graduate Senior · Mechanical',
        isSenior: true,
        explanationLevel: 'Advanced',
        upvotes: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'q-7',
    subject: 'Communication Skills',
    category: 'General',
    content: "How do you introduce yourself in technical campus placements without sounding like a robotic resume readout?",
    upvotes: 21,
    isResolved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    answers: [
      {
        id: 'ans-701',
        questionId: 'q-7',
        content: "Use the **Present → Past → Future framework** (keep it under 75 seconds):\n\n1. **Present (20s)**: \"I'm a 3rd year CS student who loves building backend microservices and distributed caching.\"\n2. **Past (30s)**: \"Recently, I built a real-time doubt-solving app for my campus where I solved race conditions in concurrent voting using optimistic locks.\"\n3. **Future (25s)**: \"I'm really excited about this role at [Company] because your distributed systems team works on the exact scale challenges I want to master.\"\n\nNotice you didn't list every high school mark or course code—you told a coherent story!",
        authorType: 'Named',
        authorName: 'Ananya',
        academicInfo: '4th Year Placed · ECE',
        isSenior: true,
        explanationLevel: 'Beginner',
        upvotes: 25,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
];

class Database {
  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading database file, resetting to initial state', e);
    }

    const initial = {
      subjects: INITIAL_SUBJECTS,
      questions: INITIAL_QUESTIONS,
      lastUpdated: new Date().toISOString(),
    };
    this.saveData(initial);
    return initial;
  }

  saveData(data = this.data) {
    try {
      this.ensureDataDir();
      data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing to database file', e);
    }
  }

  // Subjects
  getSubjects() {
    return this.data.subjects;
  }

  addSubject(name, code) {
    const cleanName = name.trim();
    const existing = this.data.subjects.find(
      s => s.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (existing) return existing;

    const colors = ['indigo', 'blue', 'emerald', 'amber', 'rose', 'purple', 'cyan', 'teal'];
    const newSubject = {
      id: `sub-${Date.now()}`,
      name: cleanName,
      code: code?.trim() || cleanName.substring(0, 3).toUpperCase(),
      color: colors[this.data.subjects.length % colors.length],
      isCustom: true,
    };

    this.data.subjects.push(newSubject);
    this.saveData();
    return newSubject;
  }

  // Questions
  getQuestions() {
    return this.data.questions;
  }

  getQuestionById(id) {
    return this.data.questions.find(q => q.id === id) || null;
  }

  addQuestion({ subject, category, content }) {
    const newQuestion = {
      id: `q-${Date.now()}`,
      subject: subject.trim(),
      category: category || 'Conceptual',
      content: content.trim(),
      upvotes: 0,
      isResolved: false,
      answers: [],
      createdAt: new Date().toISOString(),
    };

    this.data.questions.unshift(newQuestion);
    this.saveData();
    return newQuestion;
  }

  toggleResolveQuestion(id) {
    const question = this.getQuestionById(id);
    if (!question) return null;

    question.isResolved = !question.isResolved;
    this.saveData();
    return question;
  }

  upvoteQuestion(id, delta = 1) {
    const question = this.getQuestionById(id);
    if (!question) return null;

    question.upvotes = Math.max(0, question.upvotes + delta);
    this.saveData();
    return question;
  }

  // Answers
  addAnswer(questionId, { content, authorType, authorName, academicInfo, isSenior, explanationLevel }) {
    const question = this.getQuestionById(questionId);
    if (!question) return null;

    const newAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      content: content.trim(),
      authorType: authorType || 'Anonymous',
      authorName: authorType === 'Named' ? (authorName?.trim() || 'Student') : undefined,
      academicInfo: authorType === 'Named' ? academicInfo?.trim() : undefined,
      isSenior: authorType === 'Named' ? Boolean(isSenior) : false,
      explanationLevel: explanationLevel || 'Beginner',
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    question.answers.push(newAnswer);
    this.saveData();
    return newAnswer;
  }

  upvoteAnswer(questionId, answerId, delta = 1) {
    const question = this.getQuestionById(questionId);
    if (!question) return null;

    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return null;

    answer.upvotes = Math.max(0, answer.upvotes + delta);
    this.saveData();
    return answer;
  }

  // Stats
  getStats() {
    const totalQuestions = this.data.questions.length;
    const totalResolved = this.data.questions.filter(q => q.isResolved).length;
    const totalAnswers = this.data.questions.reduce((sum, q) => sum + q.answers.length, 0);

    const subjectCounts = {};
    this.data.questions.forEach(q => {
      subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
    });

    const activeSubjects = Object.entries(subjectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const resolutionRate = totalQuestions > 0 ? Math.round((totalResolved / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      totalResolved,
      totalAnswers,
      activeSubjects,
      resolutionRate,
    };
  }

  reset() {
    this.data = {
      subjects: JSON.parse(JSON.stringify(INITIAL_SUBJECTS)),
      questions: JSON.parse(JSON.stringify(INITIAL_QUESTIONS)),
      lastUpdated: new Date().toISOString(),
    };
    this.saveData();
    return this.data;
  }
}

export const db = new Database();
