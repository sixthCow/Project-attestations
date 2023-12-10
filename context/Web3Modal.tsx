"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Get projectId
const projectId = "07c8eb0913ac95dc00601eaa51a4aa58";

// 2. Set chains
const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://1rpc.io/sepolia",
};
const base = {
  chainId: 84531,
  name: "Base Goerli",
  currency: "ETH",
  explorerUrl: "https://goerli.basescan.org/",
  rpcUrl: "https://goerli.base.org",
};

// 3. Create modal
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://violeth-ist.vercel.app/",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [
    sepolia,
    base
  ],
  projectId,
});

export function Web3ModalProvider({ children }: { children: any }) {
  return children;
}
