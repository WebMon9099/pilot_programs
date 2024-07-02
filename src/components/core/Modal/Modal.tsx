import { appendClass } from '../../../lib';
import { Callback } from '../../../types';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onDismiss?: Callback;
  show: boolean;
}

const Modal: React.FC<ModalProps> = ({ onDismiss, show, ...rest }) => {
  return (
    <div
      {...rest}
      className={appendClass('modal', rest.className)}
      style={{
        ...(show
          ? { opacity: 1, pointerEvents: 'auto', zIndex: 1000 }
          : { opacity: 0, pointerEvents: 'none', zIndex: -1 }),
        ...rest.style,
      }}
      onClick={(e) => {
        rest.onClick?.(e);

        onDismiss?.();
      }}
    >
      <div className="content" onClick={(e) => e.stopPropagation()}>
        {rest.children}
      </div>
    </div>
  );
};

export default Modal;
