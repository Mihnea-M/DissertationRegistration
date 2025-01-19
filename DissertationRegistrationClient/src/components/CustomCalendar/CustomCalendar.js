import React from "react";
import styles from "./CustomCalendar.module.css";
import CustomCalendarDays from "../CustomCalendarDays";

function CustomCalendar({ sessions, onDateClick, onSessionClick }) {
  const dayPrefixes = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [displayedDate, setDisplayedDate] = React.useState(new Date());

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          onClick={() =>
            setDisplayedDate(
              new Date(
                displayedDate.getFullYear(),
                displayedDate.getMonth() - 1,
                1
              )
            )
          }
        >
          Previous
        </button>
        <span>
          {displayedDate.toLocaleString("default", { month: "long" })}{" "}
          {displayedDate.getFullYear()}
        </span>
        <button
          onClick={() =>
            setDisplayedDate(
              new Date(
                displayedDate.getFullYear(),
                displayedDate.getMonth() + 1,
                1
              )
            )
          }
        >
          Next
        </button>
      </div>
      <div className={styles.dayPrefixes}>
        {dayPrefixes.map((prefix) => (
          <div key={prefix} className={styles.dayPrefix}>
            {prefix}
          </div>
        ))}
      </div>
      <div className={styles.calendar}>
        <CustomCalendarDays
          sessions={sessions}
          onSessionClick={onSessionClick}
          selectedDate={displayedDate}
          onDateClick={onDateClick}
        />
      </div>
    </div>
  );
}

export default CustomCalendar;
