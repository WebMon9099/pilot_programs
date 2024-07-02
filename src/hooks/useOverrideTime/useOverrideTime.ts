var overrideTime: number | undefined;

function useOverrideTime(time?: number) {
  if (time !== undefined) overrideTime = time;
  if (time === 0) overrideTime = undefined;

  return overrideTime;
}

export default useOverrideTime;
