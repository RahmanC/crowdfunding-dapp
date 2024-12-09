"use client";
import { client } from "@/app/client";
import { useState } from "react";
import { baseSepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount } from "thirdweb/react";
import { motion } from "framer-motion";
import { PlusCircle, Save, X } from "lucide-react";
import { toast } from "sonner";

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  refetch: () => void;
};

export const CreateCampaignModal = ({
  setIsModalOpen,
  refetch,
}: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [isDeployingContract, setIsDeployingContract] =
    useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>(1);
  const [campaignDeadline, setCampaignDeadline] = useState<number>(1);

  const handleDeployContract = async () => {
    setIsDeployingContract(true);
    try {
      await deployPublishedContract({
        client: client,
        chain: baseSepolia,
        account: account!,
        contractId: "Crowdfunding",
        contractParams: {
          _name: campaignName,
          _description: campaignDescription,
          _goal: campaignGoal,
          _durationInDays: campaignDeadline,
        } as Record<string, any>,
        publisher: "0x80bac8C84ef572c9b89F6501a03eA4685D3699D3",
        version: "1.0.2",
      });
      toast.success("Campaign deployed successfully!");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to deploy campaign");
    } finally {
      setIsDeployingContract(false);
      setIsModalOpen(false);
    }
  };

  const handleCampaignGoal = (value: number) => {
    setCampaignGoal(Math.max(1, value));
  };

  const handleCampaignLengthChange = (value: number) => {
    setCampaignDeadline(Math.max(1, value));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <PlusCircle className="mr-3 text-blue-500" />
            Create a Campaign
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </motion.button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Description
            </label>
            <textarea
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              placeholder="Describe your campaign"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Goal ($)
              </label>
              <input
                type="number"
                value={campaignGoal}
                onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Length (Days)
              </label>
              <input
                type="number"
                value={campaignDeadline}
                onChange={(e) =>
                  handleCampaignLengthChange(parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeployContract}
            disabled={isDeployingContract}
            className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isDeployingContract ? (
              <>
                <Save className="mr-2 animate-spin" />
                Creating Campaign...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2" />
                Create Campaign
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
