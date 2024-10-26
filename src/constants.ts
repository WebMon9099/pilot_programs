import {
  AlignActivity,
  SonicActivity,
  CalculateActivity,
  CharactersActivity,
  ControlActivity,
  DialsActivity,
  DirectionActivity,
  DotsActivity,
  FlashcardsActivity,
  FMSActivity,
  InstrumentsActivity,
  LogicActivity,
  MatrixActivity,
  NumbersActivity,
  ReactActivity,
  SenseOfDirectionActivity,
  SlalomActivity,
  SpinActivity,
  TrackingActivity,
  TrianglesActivity,
  VisualMemoryActivity,
} from './components/run-page-components/activities';
import { ActivityObject, ActivityState } from './types';

export const TARGET_FRAME_RATE = 50;

export const SESSION_START_COUNTDOWN_TIME = 3;

export const ACTIVITY_SPEEDS = [0.5, 1, 2, 4];

export const MIN_ACTIVITY_SPEED = ACTIVITY_SPEEDS[0];

export const MAX_ACTIVITY_SPEED = ACTIVITY_SPEEDS[ACTIVITY_SPEEDS.length - 1];

export const EVENT_KEYS = {
  spaceBar: ' ',
  enter: 'Enter',
  backspace: 'Backspace',
  delete: 'Delete',
  arrowUp: 'ArrowUp',
  arrowRight: 'ArrowRight',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  digit0: '0',
  digit1: '1',
  digit2: '2',
  digit3: '3',
  digit4: '4',
  digit5: '5',
  digit6: '6',
  digit7: '7',
  digit8: '8',
  digit9: '9',
};

export const INITIAL_ACTIVITY_STATE = (): ActivityState => {
  return {
    clock: {
      start: -1,
      sessionStart: -1,
      stoppedAt: -1,
    },
    speed: 1,
    score: 0,
    maxScore: 0,
    paused: true,
    freezed: false,
    session: 1,
    sessionsScore: [],
    trainingMode: false,
    submitted: false,
    finished: false,
    stage: {
      name: 'Root',
      time: Infinity,
    },
    startedProperly: false,
  };
};

