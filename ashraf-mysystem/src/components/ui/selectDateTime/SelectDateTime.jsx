import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./selectDateTime.module.css";

function SelectDateTime({ setValue, value, checked }) {
  // Ref
  const timeRef = useRef(null);

  // State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isChange, setIsChange] = useState(checked);

  const liveTime = useMemo(() => {
    if (selectedTime) {
      return selectedTime;
    }
  }, [selectedTime]);
  // console.log(value);

  useEffect(() => {
    let today = new Date();
    let date = today.toISOString().split("T")[0];

    setSelectedDate(date);

    if (isChange || !!value) return;
    const interval = setInterval(() => {
      let newToday = new Date();
      let hour = newToday.getHours();
      hour = hour < 10 ? "0" + hour : hour;
      let min = newToday.getMinutes();
      min = min < 10 ? "0" + min : min;

      let time = `${hour}:${min}`;

      if (timeRef.current) timeRef.current.value = time;
      // console.log(newToday.toISOString().substring(11, 16));

      setSelectedTime(time);
    }, 1000);
    return () => clearInterval(interval);
  }, [isChange, value]);

  useEffect(() => {
    setValue({
      time: liveTime,
      date: selectedDate,
    });
  }, [selectedDate, liveTime]);

  return (
    <div className={styles.content}>
      <input
        type="date"
        id="date"
        name="date"
        defaultValue={value?.date ? value?.date : selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <input
        type="time"
        id="date"
        name="date"
        ref={timeRef}
        // value={false}
        defaultValue={value?.time}
        onChange={(e) => {
          setSelectedTime(e.target.value);
          setIsChange(true);
        }}
      />
    </div>
  );
}

export default SelectDateTime;
