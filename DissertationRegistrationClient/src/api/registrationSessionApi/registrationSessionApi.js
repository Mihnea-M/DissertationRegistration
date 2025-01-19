const API_URL = process.env.REACT_APP_API_URL;

async function getSessions(userId) {
  const response = await fetch(
    `${API_URL}/professors/${userId}/registration-sessions`,
    {
      credentials: "include",
    }
  );
  return response;
}

async function getActiveSessions() {
  const response = await fetch(`${API_URL}/registration-sessions/active`, {
    credentials: "include",
  });
  return response;
}

async function createSession(userId, session) {
  const response = await fetch(
    `${API_URL}/professors/${userId}/registration-sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
      credentials: "include",
    }
  );
  return response;
}

async function updateSession(session) {
  const response = await fetch(`${API_URL}/registration-sessions/${session.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
    credentials: "include",
  });
  return response;
}

async function deleteSession(sessionId) {
  const response = await fetch(`${API_URL}/registration-sessions/${sessionId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response;
}

export { getSessions, getActiveSessions, createSession, updateSession, deleteSession };