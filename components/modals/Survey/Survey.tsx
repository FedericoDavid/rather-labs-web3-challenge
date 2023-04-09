import React, { ReactElement, useEffect, useState } from "react";
import { Modal, Form, Radio, Button, Typography } from "antd";
import Image from "next/image";

import truncateWallet from "@/utils/trucateWallet";
import { useWeb3 } from "@/providers/Web3";
import { SurveyModalType, SurveyFormData } from "./types";
import { QuestionOptionsType, QuestionType } from "@/types/home";

import styles from "./styles.module.css";

const SurveyModal = ({
  survey,
  visible,
  onCancel,
  onSubmit,
}: SurveyModalType) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [formData, setFormData] = useState<SurveyFormData>({});
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(
    survey.questions[0].lifetimeSeconds
  );

  const [form] = Form.useForm();
  const { Title } = Typography;

  const { txHash } = useWeb3();

  const question: QuestionType = survey.questions[currentQuestion];

  const resetForm = () => {
    form.resetFields();

    setShowAnswers(false);
    setCurrentQuestion(0);
    setTimeLeft(survey.questions[0].lifetimeSeconds);

    onCancel();
  };

  const handleFinish = (answersData: SurveyFormData) => {
    const updatedFormData = { ...formData, ...answersData };

    if (updatedFormData[`question${currentQuestion}`] === undefined) {
      updatedFormData[`question${currentQuestion}`] = "Unanswered in time";
    }

    setFormData(updatedFormData);

    if (currentQuestion === survey.questions.length - 1) {
      setShowAnswers(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(survey.questions[currentQuestion + 1].lifetimeSeconds);
    }
  };

  const handleOnSubmit = (answersData: SurveyFormData) => {
    setIsLoading(true);

    try {
      onSubmit(answersData);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      const timeInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            clearInterval(timeInterval);
            handleFinish(formData);

            return prevTimeLeft;
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timeInterval);
    }
  }, [formData, visible]);

  const FinalSteps = (): ReactElement => {
    return (
      <div className={styles.wrapper}>
        {!txHash ? (
          <>
            <Title level={3}>Your answers: </Title>
            {survey.questions.map(
              (question: QuestionOptionsType, index: number) => (
                <p className={styles.answers} key={index}>
                  <strong>{question.text}: </strong>
                  {formData[`question${index}`]}
                </p>
              )
            )}
            <Button
              type="primary"
              style={{
                marginTop: "12px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => handleOnSubmit(formData)}
              loading={isLoading}
            >
              Submit
            </Button>
          </>
        ) : (
          <>
            <Title level={3}>Thanks to participate! 🎉 </Title>
            <p className={styles.answers}>
              You can check your transaction on a few minutes on etherscan:
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_ETHEREUM_TX_SCAN}/${txHash}`}
              className={styles.link}
            >
              {truncateWallet(txHash)}
            </a>
            <Button
              type="primary"
              style={{
                marginTop: "12px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
              }}
              onClick={resetForm}
              loading={isLoading}
            >
              Close
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <Modal open={visible} onCancel={resetForm} footer={null} closable centered>
      {!showAnswers ? (
        <Form onFinish={handleFinish} form={form} layout="vertical">
          <Title level={3}>
            {question.text} - Time Left: {timeLeft}s
          </Title>
          <div className={styles.wrapper}>
            {question.image && (
              <Image
                src={question.image}
                alt="main-logo"
                style={{ objectFit: "contain", margin: "24px 0" }}
                width={260}
                height={140}
                priority
              />
            )}
            <Form.Item
              name={`question${currentQuestion}`}
              rules={[
                {
                  required: true,
                  message: "Please select an option",
                },
              ]}
            >
              <Radio.Group>
                {question.options.map(
                  (option: QuestionOptionsType, index: number) => (
                    <Radio key={index} value={option.text}>
                      {option.text}
                    </Radio>
                  )
                )}
              </Radio.Group>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </div>
        </Form>
      ) : (
        <FinalSteps />
      )}
    </Modal>
  );
};

export default SurveyModal;
