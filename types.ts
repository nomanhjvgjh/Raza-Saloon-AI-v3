
export type Hairstyle = {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
};

export type AnalysisResult = {
  faceShape: string;
  recommendations: string[];
  features: string[];
};

export enum AppState {
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  STYLE_SELECTION = 'STYLE_SELECTION',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT'
}
