import React, { useState, useRef } from "react";
import styles from "./FileUpload.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function FileUpload({ onFileUpload, buttonLabel, onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileChange(event) {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(true);
      }
    }
  }

  function handleConfirmUpload() {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
      fileInputRef.current.value = null;
      if (onFileSelect) {
        onFileSelect(false);
      }
    }
  }

  function handleCancel() {
    setSelectedFile(null);
    fileInputRef.current.value = null;
    if (onFileSelect) {
      onFileSelect(false);
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <label htmlFor="fileInput" className={styles.fileLabel}>
        <FileUploadIcon className={styles.uploadIcon} />
        {buttonLabel ? buttonLabel : "Select File"}
      </label>
      {selectedFile && (
        <div className={styles.fileDetails}>
          <p>Selected File: {selectedFile.name}</p>
          <button
            onClick={handleConfirmUpload}
            className={styles.confirmButton}
          >
            Confirm Upload
          </button>
          <button onClick={handleCancel} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
