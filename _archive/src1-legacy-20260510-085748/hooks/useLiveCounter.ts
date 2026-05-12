import { useEffect, useState } from "react";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function useLiveCounter(startDate = "2005-01-04T07:30:00") {
  const [counter, setCounter] = useState("Loading...");

  useEffect(() => {
    const start = new Date(startDate);

    function update() {
      const now = new Date();
      const diff = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));

      const seconds = diff % 60;
      const minutes = Math.floor(diff / 60) % 60;
      const hours = Math.floor(diff / 3600) % 24;
      const totalDays = Math.floor(diff / 86400);

      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.44);
      const days = Math.floor(totalDays % 30.44);

      setCounter(`${years} yrs ${months} mo ${days} d · ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }

    update();
    const timer = window.setInterval(update, 1000);

    return () => window.clearInterval(timer);
  }, [startDate]);

  return counter;
}
