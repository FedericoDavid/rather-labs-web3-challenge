import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout, Button } from "antd";

import styles from "./styles.module.css";

const Navbar = () => {
  const { Header } = Layout;

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
      <div className={styles.buttonWrapper}>
        <Button type="primary">Connect Wallet</Button>
      </div>
    </Header>
  );
};

export default Navbar;
