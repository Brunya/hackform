import React, { useState, useEffect } from "react";
import { Twitter, Globe, Users } from "lucide-react";
import SubmissionForm from "./SubmissionForm";
import { useParams } from "react-router-dom";
import { fetchGuild } from "../api/guildApi";

interface ProfilePageProps {
  signerFunction: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ signerFunction }) => {
  const [guildData, setGuildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { guildId } = useParams<{ guildId: string }>();

  useEffect(() => {
    const loadGuildData = async () => {
      try {
        const data = await fetchGuild(parseInt(guildId));
        console.log({ data });
        setGuildData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load guild data");
        setLoading(false);
      }
    };

    loadGuildData();
  }, [guildId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="h-80 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${guildData.theme.backgroundImage})`,
        }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Profile Image */}
        <div className="absolute -top-20 left-4">
          <img
            src={guildData.imageUrl}
            alt={guildData.name}
            className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Guild Name and Social Links */}
        <div className="pt-24 pb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">{guildData.name}</h1>
            {guildData.socialLinks && (guildData.socialLinks.TWITTER || guildData.socialLinks.WEBSITE) && (
              <div className="flex mt-2 space-x-4">
                {guildData.socialLinks.TWITTER && (
                  <a
                    href={guildData.socialLinks.TWITTER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Twitter size={24} />
                  </a>
                )}
                {guildData.socialLinks.WEBSITE && (
                  <a
                    href={guildData.socialLinks.WEBSITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <Globe size={24} />
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-300">
            <Users size={20} className="mr-2" />
            <span>{guildData.memberCount} members</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Description */}
          <div className="md:w-2/3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{guildData.roles[0].name}</h2>
              <p className="text-gray-300 whitespace-pre-line">{guildData.roles[0].description}</p>
            </div>
          </div>

          {/* Right Column: Submission Form */}
          <div className="md:w-1/3">
            <SubmissionForm form={guildData.form[0]} role={guildData.roles[0]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
