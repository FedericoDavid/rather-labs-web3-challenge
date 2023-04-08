import { SurveyType } from "@/types/home";

export type SurveyFormData = {
  [key: string]: string;
};

export type SurveyModalType = {
  survey: SurveyType;
  visible: boolean;
  onSubmit: (answersData: SurveyFormData) => void;
  onCancel: () => void;
};
