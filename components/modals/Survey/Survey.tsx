import React, { useState } from "react";
import Image from "next/image";
import { Modal, Form, Radio, Button, Typography } from "antd";

import { SurveyModalType } from "./types";
import { QuestionOptionsType, QuestionType } from "@/types/home";

type FormData = {
  [key: string]: string;
};

const SurveyModal = ({ survey, visible, onCancel }: SurveyModalType) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showAnswers, setShowAnswers] = useState<boolean>(false);

  const [form] = Form.useForm();
  const { Title } = Typography;

  const question: QuestionType = survey.questions[currentQuestion];

  const handleFinish = (values: FormData) => {
    const updatedFormData = { ...formData, ...values };

    setFormData(updatedFormData);

    if (currentQuestion === survey.questions.length - 1) {
      setShowAnswers(true);
    } else {
      form.resetFields();
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} closable={false}>
      {!showAnswers ? (
        <Form onFinish={handleFinish} form={form}>
          <Title level={3}>{question.text}</Title>
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
        </Form>
      ) : (
        <>
          <Title level={3}>Your answers: </Title>
          {survey.questions.map(
            (question: QuestionOptionsType, index: number) => (
              <p key={index}>
                <strong>{question.text}: </strong>
                {formData[`question${index}`]}
              </p>
            )
          )}
          <Button
            type="primary"
            onClick={() => console.log(formData, "formdata")}
          >
            Submit
          </Button>
        </>
      )}
    </Modal>
  );
};

export default SurveyModal;
