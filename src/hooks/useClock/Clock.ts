import { v4 as uuidv4 } from 'uuid';

interface ClockEvent {
  callback: (timePassed: number) => void;
  type: 'timeout' | 'interval';
  done: boolean;
  initialTime: number;
  time: number;
  timePassed: number;
  paused: boolean;
}

class Clock {
  private events: Map<string, ClockEvent> = new Map();

  constructor() {
    this.clockEventsLoop();
  }

  private clockEventsLoop() {
    var lastUpdate = Date.now();

    const loop = () => {
      const thisUpdate = Date.now();

      this.events.forEach((event) => {
        if (event.paused || event.done) return;

        event.time -= thisUpdate - lastUpdate;

        if (event.time <= 0) {
          event.timePassed += event.initialTime;

          event.callback(event.timePassed);
          event.time = event.initialTime;

          if (event.type === 'timeout') event.done = true;
        }
      });

      lastUpdate = thisUpdate;

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  public addInterval(callback: (timePassed: number) => void, time: number) {
    const newId = uuidv4();

    this.events.set(newId, {
      callback,
      type: 'interval',
      done: false,
      initialTime: time,
      time,
      timePassed: 0,
      paused: false,
    });

    return newId;
  }

  public addTimeout(callback: (timePassed: number) => void, time: number) {
    const newId = uuidv4();

    this.events.set(newId, {
      callback,
      type: 'timeout',
      done: false,
      initialTime: time,
      time,
      timePassed: 0,
      paused: false,
    });

    return newId;
  }

  public pause(id: string) {
    const event = this.events.get(id);

    if (event) event.paused = true;
  }

  public resume(id: string) {
    const event = this.events.get(id);

    if (event) event.paused = false;
  }

  public clear(id: string) {
    this.events.delete(id);
  }
}

export default Clock;
