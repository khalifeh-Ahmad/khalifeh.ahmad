export const hoverLift = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { y: 0, scale: 0.99 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
};

export const iconNudge = {
  whileHover: { x: 2, y: -2 },
  transition: { type: "spring", stiffness: 260, damping: 16 },
};

export const subtlePress = {
  whileTap: { scale: 0.98 },
};
