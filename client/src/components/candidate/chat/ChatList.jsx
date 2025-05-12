import React from 'react';
import { FiMessageCircle, FiChevronRight } from 'react-icons/fi';

const ChatList = ({ companies, loading, onSelectCompany }) => {
  return (
    <div className="flex-grow overflow-y-auto">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center text-gray-500 p-4 h-full flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full mb-4 mx-auto">
            <FiMessageCircle className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
          <p className="text-sm">Start a new conversation with a company</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {companies.map((company) => (
            <li
              key={company._id}
              className="p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
              onClick={() => onSelectCompany(company._id)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 flex justify-center items-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold text-lg">
                    {company?.name ? company.name[0].toUpperCase() : ''}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900 truncate">{company.name}</p>
                    <FiChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors duration-150" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;