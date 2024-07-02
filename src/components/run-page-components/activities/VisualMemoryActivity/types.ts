export enum Stages {
  Show = 'Show',
  Question = 'Question',
}

export interface Set {
  key: string | JSX.Element;
  value: string;
}
