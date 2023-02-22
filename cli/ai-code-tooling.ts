import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const runGPT = async (prompt: string) => {
  const response = await openai.createCompletion({
    model: "code-davinci-002",
    prompt: prompt,
    temperature: 0,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["```"],
  });
  return response.data.choices[0].text;
}

type ResponseToFile = { filePath: string, fileContents: string };
const saveGPTResponseToFile = ({ filePath, fileContents }: ResponseToFile) => {
  console.log(chalk.yellow('> ') + '🎉 Got a response! Saving it in ' + chalk.green(filePath));
  try {
    fs.writeFileSync(filePath, fileContents || '');
  } catch (error) {
    console.log(chalk.yellow('> ') + '🥲 Oh no! Node wasn\'t able to write to the file.')
  }
  console.log(chalk.yellow('> ') + '✅ File saved successfully!');
}

const MAX_NUM_RUNS = 3;
let currentNumRuns = 1;

type PreviousPrompt = { promptFileName: string, askSection: string, testSection: string, gptCode: string };
const runTests = ({ promptFileName, askSection, testSection, gptCode }: PreviousPrompt) => {
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

const program = new Command();
program
  .name('ai-code-tooling')
  .description('CLI gen')
  .version('1.0.0');

type ESLintPromptAnswers = { promptFileName: string, testFileName: string, hasFixer: boolean };

program.command('eslint')
  .description('Use GPT3 to generate a custom ESLint rule based off a prompt and test.')
  .action(() => {
    inquirer.prompt([{
      type: 'input',
      name: 'promptFileName',
      message: 'Type in the name of the file in the prompts directory that you want to use:',
    }, {
      type: 'input',
      name: 'testFileName',
      message: 'Type in the name of the file in the tests directory that you want to use:',
    }, {
      type: 'confirm',
      name: 'hasFixer',
      message: 'Does your lint rule come with a fixer?',
    }]).then((answers: ESLintPromptAnswers) => {
      const { promptFileName, testFileName, hasFixer } = answers;

      const prompt = fs.readFileSync(`./prompts/${promptFileName}.txt`);
      const askSection = `I want to write a custom eslint rule that ${prompt}`;

      const test = fs.readFileSync(`./tests/${testFileName}.test.ts`);
      const testSection = `Here are the tests that this rule should pass:\n\`\`\`\n${test}\`\`\``;

      const startOfResultingCode = fs.readFileSync(`./cli/eslint-start-of-resulting-code.txt`);
      const autocompleteSection = `This is the code for the lint rule${hasFixer && ' and fixer'}:\n\`\`\`\n${startOfResultingCode}`;

      const finalPrompt = `${askSection}\n\n${testSection}\n\n${autocompleteSection}`;

      console.log(chalk.yellow('> ') + '💡 Here is the prompt that we\'ll send to our AI friends:');
      console.log(chalk.gray(finalPrompt));

      inquirer.prompt([{
        type: 'confirm',
        name: 'isFinalPromptReady',
        message: 'Does this prompt look good?',
      }]).then(async ({ isFinalPromptReady }) => {
        if (isFinalPromptReady) {
          console.log(chalk.yellow('> ') + '🤖 Kicking off AI code tooling generation! Please hold while our friend thinks.')

          const gptResponse = await runGPT(finalPrompt);
          const filePath = `./generated-code/${promptFileName}.ts`;
          const fileContents = `${startOfResultingCode}${gptResponse}`;

          saveGPTResponseToFile({ fileContents, filePath });

          runTests({ promptFileName, askSection, testSection, gptCode: fileContents });
        }
      })
    });
  });

program.parse();