import React from 'react';
import styles from './RequestFile.module.css';

function RequestFile({ fileName, handleDownload, label }) {
  return (
    <div className={styles.fileContainer}>
      <p className={styles.fileLabel} onClick={handleDownload}>
        {label}: <span className={styles.fileName}>{fileName}</span>
      </p>
    </div>
  );
}

export default RequestFile;
