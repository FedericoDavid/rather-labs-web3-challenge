import React, { ReactElement } from "react";

import styles from "./styles.module.css";

const Container = ({
  children,
}: {
  children: ReactElement[] | ReactElement;
}) => <div className={styles.wrapper}>{children}</div>;

export default Container;
