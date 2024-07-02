import { lazy, Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import { checkAuth, getActivityInfo } from "../api";
import { ControlsProvider } from "../context";
import { CONTROLS_CONTEXT_INITIAL_STATE } from "../context/ControlsContext/constants";
import { useLoadingScreen } from "../hooks";
import { CompletePage, ComptErrorPage, RouteErrorPage } from "../pages";
import { store } from "../store";
import { LoadingScreen } from "./global";

const StartPage = lazy(() => import("../pages/StartPage"));
const RunPage = lazy(() => import("../pages/RunPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

const App: React.FC = () => {
  const [authed, setAuthed] = useState<boolean | undefined>();
  const [notCompt, setNotCompt] = useState(false);
  const [activityInfo, setActivityInfo] = useState<
    { id: string; name: string; help_hyperlink: string } | undefined
  >();
  const [activityInfoLoading, setActivityInfoLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
    getActivityInfo()
      .then(setActivityInfo)
      .finally(() => setActivityInfoLoading(false));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", checkCompt);

    checkCompt();

    return () => window.removeEventListener("resize", checkCompt);

    function checkCompt() {
      if (window.innerWidth < 960 || window.innerHeight < 600)
        setNotCompt(true);
      else setNotCompt(false);
    }
  }, []);

  useLoadingScreen(authed === undefined || activityInfoLoading);

  const performanceUrl = `${process.env.REACT_APP_PERFORMANCE_URL}?filter-key=activity-${activityInfo?.id}-${activityInfo?.name}`;

  if (authed === undefined) return null;

  if (authed) {
    return (
      <Provider store={store}>
        <ControlsProvider value={CONTROLS_CONTEXT_INITIAL_STATE}>
          <div className="app relative" style={{ height: "100%" }}>
            {notCompt && <ComptErrorPage />}
            <Suspense fallback={<LoadingScreen />}>
              <HashRouter>
                <Routes>
                  <Route
                    path={"/:activity"}
                    element={
                      <StartPage
                        performanceUrl={performanceUrl}
                        helpHyperlink={activityInfo?.help_hyperlink || ""}
                      />
                    }
                  />
                  <Route
                    path={"/:activity/run"}
                    element={
                      <RunPage
                        helpHyperlink={activityInfo?.help_hyperlink || ""}
                      />
                    }
                  />
                  <Route
                    path={"/:activity/settings"}
                    element={<SettingsPage />}
                  />
                  <Route
                    path={"/:activity/complete"}
                    element={
                      <CompletePage
                        performanceUrl={performanceUrl}
                        helpHyperlink={activityInfo?.help_hyperlink || ""}
                      />
                    }
                  />
                </Routes>
              </HashRouter>
            </Suspense>
          </div>
        </ControlsProvider>
      </Provider>
    );
  }

  return <RouteErrorPage />;
};

export default App;
