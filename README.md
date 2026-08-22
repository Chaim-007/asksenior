# AskSenior — Learn without being afraid to ask.

> A course-scoped, anonymous doubt-solving platform where juniors can ask questions without fear of embarrassment or judgment, while seniors share explanations and build credibility.

Built for the **Student Life** Hackathon challenge.

---

## 🚩 The Problem

In college and university life, students frequently hesitate to ask basic, foundational, or "obvious" questions in large WhatsApp groups, Slack channels, or crowded lecture halls. The fear of being judged by peers or seniors creates silent confusion—causing juniors to fall behind unnoticed.

At the same time, upperclassmen and seniors who have already conquered the coursework possess valuable context and mental models, but lack a low-friction, centralized channel to help juniors without being inundated with individual direct messages (DMs).

---

## 💡 The Solution

**AskSenior** solves both sides of the problem through a zero-friction academic community:

1. **Strict Asker Anonymity**: Juniors can choose a course and ask questions with **zero name or identity fields**. Anonymity is guaranteed by design to eliminate hesitation and social risk.
2. **Selective Senior Credibility**: Answerers can choose between remaining anonymous or attaching their academic credentials (e.g., *Rahul · 3rd Year · Computer Engineering*) with a verified **Senior** badge.
3. **Explanation Levels**: Every answer specifies its depth (🟢 *Beginner*, 🟡 *Intermediate*, 🔴 *Advanced*), allowing juniors to find explanations tailored to their current baseline.
4. **Most Helpful Answer**: The community votes up top explanations, dynamically crowning the 🏆 **Most Helpful Answer** at the top of the thread.
5. **Course-Scoped Discovery**: Real-time filters and search organize doubts strictly around actual college subjects (e.g. *Data Structures*, *Calculus*, *Physics*, *Programming*, *Thermodynamics*).

---

## ✨ Key Features

- 🔒 **Zero Identity Asker Experience**: No profile creation, no login barrier, and no name fields for asking questions.
- 📚 **Course & Subject Hubs**: Pre-populated with core engineering and university courses, plus one-click custom subject creation.
- 🎯 **Multidimensional Filtering & Instant Search**:
  - Filter by Subject (*Data Structures, Calculus, Physics, Programming, Thermodynamics, Communication Skills, etc.*)
  - Filter by Doubt Category (*Conceptual, Assignment, Exam Prep, Lab, General*)
  - Filter by Resolution State (*All, 🟢 Resolved, 🟠 Open Doubts*)
  - Sort by *Most Upvoted*, *Newest*, or *Most Answers*
  - Instant live keyword search matching doubts, subjects, and peer answers
- 🎓 **Senior Badges & Academic Credentials**: Optional identity for upperclassmen to showcase experience and build credibility.
- 🟢 **3-Tier Explanation Levels**:
  - 🟢 **Beginner**: Analogies, mental models, ELI5 clarity.
  - 🟡 **Intermediate**: Step-by-step logic, code patterns, time complexity.
  - 🔴 **Advanced**: Low-level memory, underlying theory, edge cases.
- 🏆 **Dynamic Most Helpful Answer**: Automatic calculation of the highest-rated peer explanation (with oldest timestamp as tie-breaker).
- 👍 **Session-Persistent Upvoting**: Seamless upvoting for questions and answers with duplicate vote prevention stored in localStorage.
- 🟢 **One-Click Doubt Resolution**: Mark questions as resolved with interactive celebration feedback.
- 📊 **Live Dynamic Statistics**: Real-time metrics calculating total doubts asked, doubts resolved (with % resolution rate), total peer explanations, and top active courses.
- ⚡ **60-Second Demo Walkthrough Modal**: Built-in interactive pitch guide for hackathon judges and demo presentations.
- 🌙 **Dark & Light Mode**: Clean, calm academic aesthetic with automatic system preference detection and manual toggle.
- 📱 **100% Responsive & Accessible**: Mobile-first design, keyboard-friendly navigation, semantic HTML, and zero layout overflows.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) + [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) REST API (`http://localhost:3001/api`) with CORS & JSON body parsers
- **Database**: File-persisted JSON database engine (`server/data/db.json`) + Client fallback (`localStorage`)

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Option A: Run Full Stack (Frontend + Backend Concurrently)

```bash
cd /Users/chaitanyagupta/.gemini/antigravity/scratch/asksenior
npm run dev:all
```

This starts:
- 🎨 **Frontend UI**: [`http://localhost:5173`](http://localhost:5173)
- 🚀 **REST API Server**: [`http://localhost:3001/api`](http://localhost:3001/api)

### Option B: Run Services Separately

1. **Start Backend Server**:
   ```bash
   npm run server
   ```
2. **Start Frontend Client**:
   ```bash
   npm run dev
   ```

---

## ⏱️ 60-Second Hackathon Demo Flow

To demonstrate the full product loop in under a minute:

1. **Select Course**: Click **Data Structures** on the subject selector strip.
2. **Ask Anonymously**: Click **+ Ask Anonymously** (or use the sample prompt pre-fill):
   > *"I've heard everyone talk about pointers but I still don't understand what they actually do. Can someone explain them like I'm a beginner?"*
3. **Show Anonymity**: Note that the doubt appears with `🔒 Posted anonymously` with zero asker identity.
4. **Answer as Senior**: Open the doubt and submit an explanation as **Rahul · 3rd Year · Senior** with a 🟢 **Beginner explanation**.
5. **Upvote & Crowning**: Upvote the answer to reveal the 🏆 **Most Helpful Answer** gold badge.
6. **Mark Resolved**: Click **Mark as Resolved** (🟢) to close the learning loop.

---

## 🔮 Future Evolution & Roadmap

While this prototype is intentionally serverless and lightweight for the hackathon:

1. **Verified College Email Domains (`@campus.edu`)**: Automatic cohort verification without exposing real names to juniors.
2. **End-to-End Encrypted Question Vault**: Zero-knowledge storage so even database administrators cannot link question text to user IDs.
3. **Senior Karma & Alumni Badging**: Earning verified karma scores for helpful answers that translate into verifiable LinkedIn/resume skill credentials.
4. **AI-Assisted Prerequisite Mapping**: Grouping related conceptual doubts into visual course knowledge graphs.
5. **Professor / TA Endorsements**: Special gold badge for course staff to officially endorse outstanding student explanations.

---

## 📄 License

MIT License. Built with ❤️ for college students everywhere.
