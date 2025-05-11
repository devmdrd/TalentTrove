import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';

const ChatList = ({ companies, onSelectCompany }) => {
  return (
    <div className="flex-grow overflow-y-auto">
      {companies.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full mb-4 mx-auto">
            <FiMessageCircle className="text-4xl text-gray-400" />
          </div>
          No companies available
        </div>
      ) : (
        <ul>
          {companies.map((company) => (
            <li
              key={company._id}
              className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectCompany(company._id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex justify-center items-center rounded-full bg-green-500 text-white font-bold text-lg">
                  {company?.name ? company.name[0].toUpperCase() : ''}
                </div>
                <div>
                  <p className="font-semibold">{company.name}</p>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {company.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap pl-4">
                {company.lastMessageTime || ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
