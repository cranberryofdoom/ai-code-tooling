import chalk from 'chalk';
import fs from 'fs';
import { saveGPTResponseToFile } from './save-gpt-response-to-file.js';
import { runGPT } from './run-gpt.js';
import { exec } from 'child_process';

const MAX_NUM_RUNS = 3;
let currentNumRuns = 1;

type PreviousPrompt = { promptFileName: string, askSection: string, testSection: string, gptCode: string };
export const runTests = ({ promptFileName, askSection, testSection, gptCode }: PreviousPrompt) => {
  console.log(chalk.yellow('> ') + '👀 Seeing if tests pass for the AI generated code. Running ' + chalk.red('`yarn jest`') + '...');
  exec('yarn test', async (error, _) => {
    const filePath = `./generated-code/${promptFileName}.ts`;

    if (error) {
      const jestError = error.message;
      console.log(chalk.gray(jestError));
      if (currentNumRuns < MAX_NUM_RUNS) {
        currentNumRuns++;
        console.log(chalk.yellow('> ') + `🥲 Oh no! Our AI friend did not write code that passes our tests. Trying again, take ${currentNumRuns}.`);

        const incorrectSection = `I wrote the following code that does not pass the tests:\n\`\`\`\n${gptCode}\`\`\``;
        const failingTestsSection = `When running this code against the tests, I got the following error:\n\`\`\`\n${jestError}\`\`\``;
        const startOfResultingCode = fs.readFileSync(`./cli/eslint-start-of-resulting-code.txt`);
        const autocompleteSection = `The correct code that passes my tests should be:\n\`\`\`\n${startOfResultingCode}`;
        const nextPrompt = `${askSection}\n\n${testSection}\n\n${incorrectSection}\n\n${failingTestsSection}\n\n${autocompleteSection}`;

        const gptResponse = await runGPT(nextPrompt);
        const fileContents = `${startOfResultingCode}${gptResponse}`;
        saveGPTResponseToFile({ fileContents, filePath });

        runTests({ promptFileName, askSection, testSection, gptCode: fileContents });
      } else {
        console.log(chalk.yellow('> ') + `🥲 Oh no! Our AI friend hit the max number of tries it had to generate code for us. Current max number of tries: ${MAX_NUM_RUNS}.`);
        console.log(chalk.yellow('> ') + `👀 You can still look at the code our friend generated here: ` + chalk.green(filePath));
      }
      return;
    }
    console.log(chalk.yellow('> ') + `🎉 Wow! Our AI friend was able to write code that passed our tests!`);
  })
};
