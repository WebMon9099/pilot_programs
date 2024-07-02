import { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUsersResults, insertResult } from "../../api";
import { ScorePie } from "../../components/core";
import { GlobalNavbar } from "../../components/global";
import { ACTIVITIES } from "../../constants";
import { useLoadingScreen } from "../../hooks";
import { appendClass, getDatePreview, getTime } from "../../lib";
import { ACTIVITY_SET_STARTED_PROPERLY } from "../../state/actions";
import { RootDispatch, RootState } from "../../store";
import { ActivityActions, ActivityState, Median, Result } from "../../types";

interface CompletePageProps extends React.HTMLAttributes<HTMLDivElement> {
  activityState: ActivityState;
  activityActions: Partial<ActivityActions>;
  performanceUrl: string;
  helpHyperlink: string;
}

const _CompletePage: React.FC<CompletePageProps> = ({
  activityState,
  activityActions,
  performanceUrl,
  helpHyperlink,
}) => {
  const location = useLocation();

  const navigate = useNavigate();

  const [weakPass, setWeakPass] = useState<number | null>(null);
  const [strongPass, setStrongPass] = useState<number | null>(null);
  const [pastResults, setPastResults] = useState<Result[]>([]);
  const [usersResultsLoading, setUsersResultsLoading] = useState(true);

  const activityObject = useMemo(() => {
    const activityName = location.pathname.substring(
      1,
      location.pathname.length - 9
    );

    return ACTIVITIES[activityName];
  }, [location.pathname]);

  useEffect(() => {
    const score = Math.floor(
      (activityState.score / activityState.maxScore) * 100
    );

    getUsersResults()
      .then((res) => {
        setWeakPass(res.weak_pass);
        setStrongPass(res.strong_pass);
        setPastResults(res.past_results);
      })
      .finally(() => {
        setUsersResultsLoading(false);

        activityActions.activitySetStartedProperly?.(false);
      });

    if (
      activityState.startedProperly &&
      activityState.finished &&
      activityState.maxScore > 0
    ) {
      insertResult({
        score,
        duration: location.state.duration,
        mode: activityState.trainingMode ? "training" : "normal",
      });
    }
  }, [
    activityActions,
    activityState.finished,
    activityState.startedProperly,
    activityState.trainingMode,
    activityState.score,
    activityState.maxScore,
    location.state.score,
    location.state.duration,
  ]);

  useLoadingScreen(usersResultsLoading);

  const median: Median = (() => {
    const score = Math.floor(
      (activityState.score / activityState.maxScore) * 100
    );

    if (!weakPass || !strongPass) return "above";
    else if (score < weakPass) return "below";
    else if (score >= strongPass) return "above";
    return "average";
  })();

  return (
    <div className="flex h-full flex-1 flex-col">
      <GlobalNavbar
        className="w-full"
        goBack={() => navigate(`/${activityObject.path}`)}
        activityObject={activityObject}
      />
      <div className="flex flex-1 flex-col items-center overflow-y-auto bg-[#f3f3f3] pb-[6vh]">
        <p className="montserrat my-[6vh] text-center text-[27px] font-semibold text-[#919191]">
          You have completed{" "}
          <span className="text-[#474747]">{activityObject.name}</span>
        </p>
        <div className="flex w-full max-w-[896px] flex-col">
          <div className="mb-[32px] flex max-h-[386px] w-full xl:max-h-[442px]">
            <div
              className="relative flex flex-1 flex-col rounded-l-[3px] border border-[#d8d8d8] bg-white"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 5px 0px 7px 0px",
              }}
            >
              <div className="border-b border-[#ddd] px-[24px] py-[16px] text-[18px] font-semibold text-[#555]">
                Your Score
              </div>
              <div className="flex flex-1 items-center justify-center py-[32px]">
                <ScorePie
                  className="h-[250px] w-[250px]"
                  score={Math.floor(
                    (activityState.score / activityState.maxScore) * 100
                  )}
                  median={median}
                  fontSize={86}
                />
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="rounded-tr-[3px] border-b border-r border-t border-[#ddd] bg-white px-[24px] py-[16px] text-[18px] font-semibold text-[#9b9b9b]">
                Last 5 Attempts
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto border-r border-[#ddd] px-[16px] py-[8px] scrollbar-thin scrollbar-thumb-[#e0e0e0] scrollbar-thumb-rounded-full">
                {pastResults.map((result, i) => (
                  <ResultCard
                    className={
                      i < pastResults.length - 1 ? "mb-[24px]" : undefined
                    }
                    result={result}
                    weak_pass={weakPass}
                    strong_pass={strongPass}
                    key={result.id}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center rounded-br-[3px] border-b border-r border-t border-[#dddddd] bg-[#eaeaea] px-[24px] py-[8px] text-[13px] font-semibold text-[#99999d]">
                <img
                  className="mr-[12px] h-[16px] w-[16px]"
                  src={require("./images/performance_grey.svg").default}
                  alt="performance"
                />
                <p className="whitespace-nowrap">
                  Go to <i>Performance</i> to see additional data
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-[24px]">
            <button
              className="flex flex-1 justify-center rounded-[5px] border border-[#34424c] bg-[#34424c] py-[12px] shadow-[0_1px_2px_#eaeaea] transition hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
              onClick={() => {
                // navigate(`/${activityObject.path}/run?${finalQuery}`, {
                //   state: { trainingMode: false },
                // });
                navigate(`/${activityObject.path}/run${location.search}`, {
                  state: { trainingMode: false },
                });
              }}
            >
              <img
                alt="restart"
                className="h-[40px] w-[40px] drop-shadow-sm"
                src={require("./images/icon_restart.svg").default}
              />
            </button>
            <button
              className="flex flex-1 justify-center rounded-[5px] border border-theme-green bg-theme-green py-[12px] shadow-[0_1px_2px_#eaeaea] transition hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
              onClick={() => {
                // navigate(`/${activityObject.path}/run?${finalQuery}`, {
                //   state: { trainingMode: false },
                // });
                navigate(`/${activityObject.path}/run${location.search}`, {
                  state: { trainingMode: true },
                });
              }}
            >
              <img
                alt="restart"
                className="h-[40px] w-[40px] drop-shadow-sm"
                src={require("./images/icon_mortarboard.svg").default}
              />
            </button>
            <button
              className="border-theme-border flex flex-1 items-center justify-center rounded-[5px] border bg-white py-[12px] shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
              onClick={() => navigate(`/${activityObject.path}/settings`)}
            >
              <img
                alt="help"
                className="h-[32px] w-[32px] drop-shadow-sm"
                src={require("./images/icon_settings.svg").default}
              />
            </button>
            <button
              className="border-theme-border flex flex-1 items-center justify-center rounded-[5px] border bg-white py-[12px] shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
              onClick={() => window.open(helpHyperlink)}
            >
              <img
                alt="help"
                className="h-[32px] w-[32px] drop-shadow-sm"
                src={require("./images/icon_help.svg").default}
              />
            </button>
            <button
              className="border-theme-border flex flex-1 items-center justify-center rounded-[5px] border bg-white py-[12px] shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
              onClick={() => window.open(performanceUrl)}
            >
              <img
                alt="help"
                className="h-[32px] w-[32px] drop-shadow-sm"
                src={require("./images/icon_performance.svg").default}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ activityState }: RootState) => ({ activityState });

const mapDispatchToProps = (
  dispatch: RootDispatch
): { activityActions: Partial<ActivityActions> } => {
  return {
    activityActions: {
      activitySetStartedProperly: (properly) =>
        dispatch(ACTIVITY_SET_STARTED_PROPERLY(properly)),
    },
  };
};

const CompletePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(_CompletePage);

export default CompletePage;

interface ResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  result: Result;
  weak_pass: number | null;
  strong_pass: number | null;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  weak_pass,
  strong_pass,
  ...rest
}) => {
  const median: Median = (() => {
    if (!weak_pass || !strong_pass) return "above";
    else if (result.score < weak_pass) return "below";
    else if (result.score >= strong_pass) return "above";
    return "average";
  })();

  return (
    <div
      {...rest}
      className={appendClass(
        "relative flex items-center justify-between rounded-[3px] border border-[#e9e9e9] bg-white px-[16px] py-[4px] shadow-sm",
        rest.className
      )}
    >
      <div className="flex flex-col justify-between gap-[4px] text-[14px]">
        <p className="text-left font-semibold text-[#686868]">
          {getDatePreview(result.start_time)}
        </p>
        <div className="flex items-end gap-[12px]">
          <p className="font-semibold text-[#b7b7b7]">
            {getTime(result.start_time)} to {getTime(result.end_time)}
          </p>
          {result.mode === "training" && (
            <div className="flex items-center gap-[4px]">
              <img
                className="h-[12px] w-[12px]"
                src={require("./images/icon_mortarboard_enable.svg").default}
                alt="mortarboard"
              />
              <span className="whitespace-nowrap text-[10px] font-semibold text-theme-green">
                Training Mode
              </span>
            </div>
          )}
        </div>
      </div>
      <ScorePie
        className="h-[55px] w-[55px]"
        median={median}
        score={result.score}
        fontSize={16}
        innerRadius="85%"
        showPlane={false}
        precentage={false}
      />
      {result.mode === "training" && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[3px] bg-theme-green" />
      )}
    </div>
  );
};

// const DUMMY_RESULTS: Result[] = [
//   {
//     id: '0',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
//   {
//     id: '1',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'training',
//   },
//   {
//     id: '2',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
//   {
//     id: '3',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
//   {
//     id: '4',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
// ];
