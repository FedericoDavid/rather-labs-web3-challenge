import React from "react";

import { LayoutType } from "./types";
import { Layout as antdLayout } from "antd";

import Navbar from "../Navbar";

import styles from "./styles.module.css";

const Layout = ({ children }: LayoutType) => {
  const { Content, Footer } = antdLayout;

  return (
    <Content className={styles.wrapper}>
      <Navbar />
      <div className={styles.innerWrapper}>{children}</div>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Content>
  );
};

export default Layout;
