import { useEffect, useMemo, useRef, useState } from 'react';
import { BriefcaseBusiness, Coffee, Maximize2, Minimize2, Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import './pomodoro.css';

const MODES = {
  work: { label: 'Travail', duration: 25 * 60, color: '#22c55e', icon: BriefcaseBusiness },
  shortBreak: { label: 'Pause courte', duration: 5 * 60, color: '#3b82f6', icon: Coffee },
  longBreak: { label: 'Pause longue', duration: 15 * 60, color: '#a855f7', icon: Coffee },
};

const ORDERED_MODES = ['work', 'shortBreak', 'longBreak'];
const RADIUS = 92;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STORAGE_KEY = 'bac-countdown-pomodoro-v1';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readStoredState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !MODES[parsed.mode]) return null;
    return parsed;
  } catch {
    return null;
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function PomodoroTimer() {
  const cardRef = useRef(null);
  const stored = readStoredState();
  const isSameDay = stored?.dayKey === todayKey();

  const [mode, setMode] = useState(stored?.mode ?? 'work');
  const [secondsLeft, setSecondsLeft] = useState(
    typeof stored?.secondsLeft === 'number' ? stored.secondsLeft : MODES.work.duration,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState(
    isSameDay ? (stored?.sessionsCompletedToday ?? 0) : 0,
  );
  const [totalWorkMinutes, setTotalWorkMinutes] = useState(
    isSameDay ? (stored?.totalWorkMinutes ?? 0) : 0,
  );

  const completedInCycle = sessionsCompletedToday % 4;
  const modeConfig = MODES[mode];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === cardRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      dayKey: todayKey(),
      mode,
      secondsLeft,
      sessionsCompletedToday,
      totalWorkMinutes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [mode, secondsLeft, sessionsCompletedToday, totalWorkMinutes]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  useEffect(() => {
    if (secondsLeft > 0 || !isRunning) return;

    if (mode === 'work') {
      setSessionsCompletedToday((prev) => prev + 1);
      setTotalWorkMinutes((prev) => prev + MODES.work.duration / 60);

      const nextCompleted = (sessionsCompletedToday + 1) % 4;
      const nextMode = nextCompleted === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setSecondsLeft(MODES[nextMode].duration);
      setIsRunning(true);
      return;
    }

    setMode('work');
    setSecondsLeft(MODES.work.duration);
    setIsRunning(true);
  }, [secondsLeft, isRunning, mode, sessionsCompletedToday]);

  const progress = useMemo(() => {
    const elapsed = modeConfig.duration - secondsLeft;
    return elapsed / modeConfig.duration;
  }, [modeConfig.duration, secondsLeft]);

  const strokeDashoffset = CIRCUMFERENCE * progress;

  const handleSelectMode = (nextMode) => {
    setMode(nextMode);
    setSecondsLeft(MODES[nextMode].duration);
    setIsRunning(false);
  };

  const handleReset = () => {
    setSecondsLeft(MODES[mode].duration);
    setIsRunning(false);
  };

  const handleSkip = () => {
    setSecondsLeft(0);
    setIsRunning(true);
  };

  const toggleFullscreen = async () => {
    if (!cardRef.current) return;

    try {
      if (document.fullscreenElement === cardRef.current) {
        await document.exitFullscreen();
        return;
      }

      await cardRef.current.requestFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  };

  const renderDotClass = (index) => {
    if (index < completedInCycle) return 'pomodoro-dot completed';
    if (index === completedInCycle) return 'pomodoro-dot current';
    return 'pomodoro-dot';
  };

  return (
    <section className='pomodoro-card' aria-label='Minuteur Pomodoro' ref={cardRef}>
      <div className='pomodoro-head'>
        <div className='pomodoro-heading'>
          <h3>Mode concentration</h3>
          <p>Travaille en cycles et garde un rythme stable.</p>
        </div>
        <div className='pomodoro-tabs' role='tablist' aria-label='Modes Pomodoro'>
          {ORDERED_MODES.map((modeKey) => {
            const ModeIcon = MODES[modeKey].icon;
            return (
              <button
                key={modeKey}
                type='button'
                role='tab'
                aria-selected={mode === modeKey}
                className={`pomodoro-tab ${mode === modeKey ? 'active' : ''}`}
                onClick={() => handleSelectMode(modeKey)}
              >
                <ModeIcon size={16} aria-hidden='true' />
                <span>{MODES[modeKey].label}</span>
              </button>
            );
          })}
        </div>
        <button type='button' className='pomodoro-btn secondary fullscreen' onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 size={16} aria-hidden='true' /> : <Maximize2 size={16} aria-hidden='true' />}
          <span>{isFullscreen ? 'Quitter plein écran' : 'Plein écran'}</span>
        </button>
      </div>

      <div className='pomodoro-main'>
        <div className='pomodoro-ring-wrap'>
          <svg className='pomodoro-ring' viewBox='0 0 220 220' aria-hidden='true'>
            <circle cx='110' cy='110' r={RADIUS} className='pomodoro-ring-track' />
            <circle
              cx='110'
              cy='110'
              r={RADIUS}
              className='pomodoro-ring-progress'
              stroke={modeConfig.color}
              strokeDasharray={CIRCUMFERENCE}
              style={{ strokeDashoffset }}
            />
          </svg>
          <div className='pomodoro-time'>{formatTime(secondsLeft)}</div>
        </div>

        <div className='pomodoro-controls'>
          <button type='button' className='pomodoro-btn primary' onClick={() => setIsRunning((prev) => !prev)}>
            {isRunning ? <Pause size={16} aria-hidden='true' /> : <Play size={16} aria-hidden='true' />}
            <span>{isRunning ? 'Pause' : 'Play'}</span>
          </button>
          <button type='button' className='pomodoro-btn secondary' onClick={handleReset}>
            <RotateCcw size={16} aria-hidden='true' />
            <span>Reset</span>
          </button>
          <button type='button' className='pomodoro-btn secondary' onClick={handleSkip}>
            <SkipForward size={16} aria-hidden='true' />
            <span>Skip</span>
          </button>
        </div>

        <div className='pomodoro-dots' aria-label='Progression des sessions'>
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className={renderDotClass(index)} />
          ))}
        </div>
      </div>

      <div className='pomodoro-footer'>
        <div className='pomodoro-stats'>
          <div className='pomodoro-stat'>
            <span className='label'>Sessions aujourd’hui</span>
            <span className='value'>{sessionsCompletedToday}</span>
          </div>
          <div className='pomodoro-stat'>
            <span className='label'>Temps de travail</span>
            <span className='value'>{totalWorkMinutes} min</span>
          </div>
        </div>
      </div>
    </section>
  );
}
