import chalk from 'chalk';
import fs from 'fs';

type ResponseToFile = { filePath: string, fileContents: string };
export const saveGPTResponseToFile = ({ filePath, fileContents }: ResponseToFile) => {
  console.log(chalk.yellow('> ') + '🎉 Got a response! Saving it in ' + chalk.green(filePath));
  try {
    fs.writeFileSync(filePath, fileContents || '');
  } catch (error) {
    console.log(chalk.yellow('> ') + '🥲 Oh no! Node wasn\'t able to write to the file.')
  }
  console.log(chalk.yellow('> ') + '✅ File saved successfully!');
}
