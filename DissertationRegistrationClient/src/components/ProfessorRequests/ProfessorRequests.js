import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { orderRequestsByStatus } from "../../utils/requestsUtil";
import { formatDateReadable } from "../../utils/dateUtils";
import RequestStatus from "../RequestStatus";
import RequestActions from "../RequestActions";
import styles from "./ProfessorRequests.module.css";

function ProfessorRequests({ requests, fetchRequests }) {
  const orderedRequests = orderRequestsByStatus(requests);

  const statuses = [
    { id: "all", name: "All" },
    { id: "pending", name: "Pending" },
    { id: "approved", name: "Approved" },
    { id: "rejected", name: "Rejected" },
    { id: "studentFileUploaded", name: "Student File Uploaded" },
    { id: "completed", name: "Completed" },
  ];

  const requestsByStatus = statuses.reduce((acc, status) => {
    if (status.id === "all") {
      acc[status.id] = orderedRequests;
    } else {
      acc[status.id] = orderedRequests.filter(
        (request) => request.status === status.id
      );
    }
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <Tabs>
        <TabList>
          {statuses.map((status) => (
            <Tab key={status.id}>{status.name}</Tab>
          ))}
        </TabList>

        {statuses.map((status) => (
          <TabPanel key={status.id}>
            <div className={styles.section}>
              <h2 className={styles.title}>{status.name} Requests</h2>
              {requestsByStatus[status.id].length > 0 ? (
                requestsByStatus[status.id].map((request) => {
                  return (
                    <div key={request.id} className={styles.requestCard}>
                      <p>Student: {request.student.name}</p>
                      <p>
                        Session:{" "}
                        {formatDateReadable(
                          request.registrationSession.startDate
                        )}{" "}
                        -{" "}
                        {formatDateReadable(
                          request.registrationSession.endDate
                        )}
                      </p>
                      <div className={styles.statusContainer}>
                        <RequestStatus status={request.status} />
                      </div>
                      <RequestActions
                        requestId={request.id}
                        requestStatus={request.status}
                        fetchRequests={fetchRequests}
                        files={request.files}
                        professorId={request.professorId}
                        registrationSessionId={request.registrationSessionId}
                        studentId={request.studentId}
                      />
                    </div>
                  );
                })
              ) : (
                <p>No {status.name.toLowerCase()} requests found.</p>
              )}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

export default ProfessorRequests;
