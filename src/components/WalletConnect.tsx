import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const WalletConnect: React.FC = () => {
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { connect, error: connectError, isLoading, pendingConnector } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setSignedMessage(null);
  };

  const handleSignMessage = async () => {
    try {
      const signature = await signMessageAsync({ message: 'Hello, World!' });
      setSignedMessage(signature);
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col items-end">
      {isConnected ? (
        <>
          <p className="text-sm text-gray-300 mb-2">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <button
            onClick={handleDisconnect}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            Disconnect
          </button>
          <button
            onClick={handleSignMessage}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Sign Message
          </button>
          {signedMessage && (
            <p className="text-sm text-gray-300 mt-2">
              Signed: {signedMessage.slice(0, 10)}...
            </p>
          )}
        </>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
        >
          {isLoading ? `Connecting to ${pendingConnector?.name}...` : 'Connect Wallet'}
        </button>
      )}
      {connectError && (
        <p className="text-sm text-red-500 mt-2">
          Error: {connectError.message}
        </p>
      )}
    </div>
  );
};

export default WalletConnect;