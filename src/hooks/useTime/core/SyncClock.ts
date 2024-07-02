import { Callback } from '../../../types';
import { TimeNode, TimeNodeControl } from './TimeNode';

export class SyncClock {
  private root: TimeNode;

  constructor(rate = 1000) {
    this.root = new TimeNode(rate, true, undefined, 'RootNode');

    setInterval(() => {
      // this.printTree();
      this.root.update(rate);
    }, rate);
  }

  setTimeout(callback: Callback, time: number, name?: string): TimeNodeControl {
    return this.root.chain(new TimeNode(time, false, callback, name));
  }

  setInterval(
    callback: Callback,
    time: number,
    name?: string
  ): TimeNodeControl {
    return this.root.chain(new TimeNode(time, true, callback, name));
  }

  printTree() {
    var head: TimeNode | undefined = this.root;

    var str = '';
    while (head) {
      str += `${head.getName()}---->`;
      head = head.getNext();
    }

    str += 'END';

    console.log(str);
  }
}

const clock = new SyncClock(1000 / 50);
export default clock;
