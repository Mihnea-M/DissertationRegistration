import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import Requests from "../../components/Requests";
import ActiveRegistrationSessions from "../../components/ActiveRegistrationSessions";
import AuthContext from "../../providers/AuthProvider";
import { getStudentRequests, createRequest } from "../../api/requestApi";
import { getActiveSessions } from "../../api/registrationSessionApi";
import styles from "./StudentDashboardPage.module.css";

function StudentDashboardPage() {
  const { user } = useContext(AuthContext);
  const [activeSessions, setActiveSessions] = useState([]);
  const [latestRequest, setLatestRequest] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchStudentRequests();
  }, []);

  async function fetchStudentRequests() {
    try {
      const response = await getStudentRequests(user.id);
      if (response.ok) {
        const fetchedRequests = await response.json();
        setRequests(fetchedRequests);
        const acceptedRequests = fetchedRequests.find(
          (request) =>
            request.status !== "rejected" && request.status !== "pending"
        );
        if (acceptedRequests) {
          setLatestRequest(acceptedRequests);
        } else {
          fetchActiveSessions();
        }
      } else {
        toast.error("Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching student requests:", error);
      toast.error("Error fetching student requests");
    }
  }

  async function fetchActiveSessions() {
    try {
      const response = await getActiveSessions();
      if (response.ok) {
        const fetchedActiveSessions = await response.json();
        setActiveSessions(fetchedActiveSessions);
      } else {
        throw new Error("Error fetching active sessions");
      }
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      toast.error(error.message);
    }
  }

  async function handleApply(session) {
    try {
      const requestData = {
        studentId: user.id,
        professorId: session.professorId,
        registrationSessionId: session.id,
        justification: "Requesting coordination",
      };
      const response = await createRequest(requestData);
      if (response.ok) {
        fetchActiveSessions();
        fetchStudentRequests();
        toast.success("Request created successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error creating request:", error);
    }
  }

  return (
    <div className={styles.container}>
      <Requests requests={requests} fetchRequests={fetchStudentRequests} />
      {!latestRequest && <ActiveRegistrationSessions handleApply={handleApply} />}
    </div>
  );
}

export default StudentDashboardPage;