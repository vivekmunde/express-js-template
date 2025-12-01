import dotenv from 'dotenv';

dotenv.config();

type TEnvVariable =
  | 'PORT'
  | 'HOST_URL'
  | 'DATABASE_URL'
  | 'ALLOWED_ORIGINS'
  | 'ENCRYPTION_KEY'
  | 'USER_LOGIN_SESSION_COOKIE_NAME'
  | 'USER_LOGIN_SESSION_COOKIE_MAX_AGE'
  | 'USER_SESSION_COOKIE_NAME'
  | 'USER_SESSION_COOKIE_MAX_AGE'
  | 'AMAZON_AWS_REGION'
  | 'AMAZON_AWS_ACCESS_KEY_ID'
  | 'AMAZON_AWS_SECRET_ACCESS_KEY'
  | 'AMAZON_AWS_SES_FROM_EMAIL'
  | 'AMAZON_AWS_SES_FROM_NAME';

const isEmpty = (value: string | undefined | null) => {
  return value === undefined || value === null || value === '';
};

const errorMessage = (variable: string) => {
  return `${variable} is missing in environment variables!`;
};

const getEnvVariable = (variable: TEnvVariable) => {
  if (isEmpty(process.env[variable])) {
    throw new Error(errorMessage(variable));
  }

  return process.env[variable];
};

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const PORT = getEnvVariable('PORT');

const HOST_URL = getEnvVariable('HOST_URL');

const DATABASE_URL = getEnvVariable('DATABASE_URL');

const ALLOWED_ORIGINS = getEnvVariable('ALLOWED_ORIGINS').split(',');

const ENCRYPTION_KEY = getEnvVariable('ENCRYPTION_KEY');

const USER_LOGIN_SESSION_COOKIE_NAME = getEnvVariable('USER_LOGIN_SESSION_COOKIE_NAME');

const USER_LOGIN_SESSION_COOKIE_MAX_AGE = Number(
  getEnvVariable('USER_LOGIN_SESSION_COOKIE_MAX_AGE')
);

const USER_SESSION_COOKIE_NAME = getEnvVariable('USER_SESSION_COOKIE_NAME');

const USER_SESSION_COOKIE_MAX_AGE = Number(getEnvVariable('USER_SESSION_COOKIE_MAX_AGE'));

const AMAZON_AWS_REGION = getEnvVariable('AMAZON_AWS_REGION');
const AMAZON_AWS_ACCESS_KEY_ID = getEnvVariable('AMAZON_AWS_ACCESS_KEY_ID');
const AMAZON_AWS_SECRET_ACCESS_KEY = getEnvVariable('AMAZON_AWS_SECRET_ACCESS_KEY');
const AMAZON_AWS_SES_FROM_EMAIL = getEnvVariable('AMAZON_AWS_SES_FROM_EMAIL');
const AMAZON_AWS_SES_FROM_NAME = getEnvVariable('AMAZON_AWS_SES_FROM_NAME');

export {
  ALLOWED_ORIGINS,
  AMAZON_AWS_ACCESS_KEY_ID,
  AMAZON_AWS_REGION,
  AMAZON_AWS_SECRET_ACCESS_KEY,
  AMAZON_AWS_SES_FROM_EMAIL,
  AMAZON_AWS_SES_FROM_NAME,
  DATABASE_URL,
  ENCRYPTION_KEY,
  HOST_URL,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  PORT,
  USER_LOGIN_SESSION_COOKIE_MAX_AGE,
  USER_LOGIN_SESSION_COOKIE_NAME,
  USER_SESSION_COOKIE_MAX_AGE,
  USER_SESSION_COOKIE_NAME,
};
