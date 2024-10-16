import React, { useState } from "react";
import { Twitter, MessageSquare, Calendar, Check } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

interface FormField {
  id: string;
  question: string;
  isRequired: boolean;
  type: string;
}

interface Requirement {
  type: string;
  data: {
    minAmount?: number;
    memberSince?: number;
    serverId?: string;
    roleId?: string;
    serverName?: string;
    roleName?: string;
  };
}

interface SubmissionFormProps {
  form: {
    name: string;
    fields: FormField[];
  };
  role: {
    requirements: Requirement[];
  };
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ form, role }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Submitted form data:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const formatRequirement = (req: Requirement) => {
    switch (req.type) {
      case "TWITTER_FOLLOWER_COUNT":
        return `Have at least ${req.data.minAmount} Twitter followers`;
      case "TWITTER_ACCOUNT_AGE_RELATIVE":
        return `Twitter account age: ${Math.floor(req.data.minAmount! / (1000 * 60 * 60 * 24))} days`;
      case "DISCORD_JOIN_FROM_NOW":
        return `Joined Discord server ${Math.floor(req.data.memberSince! / (1000 * 60 * 60 * 24))} days ago`;
      case "DISCORD_ROLE":
        return `Have "${req.data.roleName}" role in "${req.data.serverName}" Discord server`;
      default:
        return req.type;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold mb-4">Register for the raffle</h2>
      <p className="text-gray-600 mb-6">Fill in the form to be part of the raffle.</p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Validations</h3>
        <ul className="space-y-3">
          {role.requirements.map((req, index) => (
            <li key={index} className="flex items-center bg-gray-100 p-3 rounded-md text-sm">
              {req.type.includes("TWITTER") && <Twitter size={16} className="mr-3 text-blue-400" />}
              {req.type.includes("DISCORD") && <MessageSquare size={16} className="mr-3 text-indigo-400" />}
              {!req.type.includes("TWITTER") && !req.type.includes("DISCORD") && (
                <Calendar size={16} className="mr-3 text-green-400" />
              )}
              <span>{formatRequirement(req)}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Wallet</h3>
          <button
            type="button"
            onClick={handleConnectWallet}
            className="w-full bg-gray-100 text-left px-4 py-3 rounded-md hover:bg-gray-200 transition duration-300 flex items-center"
          >
            {isConnected ? (
              <>
                <span className="text-green-500 mr-2">✓</span>
                <span>{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
              </>
            ) : (
              "Connect your wallet"
            )}
          </button>
        </div>

        {form.fields.map((field) => (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
              {field.question}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id={field.id}
              value={formData[field.id] || ""}
              onChange={handleInputChange}
              required={field.isRequired}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your answer"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting || isSubmitted}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition duration-300 ${
            isSubmitted
              ? "bg-green-500 hover:bg-green-600"
              : isSubmitting
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {isSubmitted ? (
            <span className="flex items-center justify-center">
              <Check size={20} className="mr-2" />
              Submitted
            </span>
          ) : isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;
