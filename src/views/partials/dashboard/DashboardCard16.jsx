import React, { useContext, useEffect, useState } from 'react';
import { UsersContext } from '../../../context/UserContext';
import { Steps } from 'antd';


function DashboardCard16() {
      let { users } = useContext(UsersContext);      
      let [usersCount , setUsersCount] = useState(users.length);

      useEffect(() => {
        setUsersCount(users.length);
      }, [users]);
      
    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl py-4 px-4">
            <div className="px-5 pt-5">
                <header className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Active Projects</h2>
                </header>
                <hr />
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1" />
                <div className="flex items-start">
                </div>
            </div>
            <div className="grow max-sm:max-h-[128px] xl:max-h-[128px] text-center">
                <div className="mb-1 text-lg font-medium dark:text-white">Used {users.length} /2</div>
                <div className="w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
                <div className={`h-6 bg-purple-600 rounded-full dark:bg-purple-500`}
                style={{ width: `${(usersCount / 10) * 100}%` }}
                ></div>
                </div>
            </div>
        </div>

    );
}
export default DashboardCard16;
