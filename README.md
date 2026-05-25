# DayOne — Your goal, your countdown.

Set your own deadline, stay focused with the Pomodoro timer, and move forward every day.

---

## Context & Problem solved

When I was preparing for my exams, I kept wondering how many days I had left — without ever finding a simple, dedicated tool. I built DayOne to solve that. Then I realized the problem was universal: an exam, a work deadline, a personal project. DayOne adapts to any goal.

---

## Features

**Custom countdown**
User-defined deadline, saved in the browser via localStorage. Works for any goal, not just exams.

**Pomodoro timer**
Work (25min), Short break (5min), Long break (15min). Visual progress ring, automatic session transitions, session counter and total focus time tracker.

**Focus & discipline tips**
Four actionable principles: set one clear goal per session, work in blocks with real breaks, eliminate distractions, and choose consistency over perfection.

**PWA — Progressive Web App**
Installable on mobile and desktop. Works fully offline — the countdown runs without an internet connection.

---

## Tech stack

| Side | Technologies |
|------|-------------|
| Frontend | React |
| Styles | CSS |
| Persistence | localStorage |
| PWA | vite-plugin-pwa |

---

## Run locally

Requirements: Node.js >= 16

```bash
git clone https://github.com/eabxrry/dayone.git
cd dayone
npm install
npm run dev
```

---

## Project structure

```
dayone/
├── public/
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── config.js
    └── utils/
        ├── countdown.js
        └── countdown.test.js
```

---

## What I learned

- Time manipulation in JavaScript (Date, intervals, useEffect)
- Client-side data persistence with localStorage
- Local state management with useState and useEffect
- Building a full Pomodoro timer in React
- PWA configuration with vite-plugin-pwa and service worker
- Writing unit tests with countdown.test.js

---

## Author

A personal project born from a real need, extended to serve any goal with a deadline.
