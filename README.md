# AskSenior — Learn without being afraid to ask.

> A course-scoped, anonymous doubt-solving platform where juniors can ask questions without fear of embarrassment or judgment, while seniors share explanations and build credibility.

Built for the **Student Life** Hackathon challenge at **PromptWars x OWASP TIET**.

---

## 🎯 Chosen Vertical

**Student Life** — Building a targeted solution that addresses the social hesitation, academic isolation, and peer-to-peer mentorship gaps commonly experienced by college students during their coursework.

---

## 🚩 The Problem

In college and university life, students frequently hesitate to ask basic, foundational, or "obvious" questions in large WhatsApp groups, Discord/Slack channels, or crowded lecture halls. The psychological fear of being judged by peers or seniors creates silent confusion—causing juniors to fall behind unnoticed.

At the same time, upperclassmen and seniors who have already conquered the coursework possess valuable context and mental models, but lack a low-friction, centralized channel to help juniors without being inundated with repetitive individual direct messages (DMs).

---

## 🧠 Approach & Logic

AskSenior approaches academic doubt solving by restructuring the incentives and friction points of campus communication:

1. **Decoupling Question Asking from Identity**: By completely removing identity fields on questions, students can ask basic conceptual doubts with zero social cost or embarrassment.
2. **Context-Aware Scoping**: Doubts are tied strictly to academic subjects (*Data Structures, Calculus, Physics, Programming, Thermodynamics, Communication Skills*) and categorized by intent (*Conceptual, Assignment, Exam Prep, Lab, General*).
3. **Calibrated Depth Matching**: Answers are categorized into **3 Explanation Levels** (🟢 *Beginner*, 🟡 *Intermediate*, 🔴 *Advanced*) so juniors receive mental models appropriate to their current baseline.
4. **Peer Validation & Automatic Elevation**: Instead of complex moderation, peer upvotes automatically crown and pin the 🏆 **Most Helpful Answer** to the top of each doubt thread.
5. **Closing the Feedback Loop**: A one-click 🟢 **Resolved** toggle reinforces positive learning outcomes with celebration micro-interactions.

---

## ⚙️ How the Solution Works

```
                                    ASKSENIOR ARCHITECTURE
                                    
 [ Junior / Student ]                                          [ Senior / Peer ]
         │                                                            │
         ▼                                                            ▼
 ┌──────────────────────┐                                   ┌──────────────────────┐
 │  Ask Doubt (Anon)    │                                   │ Share Explanation    │
 │  - Select Course     │                                   │ - Anonymous / Named  │
 │  - Pick Category     │                                   │ - Senior Badge       │
 │  - NO Name Collected │                                   │ - Depth: Beg/Int/Adv │
 └──────────┬───────────┘                                   └──────────┬───────────┘
            │                                                          │
            ▼                                                          ▼
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                            Doubt Feed & Engine Layer                            │
 │  • Multidimensional Filter & Search (Subject, Category, State, Sort)            │
 │  • Dynamic Upvote Deduplication (localStorage / Session Key)                    │
 │  • Dynamic "Most Helpful Answer" Algorithm (Highest Score + Oldest Tie-breaker) │
 │  • Live Platform Statistics Ribbon (Total Doubts, Resolved %, Top Courses)      │
 └────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │  Vite + React Frontend │                      │ Express REST API (3001)│
     │  (Tailwind, Lucide UI) │◄────────────────────►│ File-Persisted JSON DB │
     └────────────────────────┘                      └────────────────────────┘
```

### Step-by-Step Flow:
1. **Explore & Filter**: Students browse questions scoped by course, doubt type, or resolution status, or search via instant real-time keywords.
2. **Post Anonymously**: The student clicks `+ Ask Anonymously`. The application enforces strict zero-identity—no name or profile is collected or stored.
3. **Senior Contribution**: Seniors review open doubts and provide structured explanations with designated depth tags (e.g. *Beginner ELI5*). Seniors can optionally attach academic credentials (*Rahul · 3rd Year · Computer Engineering*) with a verified badge.
4. **Upvoting & Crowning**: Community upvotes dynamically crown the highest-rated response as the 🏆 **Most Helpful Answer** and sort it to the top.
5. **Resolution**: Once understood, the question is marked 🟢 **Resolved**, visually closing the doubt.

---

## 🔍 Key Assumptions Made

