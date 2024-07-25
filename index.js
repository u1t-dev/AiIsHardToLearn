import { readFile } from "node:fs/promises";
import readline from "node:readline";
import pkg from "natural";
const { JaroWinklerDistance } = pkg;

const loadData = async (filePath) => {
  try {
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
};

const computeSimilarity = (input, data) => {
  const crimeWeight = 0.7;

  return Object.keys(data).map((crimeName) => {
    const crimeSimilarity = JaroWinklerDistance(input.crime, crimeName);

    const totalSimilarity = crimeSimilarity * crimeWeight;
    return { crimeName, similarity: totalSimilarity };
  });
};

const findMostSimilarCase = (similarities) => {
  return similarities.reduce((prev, curr) =>
    curr.similarity > prev.similarity ? curr : prev,
  );
};

const formatPunishment = (punishments, offenseLevel) => {
  return Object.keys(punishments)
    .filter((key) => key.startsWith(offenseLevel))
    .map((key) => {
      const value = punishments[key];
      if (key.includes("Fine")) {
        return value.replace('_', ' ');
      }
      const [time, location] = value.split("_");
      return `${time} in ${location}`;
    });
};

(async () => {
  const data = await loadData("./data.json");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the crime: ", (crime) => {
    rl.question("Enter the details of the crime: ", async (details) => {
      const inputCase = { crime, details };
      const similarities = computeSimilarity(inputCase, data);
      const mostSimilarCase = findMostSimilarCase(similarities);
      const isJuvenile = /(juvenile)/gi.test(details);
      const offenseMatch = details.match(/(first|second|third|fourth|fifth)/gi);
      const offenseLevel = offenseMatch ? offenseMatch[0].toLowerCase() : 'first';
      const offenseLevelMap = {
        'first': '1',
        'second': '2',
        'third': '3',
        'fourth': '4',
        'fifth': '5'
      };
      const offenseLevelNumber = offenseLevelMap[offenseLevel];
      const punishments = isJuvenile
        ? data[mostSimilarCase.crimeName].juvenile
        : data[mostSimilarCase.crimeName].adult;
      const formattedPunishments = formatPunishment(punishments, offenseLevelNumber);

      if (formattedPunishments.length > 0) {
        console.log(`---\n\x1b[1;32mSuitable Punishment Found:\x1b[22;0m`);
        formattedPunishments.forEach((p) => console.log(`\x1b[32m${p}`));
      } else {
        console.log("---\n\x1b[1;101mNo suitable punishment found.\x1b[0m");
      }
      rl.close();
    });
  });
})();
