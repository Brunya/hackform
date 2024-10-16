import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGuilds } from "../utils/db";

interface Guild {
  id: number;
  name: string;
  urlName: string;
  imageUrl: string;
}

const ExplorerPage: React.FC = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getGuilds().then(setGuilds);
  }, []);

  const handleGuildClick = (guildId: number) => {
    navigate(`/guild/${guildId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Guilds</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {guilds.map((guild) => (
          <div
            key={guild.id}
            onClick={() => handleGuildClick(guild.id)}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <img src={guild.imageUrl} alt={guild.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{guild.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorerPage;