export const ACTIVITIES: { [key: string]: ActivityObject } = {
  react: {
    path: 'react',
    name: 'React',
    component: ReactActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 0,
    ignoreSessions: true,
    hasSpeed: true,
    gear: {},
    settings: false,
  },
  dots: {
    path: 'dots',
    name: 'Dots',
    component: DotsActivity,
    sessions: 20,
    sessionLength: 15,
    showAnswerTime: 10,
    ignoreSessions: true,
    hasSpeed: true,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  flashcards: {
    path: 'flashcards',
    name: 'Flashcards',
    component: FlashcardsActivity,
    sessions: 20,
    sessionLength: 15,
    showAnswerTime: 5,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  matrix: {
    path: 'matrix',
    name: 'Matrix',
    component: MatrixActivity,
    sessions: 12,
    sessionLength: 30,
    showAnswerTime: 5,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  logic: {
    path: 'logic',
    name: 'Logic',
    component: LogicActivity,
    sessions: 12,
    sessionLength: 45,
    showAnswerTime: 15,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  direction: {
    path: 'direction',
    name: 'Direction',
    component: DirectionActivity,
    sessions: 20,
    sessionLength: 15,
    showAnswerTime: 15,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  calculate: {
    path: 'calculate',
    name: 'Calculate',
    component: CalculateActivity,
    sessions: 20,
    sessionLength: 15,
    showAnswerTime: 10,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  instruments: {
    path: 'instruments',
    name: 'Instruments',
    component: InstrumentsActivity,
    sessions: 1,
    sessionLength: 360,
    showAnswerTime: 0,
    ignoreSessions: true,
    hasSpeed: true,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  numbers: {
    path: 'numbers',
    name: 'Numbers',
    component: NumbersActivity,
    sessions: 20,
    sessionLength: 15,
    showAnswerTime: 5,
    ignoreSessions: true,
    hasSpeed: false,
    queries: { type: { name: 'Type', options: ['Normal', 'Reverse'] } },
    gear: {
      mouse: true,
      headphones: true,
    },
    settings: false,
  },
  'visual-memory': {
    path: 'visual-memory',
    name: 'Visual Memory',
    component: VisualMemoryActivity,
    sessions: 12,
    sessionLength: 25,
    showAnswerTime: 3,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  characters: {
    path: 'characters',
    name: 'Characters',
    component: CharactersActivity,
    sessions: 1,
    sessionLength: 180,
    showAnswerTime: 0,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  dials: {
    path: 'dials',
    name: 'Dials',
    component: DialsActivity,
    sessions: 12,
    sessionLength: 45,
    showAnswerTime: 10,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  triangles: {
    path: 'triangles',
    name: 'Triangles',
    component: TrianglesActivity,
    sessions: 12,
    sessionLength: 30,
    showAnswerTime: 5,
    hasSpeed: false,
    gear: {
      mouse: true,
    },
    settings: false,
  },
  control: {
    path: 'control',
    name: 'Control',
    component: ControlActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 0,
    ignoreSessions: true,
    hasSpeed: false,
    queries: { type: { name: 'Type', options: ['Linear', 'Circular'] } },
    gear: {
      mouse: true,
    },
    settings: false,
  },
  align: {
    path: 'align',
    name: 'Align',
    component: AlignActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 0,
    hasSpeed: true,
    ignoreSessions: true,
    queries: {
      type: { name: 'Type', options: ['Horizontal', 'Vertical'] },
    },
    gear: {
      mouse: true,
      headphones: true,
    },
    settings: false,
  },
  sonic: {
    path: 'sonic',
    name: 'Sonic',
    component: SonicActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 0,
    hasSpeed: true,
    ignoreSessions: true,
    gear: {
      mouse: true,
      headphones: true,
    },
    settings: false,
  },
  spin: {
    path: 'spin',
    name: 'Spin',
    component: SpinActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 0,
    hasSpeed: true,
    ignoreSessions: true,
    gear: {
      mouse: true,
      joystick: true,
    },
    settings: true,
  },
  tracking: {
    path: 'tracking',
    name: 'Tracking',
    component: TrackingActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 0,
    hasSpeed: true,
    ignoreSessions: true,
    queries: {
      'tracking-type': {
        name: 'Tracking Type',
        options: ['Pursuit', 'Compensatory', 'Dual Compensatory'],
      },
      'activity-type': {
        name: 'Activity Type',
        options: ['Tracking Only', 'with Shapes', 'with Calculations'],
      },
    },
    gear: {
      mouse: true,
      joystick: {
        onScreenJoystick: true,
        onScreenSlider: false,
      },
      headphones: true,
    },
    controlsColor: '#D8D8D8',
    settings: true,
    customNavbarData: {
      accuracy: {
        label: 'Accuracy',
        mobileLabel: 'A',
      },
    },
  },
  fms: {
    path: 'fms',
    name: 'FMS',
    component: FMSActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 5,
    ignoreSessions: true,
    hasSpeed: false,
    gear: {
      mouse: true,
      joystick: false,
      headphones: true,
    },
    settings: false,
    customNavbarData: {
      chunks: {
        label: 'Chunks',
        mobileLabel: 'C',
      },
    },
  },
  'sense-of-direction': {
    path: 'sense-of-direction',
    name: 'Sense of Direction',
    component: SenseOfDirectionActivity,
    sessions: 10,
    sessionLength: 60,
    showAnswerTime: 0,
    hasSpeed: false,
    gear: {
      mouse: true,
      joystick: false,
      headphones: false,
    },
    settings: false,
  },
  slalom: {
    path: 'slalom',
    name: 'Slalom',
    component: SlalomActivity,
    sessions: 1,
    sessionLength: 300,
    showAnswerTime: 0,
    ignoreSessions: true,
    hasSpeed: false,
    queries: {
      type: {
        name: 'Type',
        options: ['Fixed', 'Dynamic'],
      },
    },
    gear: {
      mouse: true,
      joystick: {
        onScreenJoystick: {
          vertical: false,
          horizontal: true,
        },
        onScreenSlider: true,
      },
      headphones: false,
    },
    controlsColor: '#D8D8D8',
    settings: true,
  },
};

export const COLORS = {
  blue: '#00acdd',
  green: '#7edb4d',
  orange: '#e4b963',
  red: '#e50b05',
  white: '#fff',
  disabled: '#e2e2e2',
};
