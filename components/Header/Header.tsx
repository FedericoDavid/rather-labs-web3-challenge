import React from "react";
import { Button, Row, Col, Typography } from "antd";

import styles from "./styles.module.css";

const Header = () => {
  const { Title } = Typography;

  return (
    <div className={styles.header}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className={styles.row}>
        <Col xs={24} sm={24} md={12} lg={12} />
        <Col xs={24} sm={24} md={12} lg={12}>
          <div className={styles.innerWrapper}>
            <Title level={4}>Click on today&apos;s Survey to begin!</Title>
            <Button onClick={() => {}}>Start now!</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Header;
