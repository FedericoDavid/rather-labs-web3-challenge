import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Modal, Form, Radio, Button, Typography } from "antd";

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

  const question: QuestionType = survey.questions[currentQuestion];

  const resetForm = () => {
    form.resetFields();

    setShowAnswers(false);
    setCurrentQuestion(0);
    setTimeLeft(survey.questions[0].lifetimeSeconds);

    onCancel();
  };

  const handleFinish = (values: SurveyFormData) => {
    const updatedFormData = { ...formData, ...values };

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

  const handleOnSubmit = (values: SurveyFormData) => {
    setIsLoading(true);

    onSubmit(values);
    resetForm();

    setIsLoading(false);
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
        <div className={styles.wrapper}>
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
            style={{ marginTop: "12px" }}
            onClick={() => handleOnSubmit(formData)}
            loading={isLoading}
          >
            Submit
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default SurveyModal;
