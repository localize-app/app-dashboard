import React from 'react'
import styles from './OrganizationOverview.module.css'
import DashboardCard16 from '../../../partials/dashboard/DashboardCard16';
import DashboardCard15 from '../../../partials/dashboard/DashboardCard15';
import DashboardCard17 from '../../../partials/dashboard/DashboardCard17';
import DashboardCard01 from '../../../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../../../partials/dashboard/DashboardCard02';
import DashboardCard18 from '../../../partials/dashboard/DashboardCard18';
import DashboardCard19 from '../../../partials/dashboard/DashboardCard19';


const OrganizationOverview = () => {
  return (
    <div className='flex flex-wrap'>
      <div className='flex w-full gap-10 flex-wrap md:flex-nowrap '>

        <div className='w-full'>
          <DashboardCard16 />
        </div>

        <div className='w-full'>
          <DashboardCard17 />
        </div>

        <div className='w-full'>
          <DashboardCard15 />
        </div>

      </div>

      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700 mt-14">

        <div>
          <h5 className="text-xl font-bold text-gray-900 dark:text-white text-left mb-2">Project List</h5>
          <hr />
          <form className="flex items-center max-w-sm me-auto mt-6">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                </svg>
              </div>
              <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search branch name..." required />
            </div>
            <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>
        <div className='flex justify-start items-center mt-10 gap-3'>
          <div className='w-1/3 border-2 border-gray-700 rounded-xl shadow-2xl'>
            <DashboardCard18 />
          </div>
          <div className='w-1/3 border-2 border-gray-700 rounded-xl shadow-2xl'>
            <DashboardCard19 />
          </div>
        </div>
      </div>
    </div>
  )
}
export default OrganizationOverview 