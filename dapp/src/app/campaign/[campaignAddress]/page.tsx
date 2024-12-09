"use client";
import { client } from "@/app/client";
import { TierCard } from "@/components/TierCard";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContract, prepareContractCall, ThirdwebContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import {
  lightTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import {
  Edit,
  Check,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  Plus,
  PlusCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function CampaignPage() {
  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress as string,
  });

  // Name of the campaign
  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Description of the campaign
  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  // Campaign deadline
  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });
  // Convert deadline to a date
  const deadlineDate = new Date(
    parseInt(deadline?.toString() as string) * 1000
  );
  // Check if deadline has passed
  const hasDeadlinePassed = deadlineDate < new Date();

  // Goal amount of the campaign
  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  // Total funded balance of the campaign
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  // Calulate the total funded balance percentage
  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  // If balance is greater than or equal to goal, percentage should be 100
  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  // Get tiers for the campaign
  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract: contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  // Get owner of the campaign
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  // Get status of the campaign
  const { data: status } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  const statusLabels = ["Active", "Successful", "Inactive"];
  const statusColors = ["text-blue-600", "text-green-600", "text-red-600"];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row justify-between items-center mb-8"
      >
        {!isLoadingName && (
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            {name}
            {status !== undefined && (
              <span
                className={`ml-4 text-sm px-3 py-1 rounded-full ${statusColors[status]} bg-opacity-10 bg-current`}
              >
                {statusLabels[status]}
              </span>
            )}
          </h1>
        )}

        {owner === account?.address && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Check className="mr-2" size={18} /> Done
              </>
            ) : (
              <>
                <Edit className="mr-2" size={18} /> Edit
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* Left Column: Campaign Details */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="mr-3 text-blue-600" size={24} />
              Description
            </h2>
            <p className="text-gray-600">{description}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-3 text-blue-600" size={24} />
              Deadline
            </h2>
            {!isLoadingDeadline && (
              <p className="text-gray-600">
                {deadlineDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {hasDeadlinePassed && (
                  <span className="ml-2 text-red-500 text-sm">
                    (Deadline Passed)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Funding Progress */}
        <div className="space-y-6">
          {!isLoadingBalance && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="mr-3 text-blue-600" size={24} />
                Funding Progress
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${balancePercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-4 bg-blue-600 rounded-full flex items-center justify-end"
                >
                  <span className="text-white text-xs mr-2">
                    {balancePercentage.toFixed(1)}%
                  </span>
                </motion.div>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Raised: ${balance?.toString()}</span>
                <span>Goal: ${goal?.toString()}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tiers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-3 text-blue-600" size={24} />
            Funding Tiers
          </h2>
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="mr-2" size={18} /> Add Tier
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingTiers ? (
            <p>Loading tiers...</p>
          ) : tiers && tiers.length > 0 ? (
            tiers.map((tier, index) => (
              <TierCard
                key={index}
                tier={tier}
                index={index}
                contract={contract}
                isEditing={isEditing}
              />
            ))
          ) : (
            !isEditing && <p>No tiers available</p>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <CreateCampaignModal
            setIsModalOpen={setIsModalOpen}
            contract={contract}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateCampaignModal = ({
  setIsModalOpen,
  contract,
}: CreateTierModalProps) => {
  const [tierName, setTierName] = useState<string>("");
  const [tierAmount, setTierAmount] = useState<bigint>(1n);

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <PlusCircle className="mr-3 text-blue-500" />
            Create a Funding Tier
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
        <div className="flex flex-col">
          <label>Tier Name:</label>
          <input
            type="text"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
            placeholder="Tier Name"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <label>Tier Cost:</label>
          <input
            type="number"
            value={parseInt(tierAmount.toString())}
            onChange={(e) => setTierAmount(BigInt(e.target.value))}
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: contract,
                method: "function addTier(string _name, uint256 _amount)",
                params: [tierName, tierAmount],
              })
            }
            onTransactionConfirmed={async () => {
              toast("Tier added successfully!");
              setIsModalOpen(false);
            }}
            onError={(error) => toast(`Error: ${error.message}`)}
            theme={lightTheme()}
            className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Add Tier
          </TransactionButton>
        </div>
      </motion.div>
    </motion.div>
  );
};
