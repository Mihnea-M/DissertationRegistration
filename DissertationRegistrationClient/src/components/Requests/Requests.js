import React, { useContext } from 'react';
import AuthContext from '../../providers/AuthProvider';
import StudentRequests from '../StudentRequests/StudentRequests';
import ProfessorRequests from '../ProfessorRequests/ProfessorRequests';

function Requests({ requests, fetchRequests }) {
  const { user } = useContext(AuthContext);

  if (user.role === 'student') {
    return <StudentRequests requests={requests} fetchRequests={fetchRequests} />;
  } else if (user.role === 'professor') {
    return <ProfessorRequests requests={requests} fetchRequests={fetchRequests} />;
  } else {
    return null;
  }
}

export default Requests;