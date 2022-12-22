export const sameCharacters = (firstString: string, secondString: string) => {
  firstString = firstString.trim();
  secondString = secondString.trim();

  if (firstString.length !== secondString.length) {
    return false;
  }

  const charCounts = {};

  for (const char of firstString) {
    if (char in charCounts) {
      charCounts[char]++;
    } else {
      charCounts[char] = 1;
    }
  }

  for (const char of secondString) {
    if (char in charCounts) {
      charCounts[char]--;
    } else {
      return false;
    }
  }

  for (const char in charCounts) {
    if (charCounts[char] !== 0) {
      return false;
    }
  }

  return true;
};
