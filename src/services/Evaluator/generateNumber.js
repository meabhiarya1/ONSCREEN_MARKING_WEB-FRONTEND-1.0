export const generateNumbers = (minMarks, maxNumber, difference) => {
  const numbers = [];
  // Start from 1, then keep adding the difference until it exceeds maxNumber
  for (let i = minMarks; i <= maxNumber; i += difference) {
    numbers.push(i);
  }
  return numbers;
};
