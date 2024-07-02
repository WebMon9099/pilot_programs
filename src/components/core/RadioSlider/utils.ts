const getWidthAndOffest = (
  activatedTabIndex: number,
  elementsWidths: number[],
  spacing = 0
) => {
  const width = elementsWidths[activatedTabIndex];
  const left =
    elementsWidths
      .filter((_, index) => index < activatedTabIndex)
      .reduce((sum, width) => sum + width, 0) +
    activatedTabIndex * (spacing * 2);

  return { width, transform: `translate(${left}px, -50%)` };
};

const Utils = { getWidthAndOffest };

export default Utils;
