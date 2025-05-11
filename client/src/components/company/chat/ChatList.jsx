import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { STATIC_URL } from '../../../utils/axios';

const ChatList = ({ candidates, onSelectCandidate }) => {
  return (
    <div className="flex-grow overflow-y-auto">
      {candidates.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full mb-4 mx-auto">
            <FiMessageCircle className="text-4xl text-gray-400" />
          </div>
          No candidates available
        </div>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li
              key={candidate._id}
              className="p-4 border-b border-gray-200 flex items-center cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectCandidate(candidate._id)}
            >
              <img
                src={candidate?.candidateProfile?.profilePicture ? `${STATIC_URL}/public/${candidate.candidateProfile.profilePicture}` : "https://via.placeholder.com/50"}
                alt={candidate.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <p className="font-semibold">{candidate.name}</p>
                <p className="text-sm text-gray-500">
                  {candidate.lastMessage || "No messages yet"}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {candidate.lastMessageTime || ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;