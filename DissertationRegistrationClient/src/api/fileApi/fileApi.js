const API_URL = process.env.REACT_APP_API_URL;

async function uploadFile(requestId, formData, params) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/files/${requestId}/upload?${query}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  return response;
}

async function downloadLatestFile(professorId, registrationSessionId, studentId) {
  const response = await fetch(`${API_URL}/files/student/${professorId}/${registrationSessionId}/${studentId}`, {
    method: "GET",
    credentials: "include",
  });
  return response;
}

async function downloadProfessorFile(professorId, registrationSessionId, studentId) {
  const response = await fetch(`${API_URL}/files/professor/${professorId}/${registrationSessionId}/${studentId}`, {
    method: "GET",
    credentials: "include",
  });
  return response;
}

async function rejectFile(fileId, justification) {
  const response = await fetch(`${API_URL}/files/${fileId}/reject`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ justification }),
  });
  return response;
}

export { uploadFile, downloadLatestFile, downloadProfessorFile, rejectFile };