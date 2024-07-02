import { ReactComponent as Logo } from './images/svgs/login_logo_small.svg';
import Spinner from './Spinner';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="content">
        <Logo />
        <Spinner />
      </div>
    </div>
  );
};

export default LoadingScreen;
