import React from "react";

import { LayoutType } from "./types";
import { Layout as antdLayout } from "antd";

import Navbar from "../Navbar";
import Footer from "../Footer";

import styles from "./styles.module.css";

const Layout = ({ children }: LayoutType) => {
  const { Content } = antdLayout;

  return (
    <Content className={styles.wrapper}>
      <Navbar />
      <div className={styles.innerWrapper}>{children}</div>
      <Footer />
    </Content>
  );
};

export default Layout;
