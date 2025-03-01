export const getKeyName = (...args: string[]) => {
  return `blogs:${args.join(":")}`;
};
