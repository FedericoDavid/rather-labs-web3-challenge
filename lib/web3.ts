import Web3 from "web3";

const web3 = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const ethereum = window.ethereum;
    const web3 = new Web3(ethereum);

    try {
      await ethereum.enable();

      return web3;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask native browser"
    );
  }
};

export default web3;
