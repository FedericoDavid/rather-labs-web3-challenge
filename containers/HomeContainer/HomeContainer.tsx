import React, { useState } from "react";
import Image from "next/image";
import { Button, Row, Col, Typography, Card, message } from "antd";
import {
  QuestionCircleOutlined,
  RightCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import Survey from "@/components/modals/Survey";
import { SurveyFormData } from "@/components/modals/Survey/types";
import { useWeb3 } from "@/providers/Web3";
import { HomeContainerType } from "./types";

import styles from "./styles.module.css";

const HomeContainer = ({ survey }: HomeContainerType) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { isConnected, sendSurvey, txHash } = useWeb3();
  const { title, image } = survey;

  const [messageApi, contextHolder] = message.useMessage();
  const { Title } = Typography;

  const handleModal = () => setModalVisible(!modalVisible);

  const handleStartSurvey = () => {
    if (isConnected()) {
      handleModal();
    } else {
      messageApi.info("Need to connect your wallet on Metamask before start!");
    }
  };

  const onSubmit = async (answersData: SurveyFormData) => {
    if (!answersData) return;

    try {
      sendSurvey(answersData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.header}>
      {contextHolder}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className={styles.row}>
        <Col xs={24} sm={24} md={12} lg={12} />
        <Col xs={24} sm={24} md={12} lg={12}>
          <div className={styles.innerWrapper}>
            <Card size="small" className={styles.card}>
              <Title level={4} style={{ textAlign: "center", color: "#fff" }}>
                How to use:
              </Title>
              <Title level={5} style={{ color: "#fff" }}>
                <QuestionCircleOutlined /> Choose correct options
              </Title>
              <Title level={5} style={{ color: "#fff" }}>
                <RightCircleOutlined /> Send your answers
              </Title>
              <Title level={5} style={{ color: "#fff" }}>
                <CheckCircleOutlined /> Earn $QUIZ 🤑
              </Title>
            </Card>
            <Title level={2} className={styles.mainTitle}>
              Click on today&apos;s Survey to begin!
            </Title>
            <Title level={3} className={styles.surveyTitle}>
              {title}
            </Title>
            <Image
              src={image}
              alt="main-logo"
              style={{ objectFit: "contain", margin: "12px 0" }}
              width={260}
              height={140}
              priority
            />
            <Button
              type="primary"
              style={{
                marginTop: "12px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleStartSurvey}
            >
              Start now!
            </Button>
          </div>
        </Col>
      </Row>
      <Survey
        visible={modalVisible}
        onCancel={handleModal}
        survey={survey}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default HomeContainer;
