import { appendClass } from '../../../lib';
import { ActivityObject } from '../../../types';

interface GlobalNavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  activityObject: ActivityObject;
  goBack: () => void;
}

const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  activityObject,
  goBack,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={appendClass(
        'item sticky left-0 right-0 top-0 z-20 flex select-none items-center justify-between bg-[#3793d1] font-inter text-white',
        rest.className
      )}
    >
      <div className="flex items-center">
        <div className="p-4">
          <img
            className="h-[36px] w-[36px]"
            src={require('./images/logo_roundel.svg').default}
            alt="Menu Icon"
          />
        </div>
        <span className="text-[20px]">{activityObject.name}</span>
      </div>
      <button
        className="h-full shrink-0 bg-[#1b8ac0] px-5 hover:brightness-95"
        onClick={goBack}
      >
        <img
          src={require('./images/icon_exit_white.svg').default}
          className="w-[28px] shrink-0"
          alt="Menu Icon"
        />
      </button>
    </div>
  );
};

export default GlobalNavbar;
