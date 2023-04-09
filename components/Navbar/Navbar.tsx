import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout, Button } from "antd";

import truncateWallet from "@/utils/trucateWallet";
import { useWeb3 } from "@/providers/Web3";

import styles from "./styles.module.css";

const Navbar = () => {
  const {
    networkId,
    connect,
    switchToGoerli,
    accounts,
    quizBalance,
    isConnected,
  } = useWeb3();

  const { Header } = Layout;

  const connectToWallet = async () => {
    await connect();
  };

  const switchToGoerliIfNeeded = async () => {
    await switchToGoerli();
  };

  const isMainnet = () =>
    networkId &&
    networkId.toString() === process.env.NEXT_PUBLIC_MAINNET &&
    isConnected();

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
      {isConnected() && accounts?.length ? (
        <div className={styles.loginWrapper}>
          <>
            <p className={styles.text}>
              Connected to wallet: {truncateWallet(accounts[0])}
            </p>
            {!isMainnet() && (
              <p className={styles.text}>$Quiz: {quizBalance}</p>
            )}
          </>
          {isMainnet() && (
            <Button
              type="primary"
              onClick={switchToGoerliIfNeeded}
              className={styles.button}
              style={{
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              Switch to Goerli
            </Button>
          )}
        </div>
      ) : (
        <Button
          type="primary"
          onClick={connectToWallet}
          style={{
            marginRight: "32px",
            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          Connect to Metamask
        </Button>
      )}
    </Header>
  );
};

export default Navbar;
