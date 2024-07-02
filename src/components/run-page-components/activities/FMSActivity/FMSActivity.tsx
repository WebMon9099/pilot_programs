import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Slash, X } from 'react-feather';
import { EVENT_KEYS } from '../../../../constants';
import {
  useInterval,
  useRefState,
  useSpeech,
  useTimeout,
} from '../../../../hooks';
import useTimeActivity from '../../../../hooks/useActivity/useTimeActivity/useTimeActivity';
import useOverrideTime from '../../../../hooks/useOverrideTime';
import { appendClass } from '../../../../lib';
import type { ActivityComponent } from '../../../../types';
import { ToggleButton } from '../../../core';
import ComputerButton from './ComputerButton';
import Numpad from './Numpad';
import Waveform from './Waveform';
import {
  ALTITUDE_INC,
  MAX_ALTITUDE,
  MAX_FREQUENCY,
  MAX_HEADING,
  MAX_SPEED,
  MIN_ALTITUDE,
  MIN_FREQUENCY,
  MIN_HEADING,
  MIN_SPEED,
  SPEED_INC,
} from './constants';

type Section = 'alt' | 'spd' | 'hdg' | 'frq';

export interface Attempt {
  totalItems: number;
  recalled: number;
}

const FMSActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  activityParams,
  ...rest
}) => {
  const { msg } = useSpeech();

  useTimeActivity(activityObject, activityState, activityActions);

  const [alt, setAlt, altRef] = useRefState('');
  const [altActivated, setAltActivated, altActivatedRef] = useRefState(true);

  const [spd, setSpd, spdRef] = useRefState('');
  const [spdActivated, setSpdActivated, spdActivatedRef] = useRefState(true);

  const [hdg, setHdg, hdgRef] = useRefState('');
  const [hdgActivated, setHdgActivated, hdgActivatedRef] = useRefState(true);

  const [frq, setFrq, frqRef] = useRefState('');
  const [frqActivated, setFrqActivated, frqActivatedRef] = useRefState(true);

  // const [state, setState, stateRef] = useRefState<{
  //   altitude?: string;
  //   speed?: string;
  //   heading?: string;
  //   frequency?: string;
  // }>({
  //   altitude: '5000',
  //   speed: '300',
  //   heading: '075',
  //   frequency: '414',
  // });

  const goDownASection = useCallback(
    function goDownASection(activatedSection: Section): void {
      switch (activatedSection) {
        case 'alt':
          if (spdActivatedRef.current) setActivatedSection('spd');
          else return goDownASection('spd');
          break;
        case 'spd':
          if (hdgActivatedRef.current) setActivatedSection('hdg');
          else return goDownASection('hdg');
          break;
        case 'hdg':
          if (frqActivatedRef.current) setActivatedSection('frq');
          break;
      }
    },
    [spdActivatedRef, hdgActivatedRef, frqActivatedRef]
  );

  const goUpASection = useCallback(
    function goUpASection(activatedSection: Section): void {
      switch (activatedSection) {
        case 'frq':
          if (hdgActivatedRef.current) setActivatedSection('hdg');
          else return goUpASection('hdg');
          break;
        case 'hdg':
          if (spdActivatedRef.current) setActivatedSection('spd');
          else return goUpASection('spd');
          break;
        case 'spd':
          if (altActivatedRef.current) setActivatedSection('alt');
          break;
      }
    },
    [hdgActivatedRef, spdActivatedRef, altActivatedRef]
  );

  const [state, setState, stateRef] = useRefState<{
    altitude?: string;
    speed?: string;
    heading?: string;
    frequency?: string;
  }>({
    altitude: undefined,
    speed: undefined,
    heading: undefined,
    frequency: undefined,
  });
  const [, setAttempts, attemptsRef] = useRefState<Attempt[]>([]);

  const [activatedSection, setActivatedSection] = useState<Section>('alt');
  const [playsAudio, setPlaysAudio] = useState(true);
  const [overrideTime, setOverrideTime] = useState<number | undefined>();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showsAnswers, setShowsAnswers] = useState(false);

  useOverrideTime(overrideTime !== undefined ? overrideTime * 1000 : undefined);

  const generateNewState = useCallback(() => {
    setAlt('');
    setSpd('');
    setHdg('');
    setFrq('');
    goUpASection('spd');

    var altitude = undefined;
    var speed = undefined;
    var heading = undefined;
    var frequency = undefined;

    const itemsThisState = getNextItemsCount();
    const itemsToChooseFrom = ['alt', 'spd', 'hdg', 'frq'].filter((item) => {
      if (item === 'alt') return altActivatedRef.current;
      if (item === 'spd') return spdActivatedRef.current;
      if (item === 'hdg') return hdgActivatedRef.current;
      if (item === 'frq') return frqActivatedRef.current;

      return true;
    });

    const items = _.sampleSize(itemsToChooseFrom, itemsThisState);

    var finalItemsCount = 0;

    if (items.includes('alt') && altActivatedRef.current) {
      altitude =
        _.random(MIN_ALTITUDE / ALTITUDE_INC, MAX_ALTITUDE / ALTITUDE_INC) *
        ALTITUDE_INC;
      finalItemsCount += 1;
    }

    if (items.includes('spd') && spdActivatedRef.current) {
      speed =
        _.random(MIN_SPEED / SPEED_INC, MAX_SPEED / SPEED_INC) * SPEED_INC;
      finalItemsCount += 1;
    }

    if (items.includes('hdg') && hdgActivatedRef.current) {
      heading = _.random(MIN_HEADING, MAX_HEADING);
      finalItemsCount += 1;
    }

    if (items.includes('frq') && frqActivatedRef.current) {
      frequency = _.random(MIN_FREQUENCY, MAX_FREQUENCY);
      finalItemsCount += 1;
    }

    setOverrideTime(4 * finalItemsCount);

    activityActions.activitySetArbitraryState({ chunks: finalItemsCount });

    setState({
      altitude: altitude ? altitude.toString() : undefined,
      speed: speed ? speed.toString() : undefined,
      heading: heading ? getPrefixedString(heading) : undefined,
      frequency: frequency ? frequency.toString() : undefined,
    });

    const textSections = [];
    if (altitude) textSections.push(`altitude, ${altitude} feet`);
    if (speed) textSections.push(`speed, ${seperateNumbers(speed)} knots`);
    if (heading)
      textSections.push(`heading, ${seperateNumbers(heading)} degrees`);
    if (frequency)
      textSections.push(`frequency, ${seperateNumbers(frequency)}`);

    msg.text = textSections.join(', ');
    msg.rate = 0.9;

    window.speechSynthesis.speak(msg);

    msg.onend = function onSpeekEnd() {
      setPlaysAudio(false);

      const timeRemaining = getTimeRemaining();
      setTimeRemaining(timeRemaining);
      setOverrideTime(timeRemaining);
    };

    function seperateNumbers(num: number) {
      var str = num.toString();

      str = getPrefixedString(str);

      var finalStr = '';
      for (const c of str) finalStr = `${finalStr}, ${c}`;

      return finalStr;
    }

    function getPrefixedString(num: number | string) {
      var str;

      if (typeof num === 'number') str = num.toString();
      else str = num;

      if (
        (typeof num === 'number' && num < 100) ||
        (typeof num === 'string' && parseInt(num) < 100)
      )
        str = `0${str}`;
      if (
        (typeof num === 'number' && num < 10) ||
        (typeof num === 'string' && parseInt(num) < 10)
      )
        str = `0${str}`;

      return str;
    }

    function getNextItemsCount() {
      if (attemptsRef.current.length === 0) return 1;

      const lastAttempt = attemptsRef.current[attemptsRef.current.length - 1];

      const lastAttemptSuccessPrecantage =
        (lastAttempt.recalled / lastAttempt.totalItems) * 100;

      if (lastAttemptSuccessPrecantage === 100)
        return Math.min(4, lastAttempt.totalItems + 1);
      else if (
        lastAttemptSuccessPrecantage < 100 &&
        lastAttemptSuccessPrecantage > 75
      )
        return lastAttempt.totalItems;
      else if (
        lastAttemptSuccessPrecantage <= 75 &&
        lastAttemptSuccessPrecantage > 50
      )
        Math.max(1, lastAttempt.totalItems - 1);
      else return Math.max(1, lastAttempt.totalItems - 2);
    }

    function getTimeRemaining() {
      switch (finalItemsCount) {
        case 1:
          return 7;
        case 2:
          return 11;
        case 3:
          return 15;
        case 4:
          return 18;
        default:
          return 60;
      }
    }
  }, [
    activityActions,
    altActivatedRef,
    frqActivatedRef,
    hdgActivatedRef,
    attemptsRef,
    msg,
    goUpASection,
    setAlt,
    setFrq,
    setHdg,
    setSpd,
    setState,
    spdActivatedRef,
  ]);

  const checkUserAnswer = useCallback(() => {
    var totalItems = 0;
    var correctAnswers = 0;

    if (stateRef.current.altitude !== undefined && altActivatedRef.current)
      totalItems += 1;
    if (
      altRef.current === stateRef.current?.altitude &&
      altActivatedRef.current
    ) {
      correctAnswers += 1;
    }

    if (stateRef.current.speed !== undefined && spdActivatedRef.current)
      totalItems += 1;
    if (spdRef.current === stateRef.current?.speed && spdActivatedRef.current) {
      correctAnswers += 1;
    }

    if (stateRef.current.heading !== undefined && hdgActivatedRef.current)
      totalItems += 1;
    if (
      hdgRef.current === stateRef.current?.heading &&
      hdgActivatedRef.current
    ) {
      correctAnswers += 1;
    }

    if (stateRef.current.frequency !== undefined && frqActivatedRef.current)
      totalItems += 1;
    if (
      frqRef.current === stateRef.current?.frequency &&
      frqActivatedRef.current
    ) {
      correctAnswers += 1;
    }

    activityActions.activityIncreaseMaxScore(4);

    activityActions.activityIncreaseScore(correctAnswers);

    setAttempts((attempts) => [
      ...attempts,
      { totalItems, recalled: correctAnswers },
    ]);

    if (activityState.trainingMode) {
      setShowsAnswers(true);

      setOverrideTime(activityObject.showAnswerTime / 1000);
    } else setPlaysAudio(true);
  }, [
    setAttempts,
    activityObject,
    activityActions,
    activityState.trainingMode,
    altRef,
    frqRef,
    hdgRef,
    spdRef,
    altActivatedRef,
    spdActivatedRef,
    hdgActivatedRef,
    frqActivatedRef,
    stateRef,
  ]);

  const activatedInputDispatch = useMemo(() => {
    switch (activatedSection) {
      case 'alt':
        return setAlt;
      case 'spd':
        return setSpd;
      case 'hdg':
        return setHdg;
      case 'frq':
        return setFrq;
    }
  }, [activatedSection, setAlt, setFrq, setHdg, setSpd]);

  const addNumberToActivatedInput = useCallback(
    (number: string) => {
      if (activatedInputDispatch === setAlt && altRef.current.length >= 5)
        return;
      if (activatedInputDispatch === setSpd && spdRef.current.length >= 3)
        return;
      if (activatedInputDispatch === setHdg && hdgRef.current.length >= 3)
        return;
      if (activatedInputDispatch === setFrq && frqRef.current.length >= 3)
        return;

      activatedInputDispatch(
        (activatedInputValue) => activatedInputValue + number
      );
    },
    [
      activatedInputDispatch,
      altRef,
      frqRef,
      hdgRef,
      setAlt,
      setFrq,
      setHdg,
      setSpd,
      spdRef,
    ]
  );

  const deleteLastNumberFromActivatedInput = useCallback(() => {
    activatedInputDispatch((activatedInputValue) =>
      activatedInputValue.substring(0, activatedInputValue.length - 1)
    );
  }, [activatedInputDispatch]);

  useEffect(() => {
    if (!playsAudio && !showsAnswers) {
      document.addEventListener('keydown', onKeyDown);

      return () => document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case EVENT_KEYS.digit0:
        case EVENT_KEYS.digit1:
        case EVENT_KEYS.digit2:
        case EVENT_KEYS.digit3:
        case EVENT_KEYS.digit4:
        case EVENT_KEYS.digit5:
        case EVENT_KEYS.digit6:
        case EVENT_KEYS.digit7:
        case EVENT_KEYS.digit8:
        case EVENT_KEYS.digit9:
          addNumberToActivatedInput(e.key);
          break;
        case EVENT_KEYS.backspace:
        case EVENT_KEYS.delete:
          deleteLastNumberFromActivatedInput();
          break;
        case EVENT_KEYS.arrowDown:
          goDownASection(activatedSection);
          break;
        case EVENT_KEYS.arrowUp:
          goUpASection(activatedSection);
          break;
        case EVENT_KEYS.enter:
          checkUserAnswer();
          break;
      }
    }
  }, [
    checkUserAnswer,
    addNumberToActivatedInput,
    deleteLastNumberFromActivatedInput,
    goDownASection,
    goUpASection,
    playsAudio,
    showsAnswers,
    activatedSection,
  ]);

  useEffect(() => {
    if (activityState.paused) {
      window.speechSynthesis.pause();
    } else {
      window.speechSynthesis.resume();
    }
  }, [activityState.paused]);

  useEffect(() => {
    if (playsAudio && !window.speechSynthesis.speaking) generateNewState();
  }, [generateNewState, playsAudio]);

  useInterval(
    useCallback(() => {
      setTimeRemaining((timeRemaining) => {
        if (timeRemaining - 1 === 0) checkUserAnswer();

        return timeRemaining - 1;
      });
    }, [checkUserAnswer]),
    1000,
    playsAudio || showsAnswers || activityState.paused
  );

  useTimeout(
    useCallback(() => {
      setShowsAnswers(false);

      setPlaysAudio(true);
    }, []),
    5000,
    activityState.paused || !showsAnswers,
    showsAnswers
  );

  return (
    <div
      {...rest}
      className={appendClass('activity fms-activity', rest.className)}
    >
      <div className="left-container container">
        {/* {process.env.NODE_ENV === 'development' && (
          <>
            <p>Altitude: {state.altitude}</p>
            <p>Speed: {state.speed}</p>
            <p>Heading: {state.heading}</p>
            <p>Frequency: {state.frequency}</p>
          </>
        )} */}
        <div className="computer">
          <div className="buttons-container">
            <ComputerButton
              activated={!showsAnswers && activatedSection === 'alt'}
              hidden={!altActivated}
              disabled={playsAudio}
              onClick={() => setActivatedSection('alt')}
            />
            <ComputerButton
              activated={!showsAnswers && activatedSection === 'spd'}
              hidden={!spdActivated}
              disabled={playsAudio}
              onClick={() => setActivatedSection('spd')}
            />
            <ComputerButton
              activated={!showsAnswers && activatedSection === 'hdg'}
              hidden={!hdgActivated}
              disabled={playsAudio}
              onClick={() => setActivatedSection('hdg')}
            />
            <ComputerButton
              activated={!showsAnswers && activatedSection === 'frq'}
              hidden={!frqActivated}
              disabled={playsAudio}
              onClick={() => setActivatedSection('frq')}
            />
          </div>
          <div className="screen font-inter">
            <div
              className={`section ${
                activatedSection === 'alt' ? 'activated' : ''
              } ${!altActivated ? 'disabled' : ''} ${
                showsAnswers &&
                altActivated &&
                state.altitude &&
                (alt === state.altitude ? 'correct' : 'incorrect')
              }`}
            >
              <p className="section-title">ALT</p>
              <div className="section-input">
                <p>{alt}</p>
                {showsAnswers && altActivated && state.altitude && (
                  <>
                    {alt === state.altitude ? <Check /> : <X />}
                    {!(alt === state.altitude) && (
                      <div className="correct-answer">
                        {state.altitude}
                        <Check />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div
              className={`section ${
                activatedSection === 'spd' ? 'activated' : ''
              } ${!spdActivated ? 'disabled' : ''} ${
                showsAnswers &&
                spdActivated &&
                state.speed &&
                (spd === state.speed ? 'correct' : 'incorrect')
              }`}
            >
              <p className="section-title">SPD</p>
              <div className="section-input">
                <p>{spd}</p>
                {showsAnswers && spdActivated && state.speed && (
                  <>
                    {spd === state.speed ? <Check /> : <X />}
                    {!(spd === state.speed) && (
                      <div className="correct-answer">
                        {state.speed}
                        <Check />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div
              className={`section ${
                activatedSection === 'hdg' ? 'activated' : ''
              } ${!hdgActivated ? 'disabled' : ''} ${
                showsAnswers &&
                hdgActivated &&
                state.heading &&
                (hdg === state.heading ? 'correct' : 'incorrect')
              }`}
            >
              <p className="section-title">HDG</p>
              <div className="section-input">
                <p>{hdg}</p>
                {showsAnswers && hdgActivated && state.heading && (
                  <>
                    {hdg === state.heading ? <Check /> : <X />}
                    {!(hdg === state.heading) && (
                      <div className="correct-answer">
                        {state.heading}
                        <Check />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div
              className={`section ${
                activatedSection === 'frq' ? 'activated' : ''
              } ${!frqActivated ? 'disabled' : ''} ${
                showsAnswers &&
                frqActivated &&
                state.frequency &&
                (frq === state.frequency ? 'correct' : 'incorrect')
              }`}
            >
              <p className="section-title">FRQ</p>
              <div className="section-input">
                {frq}
                {showsAnswers && frqActivated && state.frequency && (
                  <>
                    {frq === state.frequency ? <Check /> : <X />}
                    {!(frq === state.frequency) && (
                      <div className="correct-answer">
                        {state.frequency}
                        <Check />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          {activityState.trainingMode && (
            <div className="toggles-container">
              <ToggleButton
                toggled={altActivated}
                disabled={activityState.paused || playsAudio}
                onToggleChange={(toggled) => {
                  if (
                    !toggled &&
                    !spdActivated &&
                    !hdgActivated &&
                    !frqActivated
                  )
                    return;
                  else if (!toggled && activatedSection === 'alt')
                    goDownASection('alt');

                  setAltActivated(toggled);
                }}
                showText={false}
              />
              <ToggleButton
                toggled={spdActivated}
                disabled={activityState.paused || playsAudio}
                onToggleChange={(toggled) => {
                  if (
                    !toggled &&
                    !altActivated &&
                    !hdgActivated &&
                    !frqActivated
                  )
                    return;
                  else if (activatedSection === 'spd') {
                    if (!toggled && (hdgActivated || frqActivated))
                      goDownASection('spd');
                    else if (!toggled && altActivated) goUpASection('spd');
                  }

                  setSpdActivated(toggled);
                }}
                showText={false}
              />
              <ToggleButton
                toggled={hdgActivated}
                disabled={activityState.paused || playsAudio}
                onToggleChange={(toggled) => {
                  if (
                    !toggled &&
                    !altActivated &&
                    !spdActivated &&
                    !frqActivated
                  )
                    return;
                  else if (activatedSection === 'hdg') {
                    if (!toggled && frqActivated) goDownASection('hdg');
                    else if (!toggled && (altActivated || spdActivated))
                      goUpASection('hdg');
                  }

                  setHdgActivated(toggled);
                }}
                showText={false}
              />
              <ToggleButton
                toggled={frqActivated}
                disabled={activityState.paused || playsAudio}
                onToggleChange={(toggled) => {
                  if (
                    !toggled &&
                    !altActivated &&
                    !spdActivated &&
                    !hdgActivated
                  )
                    return;
                  else if (!toggled && activatedSection === 'frq')
                    goUpASection('frq');

                  setFrqActivated(toggled);
                }}
                showText={false}
              />
            </div>
          )}
        </div>
      </div>
      <div className="right-container container">
        {/* {activityState.trainingMode && <Graph attempts={attempts.slice(-10)} />} */}
        {playsAudio ? (
          <div className="waveform-container">
            <Waveform paused={activityState.paused} />
          </div>
        ) : showsAnswers ? (
          <>
            <div className="waveform-container">
              <Slash />
            </div>
          </>
        ) : (
          <div className="numpad-container">
            <p>You have {timeRemaining} seconds remaining!</p>
            <Numpad
              onNumber={addNumberToActivatedInput}
              onDelete={deleteLastNumberFromActivatedInput}
              onSubmit={checkUserAnswer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FMSActivity;
