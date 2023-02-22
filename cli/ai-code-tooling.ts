import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import { saveGPTResponseToFile } from './utils/save-gpt-response-to-file.js';
import { runGPT } from './utils/run-gpt.js';
import { runTests } from './utils/run-tests.js';

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

      console.log(chalk.yellow('> ') + '💡 Here is the prompt that we\'ll send to our AI friend:');
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