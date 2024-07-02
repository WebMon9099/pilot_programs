import { useNavigate } from "react-router-dom";
import { useSound, useSpeech } from "../../../hooks";
import { appendClass } from "../../../lib";
import { ActivityObject, ActivityState, SetState } from "../../../types";

interface ActivityMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  activityState: ActivityState;
  activityObject: ActivityObject;
  startActivityWithTrainingModeOf: SetState<boolean | null>;
  performanceUrl: string;
  helpHyperlink: string;
}

const ActivityMenu: React.FC<ActivityMenuProps> = ({
  activityState,
  activityObject,
  startActivityWithTrainingModeOf,
  performanceUrl,
  helpHyperlink,
  ...rest
}) => {
  const { sound } = useSound();
  const { msg } = useSpeech();

  const navigate = useNavigate();

  return (
    <div
      {...rest}
      className={appendClass(
        "activity-menu max-w-[1280px] px-[16px] md:px-[24px] lg:px-[56px] xl:px-[64px] 2xl:px-[96px]",
        rest.className
      )}
    >
      <h1 className="text-center font-semibold text-[#474747] md:pb-[8vh] md:text-[45px]">
        {activityObject.name}
      </h1>

      <div
        className={appendClass(
          "mt-[3vh] grid w-full grid-cols-2 gap-[2vh] md:grid-cols-5 md:justify-between md:gap-[1vw]",
          !activityObject.settings ? "md:!grid-cols-4" : ""
        )}
      >
        <button
          className="flex flex-1 flex-col items-center gap-[16px] rounded-md bg-theme-blue py-[32px] font-semibold text-white shadow-[0_1px_2px_#ddd] transition hover:bg-[#01a2d0] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
          onClick={() => startActivityWithTrainingModeOf(false)}
          onClickCapture={() => {
            sound.play();
            window.speechSynthesis.speak(msg);
          }}
        >
          <img
            className="h-[24px] drop-shadow-md md:h-[20px] lg:h-[24px] xl:h-[40px]"
            src={require("./images/svgs/icon_start.svg").default}
            alt="Start/Restart icon"
          />
          <p>Start Activity</p>
        </button>
        <button
          className="flex flex-1 flex-col items-center gap-[16px] rounded-md bg-theme-green py-[32px] font-semibold text-white shadow-[0_1px_2px_#ddd] transition hover:bg-[#7ad340] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
          onClick={() => startActivityWithTrainingModeOf(true)}
          onClickCapture={() => {
            sound.play();
            window.speechSynthesis.speak(msg);
          }}
        >
          <img
            className="h-[24px] drop-shadow-md md:h-[20px] lg:h-[24px] xl:h-[40px]"
            src={require("./images/svgs/icon_mortarboard.svg").default}
            alt="Mortarboard icon"
          />
          <p>Training Mode</p>
        </button>
        {activityObject.settings && (
          <button
            className="flex flex-1 flex-col items-center gap-[16px] rounded-md !border border-[#dfdfdf] bg-white py-[32px] font-semibold text-theme-extra-dark-gray shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
            onClick={() => navigate(`/${activityObject.path}/settings`)}
          >
            <img
              className="h-[24px] md:h-[20px] lg:h-[24px] xl:h-[40px]"
              src={require("./images/svgs/icon_settings.svg").default}
              alt="Performance icon"
            />
            <p>Settings</p>
          </button>
        )}
        <button
          className="flex flex-1 flex-col items-center gap-[16px] rounded-md !border border-[#dfdfdf] bg-white py-[32px] font-semibold text-theme-extra-dark-gray shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
          onClick={() => window.open(helpHyperlink)}
        >
          <img
            className="h-[24px] md:h-[20px] lg:h-[24px] xl:h-[40px]"
            src={require("./images/svgs/icon_help.svg").default}
            alt="Help icon"
          />
          <p>User Guide</p>
        </button>
        <button
          className="flex flex-1 flex-col items-center gap-[16px] rounded-md !border border-[#dfdfdf] bg-white py-[32px] font-semibold text-theme-extra-dark-gray shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
          onClick={() => window.open(performanceUrl)}
        >
          <img
            className="h-[24px] md:h-[20px] lg:h-[24px] xl:h-[40px]"
            src={require("./images/svgs/icon_performance.svg").default}
            alt="Performance icon"
          />
          <p>Performance</p>
        </button>
      </div>
    </div>
  );
};

export default ActivityMenu;
