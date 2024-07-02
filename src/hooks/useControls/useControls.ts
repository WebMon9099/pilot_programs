import { useContext } from 'react';
import { ControlsContext } from '../../context';

function useControls() {
  return useContext(ControlsContext);
}

export default useControls;
