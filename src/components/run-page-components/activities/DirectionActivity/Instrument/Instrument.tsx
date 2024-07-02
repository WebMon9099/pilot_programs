import { appendClass } from '../../../../../lib';

interface InstrumentProps extends React.HTMLAttributes<HTMLDivElement> {
  state: number;
  type: 'GYRO' | 'RBI';
}

const Instrument: React.FC<InstrumentProps> = ({ state, type, ...rest }) => {
  return (
    <div
      {...rest}
      className={appendClass('direction-instrument', rest.className)}
    >
      <img
        src={require('../images/svgs/dial_bg.svg').default}
        alt="dial_bg"
        style={{ width: '100%', height: '100%' }}
      />
      <img
        src={require('../images/svgs/direction_imgdial_front.svg').default}
        style={{
          ...(type === 'GYRO'
            ? {
                transform: `translate(-50%, -50%) rotate(${state}deg)`,
              }
            : null),
          ...{ height: '90%', width: '90%' },
        }}
        alt="direction_imgdial_front"
      />
      {type === 'GYRO' ? (
        <img
          src={
            require('../images/svgs/direction_imgaircraft_front.svg').default
          }
          style={{ width: '20%', height: 'calc(33%)' }}
          alt="direction_imgaircraft_front"
        />
      ) : (
        <img
          src={require('../images/svgs/direction_imgrbi_needle.svg').default}
          style={{
            ...(type === 'RBI'
              ? {
                  transform: `translate(-50%, -50%) rotate(${state}deg)`,
                }
              : null),
            ...{ width: '10%', height: '35%' },
          }}
          alt="direction_imgrbi_needle"
        />
      )}
    </div>
  );
};

export default Instrument;
