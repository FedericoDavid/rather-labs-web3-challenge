import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Web3 from "web3";

import { SurveyFormData } from "@/components/modals/Survey/types";

import quizContract from "../blockchain/contracts/contract";

const Web3Context = createContext<{
  web3: Web3 | null;
  networkId: number | null;
  quizBalance: number | null;
  accounts: string[] | null;
  txHash: string | null;
  connect: () => Promise<void>;
  switchToGoerli: () => Promise<void>;
  isConnected: () => boolean;
  sendSurvey: (answersData: SurveyFormData) => void;
}>({
  web3: null,
  networkId: null,
  quizBalance: null,
  accounts: null,
  txHash: null,
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
  const [txHash, setTxHash] = useState<string | null>(null);

  const getProvider = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const provider = window.ethereum;

    if (!provider || !provider.isMetaMask) {
      return null;
    }

    return provider;
  };

  const isGoerli = () =>
    networkId &&
    networkId.toString() === process.env.NEXT_PUBLIC_GOERLI_TESTNET;

  const getQuizBalance = useCallback(
    async (provider: Web3, account?: string): Promise<void> => {
      const quiz = new provider.eth.Contract(
        quizContract,
        process.env.NEXT_PUBLIC_QUIZ_CONTRACT
      );

      const quizBalanceOf = await quiz.methods
        .balanceOf(account || accounts[0])
        .call();

      setQuizBalance(parseInt(quizBalanceOf));
    },
    [accounts]
  );

  const getNetworkId = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      const provider = (window as any).ethereum;

      if (provider) {
        const web3Instance = new Web3(provider);

        const networkId = await web3Instance.eth.net.getId();

        setNetworkId(networkId);
      }
    }
  };

  const connect = async (): Promise<void> => {
    const provider = getProvider();

    if (!provider) {
      console.error("No Metamask provider found");
      return;
    }

    await provider.request({ method: "eth_requestAccounts" });

    const web3Instance = new Web3(provider);

    const accounts = await web3Instance.eth.getAccounts();

    setAccounts(accounts);
    setWeb3(web3Instance);

    if (isGoerli()) {
      getQuizBalance(web3Instance, accounts[0]);
    }
  };

  const isConnected = () => accounts.length > 0;

  const switchToGoerli = async (): Promise<void> => {
    const provider = getProvider();

    if (!provider) {
      console.error("No Metamask provider found");
      return;
    }

    try {
      if (!isGoerli()) {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x5` }],
        });

        const web3Instance = new Web3(provider);

        setWeb3(web3Instance);

        setNetworkId(networkId);
        getQuizBalance(web3Instance);
        getNetworkId();
      } else {
        console.log("Already connected to Goerli testnet");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendSurvey = async (answersData: SurveyFormData): Promise<void> => {
    setTxHash(null);

    try {
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

        const transactionHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [params],
        });

        setTxHash(transactionHash);
        getQuizBalance(provider);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNetworkId();
  }, []);

  const value = {
    web3,
    networkId,
    quizBalance,
    accounts,
    txHash,
    connect,
    switchToGoerli,
    isConnected,
    sendSurvey,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
