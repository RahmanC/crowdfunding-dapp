"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/app/client";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contract";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { PlusCircle, Folder, AlertCircle } from "lucide-react";
import { CreateCampaignModal } from "@/components/CreateCampaignModal";

export default function DashboardPage() {
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get Campaigns
  const {
    data: myCampaigns,
    isLoading: isLoadingMyCampaigns,
    refetch,
  } = useReadContract({
    contract: contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-row justify-between items-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 flex items-center">
            <Folder className="mr-4 text-blue-500" size={48} />
            Dashboard
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="mr-2" />
            Create Campaign
          </motion.button>
        </motion.div>

        {/* Campaigns Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            My Campaigns
          </h2>

          {isLoadingMyCampaigns ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myCampaigns && myCampaigns.length > 0 ? (
                myCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.campaignAddress}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MyCampaignCard
                      contractAddress={campaign.campaignAddress}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12 bg-white rounded-xl shadow-md"
                >
                  <AlertCircle
                    className="mx-auto mb-4 text-blue-500"
                    size={48}
                  />
                  <p className="text-xl text-gray-500">
                    No campaigns yet. Start your first campaign!
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateCampaignModal
            setIsModalOpen={setIsModalOpen}
            refetch={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
