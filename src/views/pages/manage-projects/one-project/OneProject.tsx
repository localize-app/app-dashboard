import React from 'react';

const OneProject = () => {
  return (
    <div className="p-4">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <div className="flex flex-col gap-6">
          {/* Greeting */}
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              Good Afternoon, Bishoy! <span className="ml-2">👋</span>
            </h2>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Project Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Owner Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-sm mb-2">OWNER</span>
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Owner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">Bishoy</span>
                  <span className="text-gray-500 text-sm">Admin</span>
                </div>
              </div>

              {/* Project Type Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm mb-2">
                    Project Type
                  </span>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span>🌐</span>
                    </div>
                    <span className="font-medium">Website / Web App</span>
                  </div>
                </div>
              </div>

              {/* Project Name Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm mb-2">
                    Project Name
                  </span>
                  <span className="font-medium">Inter-Val</span>
                </div>
              </div>

              {/* Website URL Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Website URL</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Installed
                    </span>
                  </div>
                  <a
                    href="https://app-dev.inter-val.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    app-dev.inter-val.ai
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Project Settings and Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md flex items-center hover:bg-blue-50">
                Project Settings
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col md:items-end mt-4 md:mt-0">
              <span className="text-gray-500 text-sm mb-2">Project Key</span>
              <div className="flex items-center w-full md:max-w-md">
                <div className="flex-1 flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
                  <div className="bg-gray-100 px-2 py-1.5 border-r border-gray-300">
                    <span className="text-gray-400">🔑</span>
                  </div>
                  <input
                    type="text"
                    value="sFzOYb1XNfwkf"
                    readOnly
                    className="flex-1 bg-gray-50 px-2 py-1 outline-none"
                  />
                  <button className="px-2 py-1.5 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links and Feedback Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Links Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
          </div>
          <div className="p-4">
            <div className="flex flex-col">
              {/* Pending Bin */}
              <button className="text-left flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                <span>Pending Bin</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <hr className="my-1" />

              {/* Add Member */}
              <button className="text-left flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                <span>Add Member</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <hr className="my-1" />

              {/* Place Phrase Orders */}
              <button className="text-left flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                <span>Place Phrase Orders</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <hr className="my-1" />

              {/* CAT Tool */}
              <button className="text-left flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                <span>CAT Tool</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <hr className="my-1" />

              {/* Setup Guide */}
              <button className="text-left flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                <span>Setup Guide</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium">Feedback</h3>
          </div>
          <div className="p-4 flex flex-col h-full">
            <textarea
              placeholder="Tell us what you think of the new Project Dashboard..."
              rows={6}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>

            <div className="flex justify-between items-center mt-auto">
              <span className="text-gray-500 text-sm">
                Need Support help?{' '}
                <a href="#" className="text-blue-500">
                  Contact Support
                </a>
              </span>
              <button className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneProject;
