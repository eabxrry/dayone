import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { BAC_CONFIG } from './config.js';
import { getNextBacDate, getTimeLeft } from './utils/countdown.js';
import PomodoroTimer from './components/PomodoroTimer.jsx';

const DEADLINE_STORAGE_KEY = 'dayone-deadline';

function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getInitialDeadline() {
  const fallback = getNextBacDate(new Date(), BAC_CONFIG);
  if (typeof window === 'undefined') return fallback;

  const raw = localStorage.getItem(DEADLINE_STORAGE_KEY);
  if (!raw) return fallback;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export default function App() {
  const initialDeadline = useMemo(() => getInitialDeadline(), []);
  const [targetDate, setTargetDate] = useState(initialDeadline);
  const [deadlineInput, setDeadlineInput] = useState(() => toDatetimeLocalValue(initialDeadline));
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(initialDeadline));
  const [status, setStatus] = useState(() => (initialDeadline.getTime() > Date.now() ? 'avant' : 'termine'));

  useEffect(() => {
    const interval = setInterval(() => {
      const nowMs = Date.now();
      setTimeLeft(getTimeLeft(targetDate, nowMs));
      setStatus(targetDate.getTime() > nowMs ? 'avant' : 'termine');
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DEADLINE_STORAGE_KEY, targetDate.toISOString());
  }, [targetDate]);

  const handleDeadlineChange = (event) => {
    const value = event.target.value;
    setDeadlineInput(value);
    if (!value) return;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return;
    setTargetDate(parsed);
  };

  const prepTips = [
    {
      title: 'Un objectif clair par session',
      text: 'Avant de lancer un cycle, définis une seule tâche précise pour éviter la dispersion.',
    },
    {
      title: 'Travaille par blocs',
      text: 'Enchaîne des sessions courtes avec de vraies pauses pour maintenir ton attention plus longtemps.',
    },
    {
      title: 'Élimine les distractions',
      text: 'Coupe les notifications, ferme les onglets inutiles et garde le téléphone hors de portée.',
    },
    {
      title: 'La constance avant la perfection',
      text: 'Mieux vaut avancer un peu chaque jour que viser trop haut et perdre le rythme.',
    },
  ];

  return (
    <main className='app'>
      <section className='hero'>
        <div className='hero_copy'>
          <span className='eyebrow'>DayOne</span>
          <h1 className='hero_title'>Ton objectif, ton compte à rebours.</h1>
          <p className='hero_subtitle'>
            Choisis ta propre date limite, reste focus avec le Pomodoro et avance chaque jour avec les bons liens.
          </p>
          <a className='hero_cta' href='#conseils'>Voir les conseils</a>
        </div>
        <div className='countdown_container' aria-live='polite'>
          <h2 className='countdown_title'>
            {status === 'avant' && 'Ton échéance arrive dans'}
            {status === 'termine' && 'Échéance atteinte'}
          </h2>
          <p className='target_date'>
            Date limite: {targetDate.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
          <label className='deadline_picker' htmlFor='deadline-input'>
            <span>Personnaliser la date limite</span>
            <input
              id='deadline-input'
              type='datetime-local'
              value={deadlineInput}
              onChange={handleDeadlineChange}
            />
          </label>
          <div className='countdown'>
            <div className='days_container'>
              <div className='days'>{timeLeft.days}</div>
              <span className='days_text'>Jours</span>
            </div>
            <div className='hours_container'>
              <div className='hours'>{timeLeft.hours}</div>
              <span className='hours_text'>Heures</span>
            </div>
            <div className='minutes_container'>
              <div className='minutes'>{timeLeft.minutes}</div>
              <span className='minutes_text'>Minutes</span>
            </div>
            <div className='seconds_container'>
              <div className='seconds'>{timeLeft.seconds}</div>
              <span className='seconds_text'>Secondes</span>
            </div>
          </div>
        </div>
      </section>
      <section className='main' id='ressources'>
        <h2 className='utils_links'>Focus Pomodoro</h2>
        <p className='resources_intro'>Alterne sessions de travail et pauses pour rester efficace pendant tes révisions.</p>
        <PomodoroTimer />
      </section>
      <section className='tips_section' id='conseils'>
        <h2 className='tips_title'>Conseils pour rester concentré et discipliné</h2>
        <div className='tips_grid'>
          {prepTips.map((tip) => (
            <article className='tip_card' key={tip.title}>
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className='footer'>
        <span>Conçu et développé par <a href='https://eabarry.dev' target='_blank' rel='noreferrer noopener'>eabarry</a></span>
        <span>© 2026 eabarry. Tous droits réservés.</span>
      </section>
    </main>
  );
}
