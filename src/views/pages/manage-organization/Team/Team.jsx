import React, { useEffect, useState } from 'react';
import { Table, Card } from 'antd';

import DashboardCard14 from '../../../partials/dashboard/DashboardCard14';
import DashboardCard15 from '../../../partials/dashboard/DashboardCard15';
import { teamTableColumns } from './constants';
import { team } from '@/context/UserContext';

const Team = () => {
  let users = team;
  const [usersTeam, setUsersTeam] = useState([]);

  useEffect(() => {
    setUsersTeam(users);
  }, [users]);

  return (
    <div className="flex w-full gap-6">
      <div className="flex flex-col w-[50%] gap-6">
        <div className="w-full">
          <DashboardCard14 />
        </div>
        <div className="w-full">
          <DashboardCard15 />
        </div>
      </div>
      <div className="w-full">
        <Card title="Your Team" bordered={false} className="shadow-xs">
          <Table
            columns={teamTableColumns}
            dataSource={usersTeam}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default Team;
