import React, { useState, useEffect } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { useAccount, useSignMessage } from "wagmi";
import Header from "./Header";
import ProfilePage from "./ProfilePage";
import FormCreator from "./FormCreator";
import ExplorerPage from "./ExplorerPage";
import { fetchGuild } from "../api/guildApi";
import { createGuildClient, createSigner } from "@guildxyz/sdk";

const AppContent: React.FC = () => {
  const [guildData, setGuildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormCreator, setShowFormCreator] = useState<boolean>(false);
  const { guildId } = useParams<{ guildId: string }>();

  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const signerFunction = createSigner.custom((message) => signMessageAsync({ message }), address);

  useEffect(() => {
    const loadGuildData = async () => {
      try {
        const data = await fetchGuild(76300);
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
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Header onCreateForm={() => setShowFormCreator(true)} />
      <Routes>
        <Route path="/" element={<ExplorerPage />} />
        <Route path="/guild/:guildId" element={<ProfilePage guildData={guildData} signerFunction={signerFunction} />} />
      </Routes>
      {showFormCreator && <FormCreator onClose={() => setShowFormCreator(false)} signerFunction={signerFunction} />}
    </div>
  );
};

export default AppContent;
