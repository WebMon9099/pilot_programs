import { appendClass } from '../../../../../lib';
import { PushButton } from '../../../../core';

interface ShapesProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled: boolean;
  isPlayingAudio: boolean;
  letters: String[];
  setSoundCheck: (shapesSame: boolean) => void;
  createNewAudios:() => void;
}

const Sound: React.FC<ShapesProps> = ({
  disabled,
  isPlayingAudio,
  letters,
  setSoundCheck,
  createNewAudios,
  ...rest
}) => {

  const checkResult = (kind: String) => {
    const finals = new Set();
    let check_duplicate_res = false;
    for (var i = 0; i < letters.length; i++) {
      if (finals.has(letters[i])) {
        check_duplicate_res = true;
      }
      finals.add(letters[i]);
    }
    switch(kind){
      case "duplicated":
        if (check_duplicate_res){
          setSoundCheck(true);
        } else {
          setSoundCheck(false);
        }
        break;
      case "non-duplicated":
        if (check_duplicate_res){
          setSoundCheck(false);
        } else {
          setSoundCheck(true);
        }
        break;
    }
  }

  return (
    <div {...rest} className={appendClass('sounds', rest.className)}>
      <div className="sounds-container" style={{opacity:isPlayingAudio?1:0.2}}>
        <img
          className=""
          src={require(isPlayingAudio?'./images/speaker-playing.svg':'./images/speaker-not-playing.svg').default}
          alt="Speaker"
        />
      </div>
      <div className="buttons-container">
        <PushButton
          className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={disabled}
          onClick={() => checkResult('duplicated')}
        >
          Duplicated
        </PushButton>
        <PushButton
          className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={disabled}
          onClick={() => checkResult('non-duplicated')}
        >
          Not Duplicated
        </PushButton>
        <PushButton
          className="font-inter transition hover:scale-105 active:scale-95 active:brightness-95"
          disabled={disabled}
          onClick={() => createNewAudios()}
        >
          Skip
        </PushButton>
      </div>
    </div>
  );
};

export default Sound;
