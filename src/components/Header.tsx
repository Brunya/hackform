import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

interface HeaderProps {
  onCreateForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateForm }) => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-white">HackForm</Link>
          <Link to="/" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">
            Explorer
          </Link>
          <button
            onClick={onCreateForm}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Create Form
          </button>
        </div>
        <button
          onClick={handleConnectWallet}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
        >
          {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Sign In'}
        </button>
      </div>
    </header>
  );
};

export default Header;