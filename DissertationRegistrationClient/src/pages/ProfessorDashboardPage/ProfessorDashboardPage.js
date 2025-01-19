import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RequestsTab from '../../components/RequestsTab';
import RegistrationSessionsTab from '../../components/RegistrationSessionsTab';

function ProfessorDashboardPage() {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Requests</Tab>
          <Tab>Registration Sessions</Tab>
        </TabList>

        <TabPanel>
          <RequestsTab />
        </TabPanel>
        <TabPanel>
          <RegistrationSessionsTab />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default ProfessorDashboardPage;
