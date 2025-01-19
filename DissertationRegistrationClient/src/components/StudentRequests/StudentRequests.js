import React, { useState } from 'react';
import { formatDateReadable } from '../../utils/dateUtils';
import { orderRequestsByStatus } from '../../utils/requestsUtil';
import RequestStatus from '../RequestStatus/RequestStatus';
import RequestActions from '../RequestActions/RequestActions';
import styles from './StudentRequests.module.css';

function StudentRequests({ requests, fetchRequests }) {
  const [showAll, setShowAll] = useState(false);
  const orderedRequests = orderRequestsByStatus(requests);
  const displayedRequests = showAll ? orderedRequests : orderedRequests.slice(0, 2);
  console.log(requests);
  return (
    <div className={styles.container}>
      {displayedRequests.length > 0 ? (
        <div className={styles.section}>
          <h2 className={styles.title}>Requests</h2>
          {displayedRequests.map((request) => {
            return (
              <div key={request.id} className={styles.requestCard}>
                <p>Professor: {request.professor.name}</p>
                <p>Department: {request.professor.department}</p>
                <p>Session: {formatDateReadable(request.registrationSession.startDate)} - {formatDateReadable(request.registrationSession.endDate)}</p>
                {request.status === "rejected" && <p>Justification: {request.justification}</p>}
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
          })}
          {requests.length > 2 && !showAll && (
            <button className={styles.seeMoreButton} onClick={() => setShowAll(true)}>See more</button>
          )}
        </div>
      ) : (
        <div className={styles.section}>
          <h2 className={styles.title}>No Requests Found</h2>
          <p>Submit a request to start the process of registering for a dissertation.</p>
        </div>
      )}
    </div>
  );
}

export default StudentRequests;