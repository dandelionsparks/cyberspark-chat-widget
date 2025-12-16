export const getRandomPosition = (containerWidth: number, containerHeight: number, elementWidth: number = 300, elementHeight: number = 100) => {
  const maxX = Math.max(0, containerWidth - elementWidth);
  const maxY = Math.max(0, containerHeight - elementHeight);
  
  return {
    left: Math.floor(Math.random() * maxX),
    top: Math.floor(Math.random() * maxY),
    rotation: Math.floor(Math.random() * 10) - 5 // -5 to 5 degrees
  };
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
