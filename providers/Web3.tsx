import { createContext, useContext, useState } from "react";
import Web3 from "web3";

import { SurveyFormData } from "@/components/modals/Survey/types";
import quizContract from "../blockchain/contracts/contract";
import { MessageInstance } from "antd/es/message/interface";

const Web3Context = createContext<{
  web3: Web3 | null;
  networkId: number | null;
  quizBalance: number | null;
  accounts: string[] | null;
  connect: () => Promise<void>;
  switchToGoerli: () => Promise<void>;
  isConnected: () => boolean;
  sendSurvey: (
    answersData: SurveyFormData,
    messageApi: MessageInstance
  ) => void;
}>({
  web3: null,
  networkId: null,
  quizBalance: null,
  accounts: null,
  connect: async () => {},
  switchToGoerli: async () => {},
  isConnected: () => false,
  sendSurvey: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [quizBalance, setQuizBalance] = useState<number | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  const getQuizBalance = async (provider: Web3) => {
    const quiz = new provider.eth.Contract(
      quizContract,
      process.env.NEXT_PUBLIC_QUIZ_CONTRACT
    );

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
        const accounts = await web3Instance.eth.getAccounts();

        console.log(networkId);

        setAccounts(accounts);
        setWeb3(web3Instance);
        setNetworkId(networkId);
      } else {
        console.error("No Metamask provider found");
      }
    }
  };

  const isConnected = () => accounts.length > 0;

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

  const sendSurvey = async (
    answersData: SurveyFormData,
    messageApi: MessageInstance
  ) => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new Web3(window.ethereum);

      if (provider) {
        const contract = new provider.eth.Contract(
          quizContract,
          process.env.NEXT_PUBLIC_QUIZ_CONTRACT
        );

        const answersArray = Object.values(answersData).map(
          (answer: string) => {
            const parsed = parseInt(answer, 10);
            return Number.isInteger(parsed) ? parsed : 0;
          }
        );

        const params = {
          from: accounts[0],
          gasPrice: "0x0",
          gas: "0x7a120",
          value: "0x0",
          data: contract.methods.submit(1, answersArray).encodeABI(),
        };

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [params],
        });

        getQuizBalance(provider);
        console.log("Transaction hash:", txHash);

        messageApi.success("Thanks to participate on our daily surveys!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    web3,
    networkId,
    quizBalance,
    accounts,
    connect,
    switchToGoerli,
    isConnected,
    sendSurvey,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
