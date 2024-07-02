import { useRef } from 'react';
import { appendClass } from '../../../../lib';

interface TabButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  activatedTabIndex: number;
  setActivatedTabIndex: (index: number) => void;
  tabs: string[];
}

const TabButtons: React.FC<TabButtonsProps> = ({
  activatedTabIndex,
  setActivatedTabIndex,
  tabs,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...rest}
      className={appendClass('tab-buttons flex gap-[8px]', rest.className)}
      ref={containerRef}
    >
      {tabs.map((tabName, index) => (
        <button
          className={`relative top-[1px] rounded-t-[3px] border border-b-0 border-[#ddd] bg-[#efefef] px-[20px] py-[10px] text-[14px] font-semibold text-[#8e8e8e] ${
            activatedTabIndex === index &&
            'activated !z-10 border-t-[3px] border-t-[#0d94c5] !bg-white !text-[#6b6b6b]'
          }`}
          key={index}
          onClick={() => setActivatedTabIndex(index)}
        >
          {tabName}
        </button>
      ))}
      {/* <div className="tab-buttons-slider">
        <RadioSlider
          activatedElementIndex={activatedTabIndex}
          getElements={() => containerRef.current?.querySelectorAll("button")}
          spacing={20}
        />
      </div> */}
    </div>
  );
};

export default TabButtons;
