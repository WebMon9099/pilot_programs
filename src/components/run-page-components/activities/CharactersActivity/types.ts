export enum Answer {
  Neutral = 'Neutral',
  No = 'No',
  Yes = 'Yes',
}

export interface Question {
  string: string;
  answer: string;
}

export interface DotsObject {
  top: number[];
  bottom: number[];
}
