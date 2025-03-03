import React, { useState } from 'react'
import styles from './PageManger.module.css'

const PageManger = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Click handler to toggle dropdown
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      <div className='flex flex-wrap justify-evenly items-center gap-4 my-5'>
        {/* <div className='w-1/4'>
          <div className="w-full">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
              <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
          </div>
        </div> */}

        {/* <div className="w-1/4">
          <button
            onClick={handleClick}

          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
      >
          Dropdown hover
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className={`z-10 ${isOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute`}
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Earnings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div> */}
    </div >


      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
          <thead className="text-xs text-white uppercase bg-gray-600 border-b border-gray-400 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Page
              </th>
              <th scope="col" className="px-6 py-3">
                Translation
              </th>
              <th scope="col" className="px-6 py-3">
                Phrases
              </th>
              <th scope="col" className="px-6 py-3">
                Periority
              </th>
              <th scope="col" className="px-6 py-3">
                Rules
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-600 border-b border-gray-400 hover:bg-gray-500">
              <th scope="row" className="px-6 py-4 font-medium text-blue-50 whitespace-nowrap dark:text-blue-100">
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">
                Silver
              </td>
              <td className="px-6 py-4">
                Laptop
              </td>
              <td className="px-6 py-4">
                <form className="max-w-sm mx-auto">
                  <select id="Periorities" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </form>
              </td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-white hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-gray-600 border-b border-gray-400 hover:bg-gray-500">
              <th scope="row" className="px-6 py-4 font-medium text-blue-50 whitespace-nowrap dark:text-blue-100">
                Microsoft Surface Pro
              </th>
              <td className="px-6 py-4">
                White
              </td>
              <td className="px-6 py-4">
                Laptop PC
              </td>
              <td className="px-6 py-4">
                <form className="max-w-sm mx-auto">
                  <select id="Periorities" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </form>
              </td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-white hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-gray-600 border-b border-gray-400 hover:bg-gray-500">
              <th scope="row" className="px-6 py-4 font-medium text-blue-50 whitespace-nowrap dark:text-blue-100">
                Microsoft Surface Pro
              </th>
              <td className="px-6 py-4">
                Black
              </td>
              <td className="px-6 py-4">
                Accessories
              </td>
              <td className="px-6 py-4">
                <form className="max-w-sm mx-auto">
                  <select id="Periorities" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </form>
              </td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-white hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-gray-600 border-b border-gray-400 hover:bg-gray-500">
              <th scope="row" className="px-6 py-4 font-medium text-blue-50 whitespace-nowrap dark:text-blue-100">
                Google Pixel Phone
              </th>
              <td className="px-6 py-4">
                Gray
              </td>
              <td className="px-6 py-4">
                Phone
              </td>
              <td className="px-6 py-4">
                <form className="max-w-sm mx-auto">
                  <select id="Periorities" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </form>
              </td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-white hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-gray-600 border-gray-400 hover:bg-gray-500">
              <th scope="row" className="px-6 py-4 font-medium text-blue-50 whitespace-nowrap dark:text-blue-100">
                Apple Watch 5
              </th>
              <td className="px-6 py-4">
                Red
              </td>
              <td className="px-6 py-4">
                Wearables
              </td>
              <td className="px-6 py-4">
                <form className="max-w-sm mx-auto">
                  <select id="Periorities" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </form>
              </td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-white hover:underline">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </>
  )
}
export default PageManger 