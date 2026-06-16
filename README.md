# 🔍 JobLens — Global Job Market Intelligence Dashboard

A real-time job market intelligence dashboard powered by the Adzuna API. Track hiring trends, in-demand roles, top skills, salary insights, and live job listings — all in one clean, professional dashboard built for PMs, recruiters, and job seekers.

---

## 🚀 Live Demo

> Deploy to Vercel in under 5 minutes — see setup below.

---

## ✨ Features

### 📊 Overview Tab
- **6 Live KPI Cards** — total jobs, remote roles, senior, mid, junior positions, most in-demand role
- **4 Insight Cards** — remote work %, top paying role, most demanded skill, top hiring industry
- **Industry Horizontal Bar** — top 10 hiring sectors right now
- **Experience Level Donut** — Junior vs Mid vs Senior breakdown
- **Salary by Role Bar** — median annual salary per job title
- **Skills Radar Chart** — most in-demand tech skills (Python, JS, React, AWS, SQL…)
- **Top Roles Gradient Bar** — 10 most posted job titles
- **Work Mode Split** — Remote vs On-site comparison

### 💼 Roles & Skills Tab
- **Top 10 Roles Horizontal Bar** — live job count per title
- **Salary vs Demand Bubble Chart** — bubble size = job volume, y-axis = salary
- **Skill Demand Meters** — visual bars for each tech skill
- **Salary Comparison Bar** — ranked by highest paying role

### 📍 Locations Tab
- **Top 10 Hiring Cities Bar** — software jobs by US city
- **City Market Share Donut** — geographic distribution
- **City Leaderboard** — ranked list with demand meters

### 📋 Live Listings Tab
- **Live Job Feed Table** — latest software engineer postings with title, company, location, salary range, and posted time

---

## 📊 Chart Types Used

| Chart | Tab | Data |
|---|---|---|
| Horizontal Bar | Overview | Jobs by industry |
| Donut | Overview | Experience level mix |
| Bar Chart | Overview | Salary by role |
| Radar Chart | Overview | In-demand skills |
| Gradient Bar | Overview | Top job titles |
| Bar Chart | Overview | Work mode split |
| Horizontal Bar | Roles & Skills | Role demand |
| Bubble Chart | Roles & Skills | Salary vs demand |
| Bar Chart | Roles & Skills | Salary comparison |
| Bar Chart | Locations | Jobs by city |
| Donut | Locations | City market share |

**11 charts across 4 tabs — all powered by live Adzuna data.**

---

## 🛠️ Tech Stack

- **Frontend** — Vanilla HTML, CSS, JavaScript (no framework)
- **Charts** — Chart.js v4
- **Backend** — Vercel Serverless Functions (Node.js)
- **API** — Adzuna Jobs API
- **Deployment** — Vercel
- **Fonts** — Inter, DM Mono, Syne (Google Fonts)

---

## 📁 Project Structure

```
joblens/
├── index.html          ← Full dashboard frontend
├── api/
│   └── jobs.js         ← Serverless proxy for Adzuna API
├── vercel.json         ← Vercel routing config
├── package.json        ← Node version config
└── README.md
```

---

## ⚡ Quick Deploy to Vercel

### Step 1 — Get Adzuna API Credentials (free)

1. Go to [developer.adzuna.com](https://developer.adzuna.com)
2. Sign up for a free account
3. Go to **My Apps** → Create a new app
4. Copy your **App ID** and **App Key**
5. Free tier: **250 requests/day**

### Step 2 — Push to GitHub

```bash
# Unzip the project
unzip joblens.zip

# Create a new GitHub repo and push
cd joblens
git init
git add .
git commit -m "Initial commit — JobLens"
git remote add origin https://github.com/YOUR_USERNAME/joblens.git
git push -u origin main
```

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your `joblens` GitHub repo
3. Click **Deploy** (no build settings needed)
4. Go to **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `ADZUNA_APP_ID` | Your Adzuna App ID |
| `ADZUNA_APP_KEY` | Your Adzuna App Key |

5. Click **Redeploy** → Done ✅

**Your live URL:** `joblens.vercel.app`

---

## 🔌 API Endpoints Used

| Endpoint | Data |
|---|---|
| `/api/jobs?type=overview` | Industry breakdown, experience levels, remote count |
| `/api/jobs?type=roles` | Top 10 job titles by demand |
| `/api/jobs?type=locations` | Jobs by US city |
| `/api/jobs?type=salary` | Median salary by role |
| `/api/jobs?type=listings` | Live job postings |
| `/api/jobs?type=skills` | In-demand tech skills |

---

## 🔧 Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally
cd joblens
vercel dev

# Open in browser
http://localhost:3000
```

---

## 🌐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ADZUNA_APP_ID` | Yes | Adzuna application ID from developer.adzuna.com |
| `ADZUNA_APP_KEY` | Yes | Adzuna application key from developer.adzuna.com |

---

## 🙌 Built By

**Srinivas Malempati**
QA Manager → AI Builder | 17+ years in quality engineering

- 🌐 Portfolio: [srinivas-malempati.github.io](https://srinivas-malempati.github.io)
- 💼 LinkedIn: [linkedin.com/in/srinivas-malempati](https://linkedin.com/in/srinivas-malempati)
- 🐙 GitHub: [github.com/srinivas-malempati](https://github.com/srinivas-malempati)

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

*Powered by [Adzuna API](https://developer.adzuna.com) · Built with ❤️ and Chart.js*
