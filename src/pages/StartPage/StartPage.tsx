import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { GlobalNavbar } from "../../components/global";
import {
  ActivityMenu,
  ActivityQueryResolver,
} from "../../components/start-page-components";
import { ACTIVITIES } from "../../constants";
import { RootState } from "../../store";
import { ActivityState } from "../../types";

interface StartPageLocation {
  pathname: string;
  state: { activityCompleted: boolean };
}

interface StartPageProps extends React.HTMLAttributes<HTMLDivElement> {
  activityState: ActivityState;
  performanceUrl: string;
  helpHyperlink: string;
}

const _StartPage: React.FC<StartPageProps> = ({
  activityState,
  performanceUrl,
  helpHyperlink,
}) => {
  const location = useLocation() as StartPageLocation;

  const [activityTrainingMode, startActivityWithTrainingModeOf] = useState<
    boolean | null
  >(null);

  //  The appropriate activity object:
  const activityObject = useMemo(() => {
    const activityName = location.pathname.split("/").join("");

    const object = _.cloneDeep(ACTIVITIES[activityName]);

    return object;
  }, [location.pathname]);

  useEffect(() => {
    //  Change the page title to reflect the current activity name:
    document.title = activityObject.name;
  }, [activityObject.name]);

  if (activityObject)
    return (
      <div className="page start-page">
        <GlobalNavbar
          activityObject={activityObject}
          goBack={() => window.close()}
          className="mb-[8vh] w-full"
        />
        {activityTrainingMode === null ? (
          <ActivityMenu
            activityState={activityState}
            activityObject={activityObject}
            startActivityWithTrainingModeOf={startActivityWithTrainingModeOf}
            performanceUrl={performanceUrl}
            helpHyperlink={helpHyperlink}
          />
        ) : (
          <div className="activity-type-selector-container">
            <ActivityQueryResolver
              activityObject={activityObject}
              trainingMode={activityTrainingMode}
            />
          </div>
        )}
        <div className="bottom-info">
          <img
            className="logo w-96"
            src={require("./images/svgs/logo.svg").default}
            alt="Greyscale logo"
          />
          {/* <div className="right-side">
            <span className="montserrat">Equipment Required:</span>
            <div>
              <img
                src={require(`./images/svgs/icon_audio${
                  activityObject.gear.headphones ? '_req' : ''
                }.svg`)}
                alt="Audio icon"
              />
              <img
                src={require(`./images/svgs/icon_mousekeyboard${
                  activityObject.gear.mouse ? '_req' : ''
                }.svg`)}
                alt="Mouse and keyboard icon"
              />
              <img
                src={require(`./images/svgs/icon_joystick${
                  activityObject.gear.joystick ? '_req' : ''
                }.svg`)}
                alt="Joystick icon"
              />
            </div>
            <span className="montserrat">v1.0</span>
          </div> */}
        </div>
      </div>
    );

  return null;
};

const mapStateToProps = ({ activityState }: RootState) => ({ activityState });

const StartPage = connect(mapStateToProps)(_StartPage);

export default StartPage;
