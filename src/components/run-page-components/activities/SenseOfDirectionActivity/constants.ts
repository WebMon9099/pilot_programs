import type { Choice, Direction } from "./types";

export const POSSIBLE_DIRECTIONS: Direction[] = [
  {
    direction: "up",
    image: require("./images/svgs/up.svg").default,
  },
  {
    direction: "right",
    image: require("./images/svgs/right.svg").default,
  },
  {
    direction: "down",
    image: require("./images/svgs/down.svg").default,
  },
  {
    direction: "left",
    image: require("./images/svgs/left.svg").default,
  },
];

export const POSSIBLE_CHOICES: Choice[] = [
  {
    direction: "up",
    image: require("./images/svgs/up_button.svg").default,
    correctImage: require("./images/svgs/up_button_correct.svg").default,
    wrongImage: require("./images/svgs/up_button_wrong.svg").default,
  },
  {
    direction: "left",
    image: require("./images/svgs/left_button.svg").default,
    correctImage: require("./images/svgs/left_button_correct.svg").default,
    wrongImage: require("./images/svgs/left_button_wrong.svg").default,
  },
  {
    direction: "right",
    image: require("./images/svgs/right_button.svg").default,
    correctImage: require("./images/svgs/right_button_correct.svg").default,
    wrongImage: require("./images/svgs/right_button_wrong.svg").default,
  },
  {
    direction: "reverse",
    image: require("./images/svgs/reverse_button.svg").default,
    correctImage: require("./images/svgs/reverse_button_correct.svg").default,
    wrongImage: require("./images/svgs/reverse_button_wrong.svg").default,
  },
];

export const POSSIBLE_ANSWERS: { [key: string]: string } = {
  down_left_right: require("./images/down_left_right.png"),
  down_reverse_up: require("./images/down_reverse_up.png"),
  down_right_left: require("./images/down_right_left.png"),
  down_up_down: require("./images/down_up_down.png"),
  left_left_down: require("./images/left_left_down.png"),
  left_reverse_right: require("./images/left_reverse_right.png"),
  left_right_up: require("./images/left_right_up.png"),
  left_up_left: require("./images/left_up_left.png"),
  right_left_up: require("./images/right_left_up.png"),
  right_reverse_left: require("./images/right_reverse_left.png"),
  right_right_down: require("./images/right_right_down.png"),
  right_up_right: require("./images/right_up_right.png"),
  up_left_left: require("./images/up_left_left.png"),
  up_reverse_down: require("./images/up_reverse_down.png"),
  up_right_right: require("./images/up_right_right.png"),
  up_up_up: require("./images/up_up_up.png"),
};
