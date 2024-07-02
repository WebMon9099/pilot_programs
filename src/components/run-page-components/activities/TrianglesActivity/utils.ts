import _ from 'lodash';
import triangles from './triangles';
import { Rule, RuleCategory, Triangle } from './types';

function generateThreeRules() {
  let rules: Rule[] = [];
  do {
    rules = [];

    let availableButtonKeys = ['ArrowUp', 'ArrowRight', 'ArrowDown'];

    for (const _category in RuleCategory) {
      const category = _category as RuleCategory;

      rules.push({
        category,
        same: _.sample([true, false])!,
        buttonKey: availableButtonKeys[0],
      });

      availableButtonKeys.shift();
    }
  } while (rules[0].same && rules[2].same);

  return rules;
}

function pickRuleAndGenerate(
  rules: Rule[],
  pickedRuleIndex: number
): [Rule, Rule[]] {
  return [
    rules[pickedRuleIndex],
    _.cloneDeep(rules).map((rule, index) => {
      if (index !== pickedRuleIndex) rule.same = !rule.same;

      return rule;
    }),
  ];
}

function generateRandomTriangle() {
  let triangle = _.sample(triangles)!;

  triangle.orientation = _.random(4) * 90;

  return triangle;
}

function generateAppropriateTriangle(pivot: Triangle, rules: Rule[]) {
  let matches = triangles;

  let orientationRule: Rule | undefined = undefined;
  rules.forEach((rule) => {
    switch (rule.category) {
      case RuleCategory.Color:
        matches = matches.filter(
          (triangle) => (triangle.color === pivot.color) === rule.same
        );
        break;
      case RuleCategory.Dots:
        matches = matches.filter(
          (triangle) => (triangle.dots === pivot.dots) === rule.same
        );
        break;
      case RuleCategory.Orientation:
        orientationRule = rule;
        break;
    }
  });

  let appropriateTriangle = _.cloneDeep(_.sample(matches)!);

  if (orientationRule!.same === false)
    do {
      appropriateTriangle.orientation = _.random(4) * 90;
    } while (appropriateTriangle.orientation === pivot.orientation);
  else appropriateTriangle.orientation = pivot.orientation;

  return appropriateTriangle;
}

function stringifyRule(rule: Rule) {
  const relation = rule.same ? 'same' : 'different';

  switch (rule.category) {
    case RuleCategory.Color:
      return `Triangle is ${relation} colour as predecessor.`;
    case RuleCategory.Dots:
      return `Triangle contains ${relation} number of dots as predecessor.`;
    case RuleCategory.Orientation:
      return `Triangle is ${relation} orientation to predecessor.`;
  }
}

const Utils = {
  generateThreeRules,
  pickRuleAndGenerate,
  generateRandomTriangle,
  generateAppropriateTriangle,
  stringifyRule,
};

export default Utils;
