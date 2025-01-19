import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../providers/AuthProvider";
import { getActiveSessions } from "../../api/registrationSessionApi";
import { formatDateReadable } from "../../utils/dateUtils";
import styles from "./ActiveRegistrationSessions.module.css";

function ActiveRegistrationSessions( {handleApply} ) {
  const { user } = useContext(AuthContext);
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  async function fetchActiveSessions() {
    try {
      const response = await getActiveSessions();
      if (response.ok) {
        const fetchedActiveSessions = await response.json();
        setActiveSessions(fetchedActiveSessions);
      }
    } catch (error) {
      console.error("Error fetching active sessions:", error);
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Active Registration Sessions</h2>
      {activeSessions.map((session) => (
        <div key={session.id} className={styles.sessionCard}>
          <p>Professor: {session.professor.name}</p>
          <p>Department: {session.professor.department}</p>
          <p>Session: {formatDateReadable(session.startDate)} - {formatDateReadable(session.endDate)}</p>
          <button className={styles.applyButton} onClick={() => handleApply(session)}>Apply</button>
        </div>
      ))}
    </div>
  );
};

export default ActiveRegistrationSessions;