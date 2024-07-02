export enum Stages {
  ShowCategory = 'ShowCategory',
  Display = 'Display',
  Question = 'Question',
  DisplayAnswer = 'DisplayAnswer',
}

export interface Image {
  category: Categories;
  value: number;
  src: string;
}

export type Categories =
  | 'Black Squares'
  | 'Black Circles'
  | 'White Squares'
  | 'White Circles';

export type State = (number | 'nr')[];
