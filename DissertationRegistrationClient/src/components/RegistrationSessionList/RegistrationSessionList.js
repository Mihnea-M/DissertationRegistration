import React from "react";
import styles from "./RegistrationSessionList.module.css";

function RegistrationSessionList({ sessions, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const now = new Date();
  const previousSessions = sessions.filter(
    (session) => new Date(session.endDate) < now
  );
  const activeSessions = sessions.filter(
    (session) =>
      new Date(session.startDate) <= now && new Date(session.endDate) >= now
  );
  const upcomingSessions = sessions.filter(
    (session) => new Date(session.startDate) > now
  );

  return (
    <div className={styles.sessionsList}>
      <h3>Previous Sessions</h3>
      <ul>
        {previousSessions.map((session) => (
          <li
            key={session.id}
            className={`${styles.sessionItem} ${styles.previousSession}`}
          >
            {formatDate(session.startDate)} - {formatDate(session.endDate)} (
            {session.maxStudents} students)
          </li>
        ))}
      </ul>
      <h3>Active Sessions</h3>
      <ul>
        {activeSessions.map((session) => (
          <li
            key={session.id}
            className={`${styles.sessionItem} ${styles.currentSession}`}
          >
            {formatDate(session.startDate)} - {formatDate(session.endDate)} (
            {session.maxStudents} students)
          </li>
        ))}
      </ul>
      <h3>Upcoming Sessions</h3>
      <ul>
        {upcomingSessions.map((session) => (
          <li
            key={session.id}
            className={`${styles.sessionItem} ${styles.upcomingSession}`}
          >
            {formatDate(session.startDate)} - {formatDate(session.endDate)} (
            {session.maxStudents} students)
            <button onClick={() => onEdit(session)}>Edit</button>
            <button onClick={() => onDelete(session.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RegistrationSessionList;
