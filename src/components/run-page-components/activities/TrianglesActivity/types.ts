export enum Stages {
  RulesPage = 'RulesPage',
  StartingTriangle = 'StartingTriangle',
  SecondTriangles = 'SecondTriangles',
}

export interface Triangle {
  color: string;
  dots: number;
  orientation?: number;
  img: string;
}

export enum RuleCategory {
  Color = 'Color',
  Orientation = 'Orientation',
  Dots = 'Dots',
}

export interface Rule {
  category: RuleCategory;
  same: boolean;
  buttonKey: string;
}
