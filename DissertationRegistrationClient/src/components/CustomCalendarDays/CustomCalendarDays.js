import React from "react";
import styles from "./CustomCalendarDays.module.css";
import { range } from "../../utils/utils";
import { normalizeDate } from "../../utils/dateUtils";

function CustomCalendarDays({
  sessions,
  selectedDate,
  onDateClick,
  onSessionClick,
}) {
  const startDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );
  const endDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  );
  const daysInMonth = endDate.getDate();
  const firstDayIndex = (startDate.getDay() + 6) % 7;

  const getSessionForDate = (currentDate) => {
    const session = sessions.find(
      (session) =>
        normalizeDate(session.startDate) <= currentDate &&
        normalizeDate(session.endDate) >= currentDate
    );

    if (session) {
      const now = normalizeDate(new Date());
      if (normalizeDate(session.endDate) < now) {
        session.status = "previous";
      } else if (
        normalizeDate(session.startDate) <= now &&
        normalizeDate(session.endDate) >= now
      ) {
        session.status = "current";
      } else {
        session.status = "upcoming";
      }
    }
    return session;
  };

  return (
    <>
      {range(0, firstDayIndex).map((i) => (
        <div key={`empty-${i}`} className={styles.empty}></div>
      ))}
      {range(1, daysInMonth + 1).map((day) => {
        const currentDate = normalizeDate(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
        );
        const session = getSessionForDate(currentDate);
        const sessionClass = session ? styles[session.status + "Session"] : "";
        let onClick = null;
        if (session) {
          if (session.status === "upcoming"){
            onClick = () => onSessionClick(session);
          }
        } else {
          onClick = () => onDateClick(currentDate);
        }

        return (
          <div
            key={day}
            className={`${styles.day} ${sessionClass}`}
            onClick={onClick}
          >
            {day}
            {session && (
              <div className={styles.sessionInfo}>
                {session.requestCount}/{session.maxStudents} students
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default CustomCalendarDays;
