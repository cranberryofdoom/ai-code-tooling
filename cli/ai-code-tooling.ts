import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';

const program = new Command();

program
  .name('ai-code-tooling')
  .description('CLI gen')
  .version('1.0.0');

const ESLINT_PROMPT_CONTEXT = 'I want to write a custom eslint rule that...';
type ESLintPromptAnswers = { promptType: 'manual' | 'directory', manualPrompt: string, directoryPrompt: string };

program.command('eslint')
  .description('Use GPT to generate a custom ESLint rule based off prompt and tests.')
  .action(() => {
    inquirer.prompt([{
      type: 'list',
      name: 'promptType',
      message: 'How do you want to provide your prompt?',
      choices: [{
        name: 'Find my prompt in the propmts directory via file name.',
        value: 'directory'
      }, {
        name: 'I want to type my prompt in.',
        value: 'manual'
      }],
    }, {
      type: 'input',
      name: 'manualPrompt',
      message: ESLINT_PROMPT_CONTEXT,
      when(answers: ESLintPromptAnswers) {
        return answers.promptType === 'manual';
      },
    }, {
      type: 'input',
      name: 'directoryPrompt',
      message: 'Type in the name of the file in the prompts directory that you want to use:',
      when(answers: ESLintPromptAnswers) {
        return answers.promptType === 'directory';
      }
    }]).then((answers: ESLintPromptAnswers) => {
      const { promptType } = answers;
      if (promptType === 'directory') {
        const { directoryPrompt } = answers;
        const prompt = fs.readFileSync(`./prompts/${directoryPrompt}.txt`,
          { encoding: 'utf8', flag: 'r' });
        const test = fs.readFileSync(`./tests/${directoryPrompt}.test.ts`)
        console.log(`${ESLINT_PROMPT_CONTEXT} ${prompt} \n \n ${test}`);
      }
    });
  });

program.parse();