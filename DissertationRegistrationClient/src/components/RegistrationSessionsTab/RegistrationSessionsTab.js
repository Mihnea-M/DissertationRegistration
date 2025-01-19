import React, { useState, useEffect, useContext } from "react";
import CustomCalendar from "../../components/CustomCalendar";
import RegistrationSessionForm from "../../components/RegistrationSessionForm";
import RegistrationSessionList from "../../components/RegistrationSessionList";
import AuthContext from "../../providers/AuthProvider";
import { getSessions, deleteSession } from "../../api/registrationSessionApi";
import { toast } from "react-hot-toast";
import { createSession, updateSession } from "../../api/registrationSessionApi";

function RegistrationSessionsTab() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [maxStudents, setMaxStudents] = useState(0);
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    setSelectedDates({
      startDate: editingSession ? new Date(editingSession.startDate) : null,
      endDate: editingSession ? new Date(editingSession.endDate) : null,
    });
    setMaxStudents(editingSession ? editingSession.maxStudents : 0);
  }, [editingSession]);

  const fetchSessions = async () => {
    try {
      const response = await getSessions(user.id);
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      const sortedData = data.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setSessions(sortedData);
    } catch (error) {
      // console.error("Error fetching sessions:", error);
      toast.error("Failed to fetch sessions");
    }
  };

  const handleDateClick = (date) => {
    const { startDate, endDate } = selectedDates;
    if (!startDate && !endDate) {
      setSelectedDates({ startDate: date, endDate: null });
    } else if (startDate && !endDate) {
      if (date.getTime() < startDate.getTime()) {
        setSelectedDates({ startDate: date, endDate: null });
      } else {
        setSelectedDates({ startDate, endDate: date });
      }
    } else if (startDate && endDate) {
      setSelectedDates({ startDate: date, endDate: null });
    }
  };

  const handleSelectSessionForEdit = (session) => {
    setEditingSession(session);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await deleteSession(sessionId);
      if (response.ok) {
        toast.success("Session deleted successfully");
        fetchSessions();
      } else {
        toast.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  const handleFormSubmit = async () => {
    try {
      let response;
      if (editingSession) {
        response = await updateSession({
          id: editingSession.id,
          startDate: selectedDates.startDate,
          endDate: selectedDates.endDate,
          maxStudents: parseInt(maxStudents, 10),
        });
      } else {
        response = await createSession(user.id, {
          startDate: selectedDates.startDate,
          endDate: selectedDates.endDate,
          maxStudents: parseInt(maxStudents, 10),
        });
      }
      if (response.ok) {
        toast.success(
          `Session ${editingSession ? "updated" : "created"} successfully`
        );
        setEditingSession(null);
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to ${editingSession ? "update" : "create"} session: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error(
        `Error ${editingSession ? "updating" : "creating"} session:`,
        error
      );
      toast.error(`Failed to ${editingSession ? "update" : "create"} session`);
    }
    fetchSessions();
  };

  const updateDate = (mode, date) => {
    if (mode === "start") {
      setSelectedDates({ startDate: date, endDate: selectedDates.endDate });
    } else if (mode === "end") {
      if (date < selectedDates.startDate) {
        setSelectedDates({ startDate: date, endDate: date });
      } else {
        setSelectedDates({ startDate: selectedDates.startDate, endDate: date });
      }
    }
  };
  
  return (
    <div>
      <CustomCalendar
        sessions={sessions}
        onDateClick={handleDateClick}
        onSessionClick={handleSelectSessionForEdit}
      />
      <RegistrationSessionForm
        selectedDates={selectedDates}
        session={editingSession}
        updateDate={updateDate}
        onDelete={handleDeleteSession}
        onCancel={() => {
          setEditingSession(null);
          setSelectedDates({ startDate: null, endDate: null });
        }}
        onSubmit={handleFormSubmit}
        maxStudents={maxStudents}
        setMaxStudents={setMaxStudents}
      />
    </div>
  );
}

export default RegistrationSessionsTab;
