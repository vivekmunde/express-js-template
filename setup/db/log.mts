import chalk from 'chalk';

const consoleLog = (message: string) => {
  console.log(message);
};

const consoleWarning = (message: string) => {
  console.info(chalk.hex('#FFA500')(`ⓘ ${message}`));
};

const consoleSuccess = (message: string) => {
  console.log(chalk.green(`✔ ${message}`));
};

const consoleError = (message: string) => {
  console.error(chalk.red(`✗ ${message}`));
};

export { consoleError, consoleLog, consoleSuccess, consoleWarning };
