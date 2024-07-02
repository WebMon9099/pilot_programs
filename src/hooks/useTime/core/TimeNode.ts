import { Callback } from '../../../types';

export interface TimeNodeControl {
  cancel: Callback;
  pause: Callback;
  resume: Callback;
}

export class TimeNode {
  private next?: TimeNode;

  private callback?: Callback;
  private time: number;
  private repeat: boolean;
  private canceled = false;
  private paused = false;

  private initialTime: number;

  private name?: string;

  constructor(
    time: number,
    repeat: boolean,
    callback?: Callback,
    name?: string
  ) {
    this.callback = callback;
    this.time = time;
    this.repeat = repeat;

    this.initialTime = time;

    this.name = name;
  }

  update(rate: number): TimeNode | undefined {
    // console.log(`Name: ${this.name}:`);
    // console.log(`Canceled: ${this.canceled}`);
    // console.log(`Paused: ${this.paused}`);
    // console.log(`Time: ${this.time}`);

    if (this.next) this.next = this.next.update(rate);

    var detach = false || this.canceled;

    if (!this.paused) this.time -= rate;

    if (this.time <= 0 && !detach) {
      if (this.callback) this.callback();

      if (this.repeat) this.time = this.initialTime;
      else detach = true;
    }

    if (detach) return this.next;
    return this;
  }

  chain(node: TimeNode): TimeNodeControl {
    if (this.next) return this.next.chain(node);

    this.next = node;

    return {
      cancel: () => (node.canceled = true),
      pause: () => (node.paused = true),
      resume: () => (node.paused = false),
    };

    // console.log(`${node.name} chained to ${this.name}`);
  }

  getName(): string | undefined {
    return this.name;
  }

  getNext(): TimeNode | undefined {
    return this.next;
  }
}
