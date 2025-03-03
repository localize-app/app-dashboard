import React, { useContext, useEffect, useState } from 'react'
import styles from './Team.module.css'
import DashboardCard14 from '../../../partials/dashboard/DashboardCard14';
import DashboardCard15 from '../../../partials/dashboard/DashboardCard15';
import { UsersContext } from '../../../../context/UserContext';


const Team = () => {
  
  let { users } = useContext(UsersContext);
  let [usersTeam , setUsersTeam] = useState([]);
      useEffect(() => {
          setUsersTeam(users)
        }, [usersTeam]);
  return (
    <div className='flex w-full gap-6'>
      <div className='flex flex-col w-[50%] gap-6'>
        <div className='w-full'>
          <DashboardCard14 />
        </div>
        <div className='w-full'>
          <DashboardCard15 />
        </div>
      </div>
      <div className='w-full'>
        <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Your Team</h2>
          </header>
          <div className="p-3">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                {/* Table header */}
                <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Name</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Email</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Role</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Configuration</div>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                  {
                    usersTeam.map(userTeam => {
                      return (
                        <tr key={userTeam.id}>
                          <td className="p-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                                <img className="rounded-full" src={userTeam.image} width="40" height="40" alt={userTeam.name} />
                              </div>
                              <div className="font-medium text-gray-800 dark:text-gray-100">{userTeam.name}</div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">{userTeam.email}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium text-green-500">{userTeam.role}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <button className="text-lg text-center rounded-none cursor-pointer hover:text-violet-500 ms-5">Manage Access</button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team 