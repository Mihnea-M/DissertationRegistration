import React from 'react';
import styles from './RequestStatus.module.css';

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  studentFileUploaded: "Student File Uploaded",
  fileRejectedByProfessor: "File Rejected by Professor",
  completed: "Completed",
};

function RequestStatus({ status }) {
  return <span className={`${styles.status} ${styles[status]}`}>{statusLabels[status]}</span>;
}

export default RequestStatus;