'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const format = require(`date-fns/format`);


const {FILE_SIZE_MIN, FILE_SIZE_MAX, FILE_NAME, ANNOUNCE_MAX, FULL_TEXT_MAX, CREATED_DATE_MIN, MONTH_MILLISECONDS, EXIT_CODE} = require(`../constants`);
const {getRandomIntInclusive, shuffleArray} = require(`../utils`);
const {titleList, descriptionList, categoryList} = require(`../data`);

const messageType = {
  error: {
    tooMuch: `Не больше ${FILE_SIZE_MAX} объявлений`
  },
  success: chalk`Данные соханены в файл {underline ${FILE_NAME}}`
};

const generateList = (count) => {
  const createdDateMax = Date.now();
  const createdDateMin = createdDateMax - CREATED_DATE_MIN * MONTH_MILLISECONDS;

  return Array(count).fill({}).map(() => ({
    title: titleList[getRandomIntInclusive(0, titleList.length - 1)],
    announce: shuffleArray(descriptionList).slice(0, ANNOUNCE_MAX).join(` `),
    fullText: shuffleArray(descriptionList).slice(0, FULL_TEXT_MAX).join(` `),
    createdDate: format(getRandomIntInclusive(createdDateMin, createdDateMax), `yyyy-MM-dd HH:mm:ss`),
    category: Array(getRandomIntInclusive(0, categoryList.length - 1)).fill().map((item, index) => categoryList[index]),
  }));
};

const sendMessage = (error) => {
  if (error) {
    console.log(chalk.red(error));
    return;
  }

  console.log(messageType.success);
};

const saveFile = (data) => {
  try {
    fs.writeFileSync(FILE_NAME, data);
    sendMessage();
  } catch (err) {
    sendMessage(err);
    process.exitCode = EXIT_CODE.ERROR;
  }
};

const run = (count) => {
  count = Number(count) || FILE_SIZE_MIN;

  if (count > FILE_SIZE_MAX) {
    sendMessage(messageType.error.tooMuch);
    process.exitCode = EXIT_CODE.ERROR;
    return;
  }

  const data = JSON.stringify(generateList(count));
  saveFile(data);
};

module.exports = {
  run
};