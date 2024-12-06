"use client";

import React from "react";
import { motion } from "framer-motion";
import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { Zap, Trash2 } from "lucide-react";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
};

export const TierCard: React.FC<TierCardProps> = ({
  tier,
  index,
  contract,
  isEditing,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
      }}
      className="max-w-sm flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-xl shadow-lg relative overflow-hidden"
    >
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700" />

      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
          <span className="text-2xl font-semibold text-blue-600">
            ${tier.amount.toString()}
          </span>
        </div>

        <div className="flex-grow mb-4">
          <p className="text-sm text-gray-500 flex items-center">
            <span className="mr-2 font-semibold">Total Backers:</span>
            {tier.backers.toString()}
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: contract,
                method: "function fund(uint256 _tierIndex) payable",
                params: [BigInt(index)],
                value: tier.amount,
              })
            }
            onError={(error) => alert(`Error: ${error.message}`)}
            onTransactionConfirmed={async () => alert("Funded successfully!")}
            className="flex gap-2 items-center justify-center px-auto py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:text-white transition-colors"
          >
            {/* <Zap size={18} /> */}
            Select Tier
          </TransactionButton>

          {isEditing && (
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: "function removeTier(uint256 _index)",
                  params: [BigInt(index)],
                })
              }
              onError={(error) => alert(`Error: ${error.message}`)}
              onTransactionConfirmed={async () =>
                alert("Removed successfully!")
              }
              className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
              {/* <Trash2 className="mr-2" size={18} /> */}
              Remove Tier
            </TransactionButton>
          )}
        </div>
      </div>
    </motion.div>
  );
};
