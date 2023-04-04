import { createContext, useContext, useState } from "react";
import Web3 from "web3";

import quizContract from "../blockchain/contracts/contract";

const Web3Context = createContext<{
  web3: Web3 | null;
  networkId: number | null;
  quizBalance: number | null;
  connect: () => Promise<void>;
  switchToGoerli: () => Promise<void>;
}>({
  web3: null,
  networkId: null,
  quizBalance: null,
  connect: async () => {},
  switchToGoerli: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [quizBalance, setQuizBalance] = useState<number | null>(null);

  const getQuizBalance = () => {
    //
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

        const quiz = new web3Instance.eth.Contract(
          quizContract,
          "0x437eF217203452317C3C955Cf282b1eE5F6aaF72"
        );
        const accounts = await web3Instance.eth.getAccounts();
        const quizBalanceOf = await quiz.methods
          .balanceOf(accounts[0])
          .call({ gas: 600000 });
        console.log(`QUIZ balance: ${quizBalanceOf}`);
        setQuizBalance(parseInt(quizBalanceOf));
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
          console.log(networkId, "networkId");

          if (networkId !== 5) {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x5` }],
            });

            setWeb3(new Web3(provider));
            setNetworkId(networkId);
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

  const value = {
    web3,
    networkId,
    quizBalance,
    connect,
    switchToGoerli,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
