import { appendClass } from '../lib';

const ComptErrorPage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  return (
    <main
      {...rest}
      className={appendClass(
        'flex h-full w-full flex-col items-center justify-center gap-[64px] px-[16px] py-[24px] text-center font-inter text-theme-medium-gray',
        rest.className
      )}
    >
      <p className="text-[30px] font-semibold">
        Incompatible Screen Size or Orientation
      </p>
      <p>
        This activity requires a minimum screen size of 1024px by 768px, and if
        used on a touchscreen device, must be used in Landscape orientation.
      </p>
      <button className="rounded-full bg-theme-medium-gray px-[24px] py-[8px] text-[14px] font-semibold text-white transition duration-75 hover:scale-105 hover:shadow-md active:scale-95 active:brightness-95">
        Learn more about Compatibility
      </button>
    </main>
  );
};

export default ComptErrorPage;
