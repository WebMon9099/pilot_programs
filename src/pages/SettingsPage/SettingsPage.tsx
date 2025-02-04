import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalNavbar, Settings } from "../../components/global";
import { ACTIVITIES } from "../../constants";

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activityObject = useMemo(() => {
    const activityName = location.pathname.substring(
      1,
      location.pathname.length - 9
    );

    return ACTIVITIES[activityName];
  }, [location.pathname]);

  return (
    <div className="page settings-page flex flex-col">
      <GlobalNavbar
        className="w-full"
        goBack={() => navigate(`/${activityObject.path}`)}
        activityObject={activityObject}
      />
      <Settings
        className="mx-[64px] my-[32px] flex-1"
        closeSettings={() => navigate(-1)}
        active_name={activityObject.name}
      />
    </div>
  );
};

export default SettingsPage;
