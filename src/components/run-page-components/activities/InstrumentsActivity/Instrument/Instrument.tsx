import { useEffect, useMemo, useState } from 'react';
import { COLORS } from '../../../../../constants';
import { appendClass } from '../../../../../lib';

interface InstrumentProps extends React.HTMLAttributes<HTMLDivElement> {
  activated: boolean;
  neededState: number;
  state: number;
  type: 'AIRSPEED' | 'ALTIMETER' | 'HEADING';
}

const Instrument: React.FC<InstrumentProps> = ({
  activated,
  neededState,
  state,
  type,
  ...rest
}) => {
  const [useTransition, setUseTransition] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setUseTransition(false), 600);

    return () => {
      clearTimeout(timeout);

      setUseTransition(true);
    };
  }, [neededState]);

  const rotation = useMemo(() => {
    switch (type) {
      case 'AIRSPEED':
        return ((state - 30) / 157) * 360 + 180;
      case 'ALTIMETER':
        return (state / 10000) * 360 + 180;
      case 'HEADING':
        return -state;
      default:
        return 0;
    }
  }, [type, state]);

  const bugRotation = useMemo(() => {
    switch (type) {
      case 'AIRSPEED':
        return (
          ((neededState - 30 + (neededState > 129 ? 0.5 : -0.5)) / 156) * 360
        );
      case 'ALTIMETER':
        return (neededState / 10000) * 360;
      case 'HEADING':
        return -(state - neededState);
    }
  }, [type, neededState, state]);

  const instrumentJSX = () => {
    if (!activated) {
      return (
        <>
          <img
            src={require('../images/svgs/dial_bg.svg').default}
            alt="dial_bg"
          />
          <img
            src={require('../images/svgs/no_entry_sign.svg').default}
            style={{ width: '30%', height: '30%' }}
            alt="no_entry_sign"
          />
        </>
      );
    }
    if (type === 'AIRSPEED') {
      return (
        <>
          <img
            src={require('../images/svgs/airspeed_bg.svg').default}
            alt="airspeed_bg"
          />
          <img
            src={require('../images/svgs/pointer.svg').default}
            style={{
              height: '25%',
              top: '63%',
              transformOrigin: '50% 5px',
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
            alt="pointer"
          />
        </>
      );
    } else if (type === 'ALTIMETER') {
      return (
        <>
          <img
            src={require('../images/svgs/altimeter_bg.svg').default}
            alt="altimeter_bg"
          />
          <img
            src={require('../images/svgs/pointer.svg').default}
            style={{
              height: '25%',
              top: '63%',
              transformOrigin: '50% 5px',
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
            alt="pointer"
          />
          <p
            style={{
              top: '32.5%',
              color: COLORS.white,
              letterSpacing: '.4rem',
              textAlign: 'center',
              marginLeft: '.2rem',
            }}
          >
            {state}
          </p>
        </>
      );
    } else if (type === 'HEADING') {
      return (
        <>
          <img
            src={require('../images/svgs/dial_bg.svg').default}
            alt="dial_bg"
          />
          <img
            src={require('../images/svgs/heading_bg.svg').default}
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              width: '92%',
              height: '92%',
            }}
            alt="heading_bg"
          />
          <img
            src={
              require('../images/svgs/heading_indicator_pointer.svg').default
            }
            style={{ height: '50%' }}
            alt="heading_indicator_pointer"
          />
        </>
      );
    }
  };

  return (
    <div {...rest} className={appendClass('instrument', rest.className)}>
      {instrumentJSX()}
      {activated ? (
        <div
          className={`${useTransition ? 'transition' : ''} bug`}
          style={{
            transform: `translate(-50%, -50%) rotate(${bugRotation}deg)`,
          }}
        >
          <img src={require('../images/svgs/bug.svg').default} alt="bug" />
        </div>
      ) : null}
    </div>
  );
};

export default Instrument;
