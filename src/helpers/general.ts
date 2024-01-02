export const getInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  return initials;
};