import { useNavigate } from 'react-router-dom';
import { appendClass } from '../../../../lib';
import { Modal, ModalProps, PushButton } from '../../../core';

interface ExitModalProps extends ModalProps {
  exitPath: string;
}

const ExitModal: React.FC<ExitModalProps> = ({ exitPath, ...rest }) => {
  const navigate = useNavigate();

  return (
    <Modal {...rest} className={appendClass('exit-modal', rest.className)}>
      <img
        className="icon"
        src={require('./images/svgs/icon_exit.svg').default}
        style={{ maxWidth: 37.5, height: 37.5 }}
        alt="Icon"
      />
      <p className="title">Are you sure you want to exit?</p>
      <p className="description">
        Exiting now will end the current session and your data from this session
        will not be saved.
      </p>
      <div className="buttons font-inter">
        <PushButton className="primary" onClick={rest.onDismiss}>
          Cancel
        </PushButton>
        <PushButton className="secondary" onClick={() => navigate(exitPath)}>
          Exit to Menu
        </PushButton>
      </div>
    </Modal>
  );
};

export default ExitModal;
