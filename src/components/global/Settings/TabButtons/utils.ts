const getWidthAndOffest = (
  activatedTabIndex: number,
  tabsWidths: number[],
  margin = 0
) => {
  const width = tabsWidths[activatedTabIndex];
  const marginLeft =
    tabsWidths
      .filter((_, index) => index < activatedTabIndex)
      .reduce((sum, width) => sum + width, 0) +
    activatedTabIndex * (margin * 2);

  return { width, marginLeft };
};

const Utils = { getWidthAndOffest };

export default Utils;
