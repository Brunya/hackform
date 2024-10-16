import React from 'react';

interface RoleInfoProps {
  role: {
    name: string;
    description: string;
  };
}

const RoleInfo: React.FC<RoleInfoProps> = ({ role }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{role.name}</h2>
      <p className="text-gray-300 mb-6 whitespace-pre-line">{role.description}</p>
    </div>
  );
};

export default RoleInfo;