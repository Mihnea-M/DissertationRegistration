import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import AuthContext from "../../providers/AuthProvider";
import { approveRequest, rejectRequest } from "../../api/requestApi";
import {
  uploadFile,
  downloadLatestFile,
  downloadProfessorFile,
  rejectFile,
} from "../../api/fileApi";
import FileUpload from "../FileUpload/FileUpload";
import RequestFile from "../RequestFile/RequestFile";
import styles from "./RequestActions.module.css";

function RequestActions({
  requestId,
  requestStatus,
  fetchRequests,
  files,
  professorId,
  registrationSessionId,
  studentId,
}) {
  const { user } = useContext(AuthContext);
  const [fileSelected, setFileSelected] = useState(false);

  const sortedFiles = files.sort(
    (a, b) => new Date(b.dateUploaded) - new Date(a.dateUploaded)
  );
  const studentFile = sortedFiles.find((file) => file.uploadedBy === "student");
  const professorFile = sortedFiles.find(
    (file) => file.uploadedBy === "professor"
  );

  async function handleApprove() {
    try {
      const response = await approveRequest(requestId);
      if (response.ok) {
        fetchRequests();
        toast.success("Request approved successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error approving request:", error);
    }
  }

  async function handleReject() {
    const justification = prompt(
      "Please provide a justification for rejection:"
    );
    if (justification) {
      try {
        const response = await rejectRequest(requestId, justification);
        if (response.ok) {
          fetchRequests();
          toast.success("Request rejected successfully");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error rejecting request:", error);
      }
    }
  }

  async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(requestId, formData, {
        professorId,
        registrationSessionId,
        studentId,
        uploadedBy: user.role,
        fileType:
          user.role === "student" ? "student_request" : "professor_response",
      });

      if (response.ok) {
        fetchRequests();
        toast.success("File uploaded successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error uploading file:", error);
    }
  }

  async function handleDownloadStudentFile() {
    try {
      const response = await downloadLatestFile(
        professorId,
        registrationSessionId,
        studentId
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = studentFile.fileName; // Format the file name
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error downloading file:", error);
    }
  }

  async function handleDownloadProfessorFile() {
    try {
      const response = await downloadProfessorFile(
        professorId,
        registrationSessionId,
        studentId
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = professorFile.fileName; // Format the file name
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error downloading file:", error);
    }
  }

  async function handleRejectFile() {
    const justification = prompt(
      "Please provide a justification for rejecting the file:"
    );
    if (justification) {
      try {
        const response = await rejectFile(studentFile.id, justification);
        if (response.ok) {
          fetchRequests();
          toast.success("File rejected successfully");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error rejecting file:", error);
      }
    }
  }

  if (user.role === "professor" && requestStatus === "pending") {
    return (
      <div className={styles.actions}>
        <button className={styles.approveButton} onClick={handleApprove}>
          Approve Request
        </button>
        <button className={styles.rejectButton} onClick={handleReject}>
          Reject Request
        </button>
      </div>
    );
  }

  if (requestStatus === "studentFileUploaded") {
    return (
      <div className={styles.actions}>
        <RequestFile
          fileName={studentFile.fileName}
          handleDownload={handleDownloadStudentFile}
          label="Student File"
        />
        {user.role === "professor" && (
          <div className={styles.uploadRejectContainer}>
            <FileUpload
              onFileUpload={handleFileUpload}
              buttonLabel="Upload Signed Response"
              onFileSelect={setFileSelected}
            />
            {!fileSelected && (
              <button
                className={styles.rejectButton}
                onClick={handleRejectFile}
              >
                Reject File
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (
    requestStatus === "approved" ||
    requestStatus === "fileRejectedByProfessor"
  ) {
    return (
      <div className={styles.actions}>
        <RequestFile
          fileName={studentFile.fileName}
          handleDownload={handleDownloadStudentFile}
          label="Student File"
        />
        {user.role === "student" && (
          <FileUpload
            onFileUpload={handleFileUpload}
            buttonLabel="Upload File"
          />
        )}
      </div>
    );
  }

  if (requestStatus === "completed") {
    console.log;
    return (
      <div className={styles.actions}>
        <RequestFile
          fileName={professorFile.fileName}
          handleDownload={handleDownloadProfessorFile}
          label="Professor File"
        />
      </div>
    );
  }

  return null;
}

export default RequestActions;
