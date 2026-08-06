export type FaqItem = {
  id: string;
  label: string;
  question: string;
  answer: string;
};

export type StepPanel = {
  label: string;
  body: string;
  media: string;
  mediaType: "video" | "image";
};

export type StepSection = {
  number: string;
  title: string;
  panels: StepPanel[];
  reverse?: boolean;
};

export type WhereItem = {
  title: string;
  body: string;
};
