# DayOne — Ton objectif, ton compte à rebours.

Choisis ta propre date limite, reste focus avec le Pomodoro et avance chaque jour avec les bons liens.

---

## Contexte & Problème résolu

Quand je préparais mon bac, je cherchais constamment combien de jours il me restait sans jamais trouver un outil simple et dédié. J'ai créé DayOne pour répondre à ce besoin — puis j'ai réalisé que le problème était universel : un exam, une deadline, un projet personnel. DayOne s'adapte à n'importe quel objectif.

---

## Fonctionnalités

**Compte à rebours personnalisé**
Date choisie par l'utilisateur et sauvegardée dans le navigateur via localStorage. Fonctionne pour n'importe quelle deadline.

**Minuteur Pomodoro**
Mode Travail (25min), Pause courte (5min), Pause longue (15min). Anneau de progression visuel, transitions automatiques entre sessions, compteur de sessions et de temps de travail total.

**Conseils — Rester concentré et discipliné**
Quatre principes concrets : définir un objectif clair par session, travailler par blocs avec de vraies pauses, éliminer les distractions, et privilégier la constance sur la perfection.

**PWA — Progressive Web App**
Installable sur mobile et desktop. Fonctionne hors ligne — le countdown marche sans connexion internet.

---

## Stack technique

| Côté | Technologies |
|------|-------------|
| Frontend | React |
| Styles | CSS |
| Persistance | localStorage |
| PWA | vite-plugin-pwa |

---

## Lancer le projet en local

Prérequis : Node.js >= 16

```bash
git clone https://github.com/eabxrry/dayone.git
cd dayone
npm install
npm run dev
```

---

## Structure du projet

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

## Ce que j'ai appris

- Manipulation du temps en JavaScript (Date, intervals, useEffect)
- Persistance de données côté client avec localStorage
- Gestion d'état local avec useState et useEffect
- Implémentation d'un minuteur Pomodoro complet en React
- Configuration d'une PWA avec vite-plugin-pwa et service worker

---

## Auteur

Projet personnel né d'un besoin réel, étendu pour servir n'importe quel objectif avec une deadline.