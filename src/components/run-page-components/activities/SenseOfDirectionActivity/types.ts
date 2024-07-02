export enum Stages {
  StartDirection = "StartDirection",
  NewDirection = "EndDirection",
}

export interface Direction {
  direction: "up" | "right" | "down" | "left";
  image: string;
}

export interface Choice {
  direction: "up" | "right" | "reverse" | "left";
  image: string;
  correctImage: string;
  wrongImage: string;
}
