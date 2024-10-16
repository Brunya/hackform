import React, { useState, useEffect } from "react";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import ProfilePage from "./components/ProfilePage";
import FormCreator from "./components/FormCreator";
import ExplorerPage from "./components/ExplorerPage";
import { fetchGuild } from "./api/guildApi";
import AppContent from "./components/AppContent";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
      }),
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const App: React.FC = () => {
  return (
    <WagmiConfig config={config}>
      <Router>
        <AppContent />
      </Router>
    </WagmiConfig>
  );
};

export default App;