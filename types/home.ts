export type QuestionOptionsType = {
  text: string;
};

export type QuestionType = {
  text: string;
  image: string;
  lifetimeSeconds: number;
  options: QuestionOptionsType[];
};

export type SurveyType = {
  title: string;
  image: string;
  questions: QuestionType[];
};
