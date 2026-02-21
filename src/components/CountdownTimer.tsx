import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: string;
  compact?: boolean;
}

const CountdownTimer = ({ endDate, compact = false }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (expired) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs font-mono text-primary animate-countdown-pulse">
        <span>⏱</span>
        <span>{timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}</span>
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: "Días" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div className="flex gap-2">
      {blocks.map(b => (
        <div key={b.label} className="flex flex-col items-center bg-primary/10 border border-primary/30 rounded px-2 py-1 min-w-[40px] animate-countdown-pulse">
          <span className="font-display text-lg text-primary leading-none">{String(b.value).padStart(2, "0")}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{b.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
