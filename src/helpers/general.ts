export const getInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  return initials;
};


export const roundToOneDec = (val: number) => {
  return (Math.round(val * 10) / 10).toString() + (Number.isInteger(val) ? '.0' : '');
};