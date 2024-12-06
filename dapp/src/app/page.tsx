"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { CROWDFUNDING_FACTORY } from "./constants/contract";
import { CampaignCard } from "@/components/CampaignCard";
import { Sparkles, PlusCircle } from "lucide-react";
import { CreateCampaignModal } from "@/components/CreateCampaignModal";

export default function Home() {
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Get CrowdfundingFactory contract
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get all campaigns deployed with CrowdfundingFactory
  const {
    data: campaigns,
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns,
  } = useReadContract({
    contract: contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: [],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 pt-16 pb-8 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Crowdfund Your Dream
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Transform ideas into reality with community-powered funding
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center space-x-4"
          >
            {account && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="mr-2" />
                Create Campaign
              </motion.button>
            )}

            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              <TrendingUp className="mr-2" />
              Explore Campaigns
            </motion.button> */}
          </motion.div>
        </div>
      </motion.div>

      {/* Campaigns Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sparkles className="mr-3 text-blue-500" />
            Active Campaigns
          </h2>
          {/* <Link href="/campaigns" className="text-blue-600 hover:underline">
            View All
          </Link> */}
        </div>

        {isLoadingCampaigns ? (
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
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <motion.div
                  key={campaign.campaignAddress}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CampaignCard campaignAddress={campaign.campaignAddress} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 bg-white rounded-xl shadow-md"
              >
                <p className="text-xl text-gray-500">
                  No active campaigns yet. Be the first to start one!
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <CreateCampaignModal
            setIsModalOpen={setIsModalOpen}
            refetch={refetchCampaigns}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
