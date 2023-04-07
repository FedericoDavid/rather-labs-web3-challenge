import { SurveyType } from "@/types/home";

export type SurveyModalType = {
  survey: SurveyType;
  visible: boolean;
  onCancel: () => void;
};
