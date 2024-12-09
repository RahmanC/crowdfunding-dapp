"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Target, Layout } from "lucide-react";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import logo from "@public/logo.svg";
import { client } from "@/app/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const account = useActiveAccount();

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const navLinks = [
    // {
    //   href: "/",
    //   label: "Home",
    //   icon: Home,
    //   showAlways: true,
    // },
    {
      href: "/",
      label: "Campaigns",
      icon: Target,
      showAlways: true,
    },
    {
      href: `/dashboard/${account?.address}`,
      label: "Dashboard",
      icon: Layout,
      showAlways: false,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            className="hover:scale-110 transition-transform"
          />
          <span className="text-xl font-bold text-gray-800">CrowdFund</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map(
            (link) =>
              (link.showAlways || (link.showAlways === false && account)) && (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              )
          )}
          <ConnectButton
            client={client}
            theme={lightTheme()}
            detailsButton={{
              style: {
                maxHeight: "50px",
              },
            }}
          />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="text-gray-800"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed top-16 right-0 w-64 bg-white shadow-lg md:hidden"
            >
              <div className="flex flex-col p-4 space-y-3">
                {navLinks.map(
                  (link) =>
                    (link.showAlways ||
                      (link.showAlways === false && account)) && (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <link.icon size={20} />
                        <span>{link.label}</span>
                      </Link>
                    )
                )}
                <div className="pt-2">
                  <ConnectButton
                    client={client}
                    theme={lightTheme()}
                    detailsButton={{
                      style: {
                        maxHeight: "50px",
                      },
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
