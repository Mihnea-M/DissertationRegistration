const API_URL = process.env.REACT_APP_API_URL;

async function getStudentRequests(studentId) {
  const response = await fetch(`${API_URL}/requests/students/${studentId}`, {
    credentials: "include",
  });
  return response;
}

async function createRequest(requestData) {
  const response = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestData),
  });
  return response;
}

async function getProfessorRequests(professorId) {
  const response = await fetch(`${API_URL}/requests/professors/${professorId}`, {
    credentials: "include",
  });
  return response;
}

async function approveRequest(requestId) {
  const response = await fetch(`${API_URL}/requests/${requestId}/approve`, {
    method: "PUT",
    credentials: "include",
  });
  return response;
}

async function rejectRequest(requestId, justification) {
  const response = await fetch(`${API_URL}/requests/${requestId}/reject`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ justification }),
  });
  return response;
}

async function uploadStudentFile(requestId, formData) {
  const response = await fetch(`${API_URL}/requests/${requestId}/student-upload`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  return response;
}

async function uploadProfessorFile(requestId, formData) {
  const response = await fetch(`${API_URL}/requests/${requestId}/professor-upload`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  return response;
}

export { getStudentRequests, createRequest, getProfessorRequests, approveRequest, rejectRequest, uploadStudentFile, uploadProfessorFile };
