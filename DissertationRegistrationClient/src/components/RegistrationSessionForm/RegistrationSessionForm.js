import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import styles from "./RegistrationSessionForm.module.css";
import { formatDateForInput } from "../../utils/dateUtils";

function RegistrationSessionForm({
  selectedDates,
  session,
  updateDate,
  maxStudents,
  setMaxStudents,
  onDelete,
  onCancel,
  onSubmit,
}) {
  const formattedStartDate = formatDateForInput(selectedDates.startDate);
  const formattedEndDate = formatDateForInput(selectedDates.endDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit()
  };

  return (
    <div className={styles.center}>
      <div className={styles.formContainer}>
        <h3 className={styles.formTitle}>
          {session ? "Edit" : "Create"} Registration Session
        </h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputs}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="startDate">
                Start Date:
              </label>
              <input
                id="startDate"
                type="date"
                value={formattedStartDate}
                onChange={(e) => updateDate("start", new Date(e.target.value))}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="endDate">
                End Date:
              </label>
              <input
                id="endDate"
                type="date"
                value={formattedEndDate}
                onChange={(e) => updateDate("end", new Date(e.target.value))}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="maxStudents">
                Max Students:
              </label>
              <input
                id="maxStudents"
                type="number"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                required
                min="1"
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button}>
              {session ? "Update" : "Create"}
            </button>

            {session && (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(session.id)}
                  className={`${styles.button} ${styles.deleteButton}`}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationSessionForm;
