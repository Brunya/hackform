import React from 'react';
import { FileText, Twitter, MessageSquare } from 'lucide-react';

interface RequiredPlatformsProps {
  platforms: string[];
}

const RequiredPlatforms: React.FC<RequiredPlatformsProps> = ({ platforms }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'FORM':
        return <FileText size={24} />;
      case 'TWITTER':
        return <Twitter size={24} />;
      case 'DISCORD':
        return <MessageSquare size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Required Platforms</h2>
      <div className="flex flex-wrap gap-4">
        {platforms.map((platform) => (
          <div key={platform} className="flex items-center bg-gray-700 px-4 py-2 rounded-md">
            {getPlatformIcon(platform)}
            <span className="ml-2 font-medium">{platform.charAt(0) + platform.slice(1).toLowerCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequiredPlatforms;