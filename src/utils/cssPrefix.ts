/* Util function to prefix the class names with hp- (see postcss.config.js). */
export const hp = (...cls: string[]) => {
  const result: string[] = [];
  cls?.forEach((maybeClass) => {
    if (maybeClass && typeof maybeClass === 'string') {
      maybeClass
        ?.split(' ')
        ?.forEach((singleClass) =>
          result.push(singleClass?.startsWith('ccs') ? singleClass : `hp-${singleClass}`),
        );
    }
  });
  return result?.join(' ');
};
