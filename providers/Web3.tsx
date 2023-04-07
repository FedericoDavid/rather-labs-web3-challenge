import { createContext, useContext, useState } from "react";
import Web3 from "web3";

import quizContract from "../blockchain/contracts/contract";

const Web3Context = createContext<{
  web3: Web3 | null;
  networkId: number | null;
  quizBalance: number | null;
  connect: () => Promise<void>;
  switchToGoerli: () => Promise<void>;
  isConnected: () => boolean;
}>({
  web3: null,
  networkId: null,
  quizBalance: null,
  connect: async () => {},
  switchToGoerli: async () => {},
  isConnected: () => false,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [quizBalance, setQuizBalance] = useState<number | null>(null);

  const getQuizBalance = async (provider: Web3) => {
    const quiz = new provider.eth.Contract(
      quizContract,
      process.env.NEXT_PUBLIC_QUIZ_CONTRACT
    );

    const accounts = await provider.eth.getAccounts();
    const quizBalanceOf = await quiz.methods.balanceOf(accounts[0]).call();

    setQuizBalance(parseInt(quizBalanceOf));
  };

  const connect = async () => {
    if (typeof window !== "undefined") {
      const provider = (window as any).ethereum;

      if (provider && provider.isMetaMask) {
        await provider.request({ method: "eth_requestAccounts" });

        const web3Instance = new Web3(provider);

        const networkId = await web3Instance.eth.net.getId();

        console.log(networkId);

        setWeb3(web3Instance);
        setNetworkId(networkId);
      } else {
        console.error("No Metamask provider found");
      }
    }
  };

  const switchToGoerli = async () => {
    if (typeof window !== "undefined") {
      const provider = (window as any).ethereum;

      if (provider && provider.isMetaMask) {
        try {
          const networkId = await provider.request({ method: "net_version" });

          if (parseInt(networkId) !== 5) {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x5` }],
            });

            const web3Instance = new Web3(provider);

            setWeb3(web3Instance);
            setNetworkId(networkId);
            getQuizBalance(web3Instance);
          } else {
            console.log("Already connected to Goerli testnet");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("No Metamask provider found");
      }
    }
  };

  const isConnected = () => {
    const { ethereum } = window;

    if (!ethereum) return false;

    return ethereum.selectedAddress !== null;
  };

  const value = {
    web3,
    networkId,
    quizBalance,
    connect,
    switchToGoerli,
    isConnected,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
