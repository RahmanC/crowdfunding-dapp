"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { CircleCheck, TrendingUp } from "lucide-react";

type CampaignCardProps = {
  campaignAddress: string;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaignAddress,
}) => {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress,
  });

  // Existing contract read hooks
  const { data: campaignName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  // Calculate the total funded balance percentage
  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    totalBalance && totalGoal
      ? (parseInt(totalBalance) / parseInt(totalGoal)) * 100
      : 0;

  // Ensure percentage is capped at 100
  balancePercentage = Math.min(balancePercentage, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
      }}
      className="flex flex-col justify-between max-w-sm w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Progress Bar */}
      <div className="relative w-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${balancePercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700"
        />
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center">
            {campaignName}
            {balancePercentage >= 100 && (
              <CircleCheck className="ml-2 text-green-500" size={24} />
            )}
          </h5>
          <motion.span
            className="text-sm font-medium text-blue-600 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TrendingUp className="mr-1" size={16} />
            {balancePercentage.toFixed(1)}%
          </motion.span>
        </div>

        <p className="mb-4 text-gray-600 flex-grow line-clamp-3">
          {campaignDescription}
        </p>

        {/* Funding Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${balancePercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-blue-600 h-2.5 rounded-full"
          />
        </div>

        {/* Campaign Details */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Raised: ${balance?.toString()}
          </span>
          <span className="text-sm text-gray-500">
            Goal: ${goal?.toString()}
          </span>
        </div>

        {/* View Campaign Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4"
        >
          <Link href={`/campaign/${campaignAddress}`} passHref>
            <div className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors">
              View Campaign
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
