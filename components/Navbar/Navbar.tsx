import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout, Button } from "antd";

import { useWeb3 } from "@/providers/Web3";

import styles from "./styles.module.css";

const Navbar = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const { web3, networkId, connect, switchToGoerli } = useWeb3();

  const { Header } = Layout;

  const connectToWallet = async () => {
    await connect();
  };

  const switchToGoerliIfNeeded = async () => {
    await switchToGoerli();
  };

  const getAccounts = () => {
    //move to provider
    if (web3) {
      web3.eth.getAccounts().then((accounts) => {
        setAccounts(accounts);
        console.log(accounts, "accounts");
      });
    }
  };

  useEffect(() => {
    getAccounts();
  }, [web3]);

  return (
    <Header className={styles.wrapper}>
      <div className={styles.linkWrapper}>
        <Link href="/" passHref>
          <Image
            src="/images/ratherlabs-logo.png"
            alt="main-logo"
            style={{ objectFit: "contain", marginTop: 24 }}
            width={260}
            height={140}
            priority
          />
        </Link>
      </div>
      <>
        {accounts.length > 0 ? (
          <p>Connected to wallet with address: {accounts[0]}</p>
        ) : (
          <Button type="primary" onClick={connectToWallet}>
            Connect to Metamask
          </Button>
        )}
        {networkId && networkId === 1 && (
          <Button type="primary" onClick={switchToGoerliIfNeeded}>
            Switch to Goerli
          </Button>
        )}
      </>
    </Header>
  );
};

export default Navbar;
