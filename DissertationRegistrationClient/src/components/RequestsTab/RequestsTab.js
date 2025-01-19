import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../providers/AuthProvider';
import { getProfessorRequests } from '../../api/requestApi';
import Requests from "../../components/Requests";

function RequestsTab() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchProfessorRequests();
  }, []);

  async function fetchProfessorRequests() {
    try {
      const response = await getProfessorRequests(user.id);
      if (response.ok) {
        const fetchedRequests = await response.json();
        setRequests(fetchedRequests);
      }
    } catch (error) {
      console.error("Error fetching professor requests:", error);
    }
  }

  return (
    <div>
      <Requests requests={requests} fetchRequests={fetchProfessorRequests} />
    </div>
  );
}

export default RequestsTab;