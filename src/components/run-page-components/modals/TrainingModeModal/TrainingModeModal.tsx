import { useNavigate } from 'react-router-dom';
import { appendClass } from '../../../../lib';
import { Modal, ModalProps, PushButton } from '../../../core';

interface TrainingModeModalProps extends ModalProps {
  exitPath: string;
  trainingMode: boolean;
}

const TrainingModeModal: React.FC<TrainingModeModalProps> = ({
  exitPath,
  trainingMode,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      {...rest}
      className={appendClass('training-mode-modal', rest.className)}
    >
      <img
        className="icon"
        src={require(`./images/svgs/${
          trainingMode
            ? 'icon_mortarboard_disable.svg'
            : 'icon_mortarboard_enable.svg'
        }`)}
        style={{ minWidth: 37.5, height: 37.5 }}
        alt="Icon"
      />
      <p className="title">
        Are you sure you want to {trainingMode ? ' disable ' : ' enable '}
        training mode?
      </p>
      <p className="mv-40 description">
        Exiting now will end the current session and your data from this session
        will not be saved.
      </p>
      <div className="pv-40 buttons font-inter">
        <PushButton className="primary p-20" onClick={rest.onDismiss}>
          <span>Cancel</span>
        </PushButton>
        <PushButton
          className="secondary p-20"
          onClick={() => {
            rest.onDismiss?.();

            navigate(exitPath, {
              state: { trainingMode: !trainingMode },
            });
          }}
        >
          <span>{trainingMode ? ' Disable ' : ' Enable '} Training Mode</span>
        </PushButton>
      </div>
    </Modal>
  );
};

export default TrainingModeModal;
