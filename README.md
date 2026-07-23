<div align="center">

# 💳 SubCue AI

### AI Financial Wellness for Digital Subscriptions

**Never pay for forgotten subscriptions again.**  
**Smarter subscriptions. Healthier spending.**

--- 

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Groq](https://img.shields.io/badge/Groq-Llama3-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**[Live Demo on Vercel](#) | [Public GitHub Repository](#)** *(URLs pending deployment)*

</div>

---

## 1. Context & The Problem

Digital subscriptions have become part of everyday life. Streaming platforms, AI tools, cloud storage, productivity software, and gaming services often renew automatically. As users subscribe to more services, they face several challenges:

* Forgetting renewal dates
* Losing track of monthly spending
* Paying for services they rarely use
* Keeping multiple subscriptions with overlapping functionality
* Lacking visibility into long-term subscription costs

Most reminder applications only notify users before renewal. They do **not** help users understand whether those subscriptions are still worth paying for.

---

## 2. The Solution

**SubCue AI** combines intelligent reminders with AI-powered spending analysis. Instead of simply reminding users about upcoming renewals, SubCue AI evaluates subscription health and provides personalized recommendations to optimize recurring expenses.

### Core Features
* **Smart Renewal Reminder:** Auto-sync your upcoming bills directly to **Google Calendar** (H-3 Reminders).
* **Enterprise Dashboard:** Monitor active subscriptions with a sleek 3-column layout.
* **Advanced Analytics:** Interactive charts (using Recharts) mapping your historical and projected spending with dynamic time frames (3m, 6m, 1y).
* **AI Efficiency Score:** Powered by **Groq & Llama-3**, AI calculates the health of your digital spending instantly.
* **Personalized AI Recommendations:** Actionable advice on downgrading, cancelling, or keeping services in native Indonesian.
* **AI Chat Assistant:** Ask natural language questions about your budget directly in the dashboard.
* **Theme Support:** Polished Dark and Light mode toggling at the root level.

---

## 3. Tech Stack & Architecture

We built SubCue AI using a microservices-oriented approach, splitting the Frontend and Backend to ensure scalability.

**Frontend (FE): Next.js + TailwindCSS + shadcn/ui**
* Deployed on Vercel.
* Handles UI, routing, and user interactions.

**Backend (Microservice): FastAPI + Python + SQLite**
* Deployed on Railway / Render.
* Handles AI logic (integrating with **Groq API / Llama-3** for ultra-low latency responses).
* Fallback support to OpenRouter.

**Why this architecture?**
Separating the backend allows us to easily scale the AI processing engine, utilize Python's robust AI/ML ecosystem, and leverage Groq's lightning-fast inference, while Next.js handles a blazing-fast React frontend.

---

## 4. Execution & How to Run Locally

### Execution Status
**Status:** MVP Completed within the 3-hour hackathon timeframe.

### How to Run

**1. Clone Repository**
```bash
git clone https://github.com/username/SubCue-ai.git
cd SubCue-ai
```

**2. Backend Setup (FastAPI)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Copy environment variables
cp .env.example .env
# Run server
uvicorn main:app --reload
```

**3. Frontend Setup (Next.js)**
```bash
cd frontend
npm install
# Copy environment variables
cp .env.example .env.local
# Run server
npm run dev
```

---

## 5. Security & Challenge Handling

**How we prevent Leaked API Keys (Security Challenge)**
During the hackathon, a common challenge is accidentally pushing API keys (like Groq/OpenRouter keys) to GitHub. To prevent this, we implemented:
1. **Environment Variables:** All sensitive keys are stored in `.env` files.
2. **.gitignore strictness:** Ensured `.env`, `.env.local`, and any SQLite `.db` files are in `.gitignore` from the very first commit.
3. **Environment Templates:** Provided `.env.example` files containing only dummy keys for safe sharing.
4. **Platform Secrets:** Real keys are only injected directly into the deployment platforms' environment variables settings.

---

## 6. Working Demo (MVP Scope)

What is 100% functional right now in the demo:

- [x] **Subscription Management:** Full CRUD operations via interactive Modal overlay.
- [x] **Financial Dashboard:** Real-time metrics with dynamic budget calculations.
- [x] **Google Calendar Integration:** 1-click automatic event generation for H-3 bill reminders.
- [x] **Advanced Analytics UI:** Responsive line charts rendering projection trends.
- [x] **AI Efficiency Score:** Instant Llama-3 powered spending health assessments.
- [x] **Actionable AI Recommendations:** Context-aware cancellation advice.
- [x] **AI Chat Assistant:** Context-injected chatbot capable of answering questions about user's active subscriptions.
- [x] **Theming:** Full Dark/Light mode support via CSS variables.

---

## 7. Commit Convention

We use the standard Conventional Commits structure to maintain a clean history during the rapid hackathon sprint:
* `feat:` A new feature (e.g., `feat: add AI health score calculation`)
* `fix:` A bug fix
* `docs:` Documentation only changes (e.g., `docs: update README with demo links`)
* `style:` Changes that do not affect the meaning of the code (formatting, missing semi-colons)
* `refactor:` A code change that neither fixes a bug nor adds a feature
* `chore:` Updating build tasks, package manager configs, etc.