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
  const detailsWeight = 0.3;

  return data.map((entry) => {
    const crimeSimilarity = JaroWinklerDistance(input.crime, entry.crime);
    const detailsSimilarity = JaroWinklerDistance(input.details, entry.details);

    const totalSimilarity =
      crimeSimilarity * crimeWeight + detailsSimilarity * detailsWeight;
    return { ...entry, similarity: totalSimilarity };
  });
};

const findMostSimilarCase = (similarities) => {
  return similarities.reduce((prev, curr) =>
    curr.similarity > prev.similarity ? curr : prev,
  );
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
      console.log(
        `---\n\x1b[1;32mSuitable Punishment Found: ${mostSimilarCase.punishment}\x1b[22;0m`,
      );
      rl.close();
    });
  });
})();
