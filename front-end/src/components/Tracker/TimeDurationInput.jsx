import { useEffect, useRef } from "react";

export function TimeDurationInput({ index, saved, update }) {
  const hourRef = useRef(saved ? Math.floor(saved / 3600) : 0);
  const minuteRef = useRef(saved ? Math.floor((saved - hourRef.current * 3600) / 60) : 0);
  const secondRef = useRef(saved ? Math.floor(saved - hourRef.current * 3600 - minuteRef.current * 60) : 0);

  useEffect(() => {
    const seconds = saved ?? 0;
    hourRef.current.value = Math.floor(seconds / 3600);
    minuteRef.current.value = Math.floor((seconds - hourRef.current.value * 3600) / 60);
    secondRef.current.value = seconds - hourRef.current.value * 3600 - minuteRef.current.value * 60;
  }, [saved]);

  function handleDurationChange() {
    const hours = Number(hourRef.current.value);
    const minutes = Number(minuteRef.current.value);
    const seconds = Number(secondRef.current.value);
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
    update(index, timeInSeconds);
  }

  const hourOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={`hour-${i}`} value={i}>
      {i}
    </option>
  ));

  const minuteOptions = Array.from({ length: 61 }, (_, i) => (
    <option key={`minute-${i}`} value={i}>
      {i}
    </option>
  ));

  return (
    <div>
      <label>Hours</label>
      <select onChange={handleDurationChange} defaultValue={hourRef.current} ref={hourRef}>
        {hourOptions}
      </select>
      <label>Minutes</label>
      <select onChange={handleDurationChange} defaultValue={minuteRef.current} ref={minuteRef}>
        {minuteOptions}
      </select>
      <label>Seconds</label>
      <select onChange={handleDurationChange} defaultValue={secondRef.current} ref={secondRef}>
        {minuteOptions}
      </select>
    </div>
  );
}