1. **Course-Centric Hierarchy**: We assume academic doubt-solving is most effective when organized by specific course titles rather than broad generic forums.
2. **Optional Senior Identity**: We assume askers want 100% strict anonymity, while answerers value the choice to build peer credibility (via senior badges) or remain anonymous.
3. **Lightweight Client-Server Hybrid**: We assume hackathon demo setups need zero-configuration reliability—the app runs full-stack via Express on port 3001 with automatic seamless fallback to `localStorage` if offline.
4. **Session-Level Vote Deduplication**: In the absence of heavy OAuth services, client fingerprinting prevents multi-voting within the user's browser session.

---

## 🛡️ Security & Privacy Considerations

- **Strict Zero-Identity Asker Protection**: Zero name, email, avatar, or IP addresses are linked to questions.
- **Client-Side Data Sanitization**: All user inputs are sanitized before rendering to prevent XSS.
- **No Paid or External Tracking APIs**: Zero tracking pixels, telemetry, or external database queries.

---

## ♿ Accessibility & Code Quality

- **Semantic HTML5**: Native `<header>`, `<main>`, `<article>`, `<section>`, and `<button>` elements throughout.
- **Keyboard Navigation**: Full modal traps, `Escape` key handlers, and shortcut support (`Cmd/Ctrl + Enter`).
- **Color Contrast & Readability**: High-contrast text palettes across both Light and Dark themes.
- **Responsive Layout**: Fluid breakpoints tested across Mobile, Tablet, Laptop, and Desktop.

---

## ✨ Key Features

- 🔒 **Zero Identity Asker Experience**: No profile creation, no login barrier, and no name fields for asking questions.
- 📚 **Course & Subject Hubs**: Pre-populated with core university courses (*Data Structures*, *Calculus*, *Physics*, *Programming*, *Thermodynamics*, *Communication Skills*) + one-click custom course addition.
- 🎯 **Multidimensional Filtering & Instant Search**:
  - Filter by Subject
  - Filter by Category (*Conceptual, Assignment, Exam Prep, Lab, General*)
  - Filter by State (*All, 🟢 Resolved, 🟠 Open*)
  - Sort by *Most Upvoted*, *Newest*, or *Most Answers*
  - Instant live keyword search matching questions and answer content
- 🎓 **Senior Badges & Academic Credentials**: Optional identity for upperclassmen to showcase experience and build credibility.
- 🟢 **3-Tier Explanation Levels**:
  - 🟢 **Beginner**: Analogies, mental models, ELI5 clarity.
  - 🟡 **Intermediate**: Step-by-step logic, code patterns, time complexity.
  - 🔴 **Advanced**: Low-level memory, underlying theory, edge cases.
- 🏆 **Dynamic Most Helpful Answer**: Automatic calculation of the highest-rated peer explanation (with oldest timestamp as tie-breaker).
- 👍 **Session-Persistent Upvoting**: Seamless upvote system for questions and answers with deduplication stored in localStorage.
- 🟢 **One-Click Doubt Resolution**: Mark questions as resolved with interactive celebration feedback.
- 📊 **Live Dynamic Statistics**: Real-time metrics calculating total doubts asked, doubts resolved (with % resolution rate), total peer explanations, and top active courses.
- ⚡ **60-Second Demo Walkthrough Modal**: Built-in interactive pitch guide for hackathon judges and demo presentations.
- 🌙 **Dark & Light Mode**: Clean, calm academic aesthetic with automatic system preference detection and manual toggle.
- 📱 **100% Responsive**: Mobile-first design, keyboard-friendly navigation, and zero horizontal overflows.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) + [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) REST API (`http://localhost:3001/api`) with CORS & JSON body parsers
- **Database**: File-persisted JSON database engine (`server/data/db.json`) + Client fallback (`localStorage`)
- **Containerization**: Production `Dockerfile` ready for Google Cloud Run

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Option A: Run Full Stack (Frontend + Backend Concurrently)

```bash
cd asksenior
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

While this prototype is intentionally lightweight and zero-friction for the hackathon:

1. **Verified College Email Domains (`@campus.edu`)**: Automatic cohort verification without exposing real names to juniors.
2. **End-to-End Encrypted Question Vault**: Zero-knowledge storage so even database administrators cannot link question text to user IDs.
3. **Senior Karma & Alumni Badging**: Earning verified karma scores for helpful answers that translate into verifiable LinkedIn/resume skill credentials.
4. **AI-Assisted Prerequisite Mapping**: Grouping related conceptual doubts into visual course knowledge graphs.
5. **Professor / TA Endorsements**: Special gold badge for course staff to officially endorse outstanding student explanations.

---

## 📄 License

MIT License. Built with ❤️ for college students everywhere.
