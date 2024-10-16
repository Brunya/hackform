import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "wagmi";
import { addFormToGuild } from "../api/formApi";
import { addGuild } from "../utils/db";
import { fetchGuild } from "../api/guildApi";

interface FormField {
  question: string;
  isRequired: boolean;
  type: string;
  id: string;
}

interface FormData {
  name: string;
  description: string;
  isEditable: boolean;
  fields: FormField[];
}

interface FormCreatorProps {
  onClose: () => void;
  signerFunction: (data: any) => Promise<any>;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  isEditable: false,
  fields: [],
};

const fieldTypes = [
  { value: "SHORT_TEXT", label: "Short text" },
  { value: "LONG_TEXT", label: "Long text" },
  { value: "NUMBER", label: "Number" },
];

const FormCreator: React.FC<FormCreatorProps> = ({ onClose, signerFunction }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected } = useAccount();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddField = () => {
    const newField: FormField = {
      question: "",
      isRequired: false,
      type: "SHORT_TEXT",
      id: uuidv4(),
    };
    setFormData((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const handleFieldChange = (id: string, field: Partial<FormField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...field } : f)),
    }));
  };

  const handleRemoveField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Kérjük, először csatlakoztassa a tárcáját");
      return;
    }
    setIsSubmitting(true);

    try {
      console.log("Form data:", formData);
      const result = await addFormToGuild(signerFunction, formData);
      console.log("Az űrlap sikeresen elküldve", result);
      console.log({ result });

      const guildResponse = await fetchGuild(result.id);
      console.log({ guildResponse });

      const newGuild = {
        id: guildResponse.id,
        name: formData.name,
        urlName: formData.name.toLowerCase().replace(/\s+/g, "-"), // Simple URL-friendly name
        imageUrl: "https://guild-xyz.mypinata.cloud/ipfs/QmVvZzREJtugFxzgnNWKAJyLkwuRXDjw3TLJGpG3Dx5PQa",
      };
      addGuild(newGuild);

      onClose();
    } catch (error) {
      console.error("Hiba az űrlap elküldésekor:", error);
      alert("Nem sikerült elküldeni az űrlapot. Kérjük, próbálja újra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create Form</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Form Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Form Fields</h3>
              {formData.fields.map((field) => (
                <div key={field.id} className="bg-gray-700 p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={field.question}
                      onChange={(e) => handleFieldChange(field.id, { question: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
                      placeholder="Question"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={field.type}
                      onChange={(e) => handleFieldChange(field.id, { type: e.target.value })}
                      className="px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={field.isRequired}
                        onChange={(e) => handleFieldChange(field.id, { isRequired: e.target.checked })}
                        className="mr-2"
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddField}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" />
                Add Field
              </button>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !isConnected}
              className={`w-full py-2 px-4 rounded-md font-semibold text-white transition duration-300 ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : isConnected
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Create Form"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormCreator;
