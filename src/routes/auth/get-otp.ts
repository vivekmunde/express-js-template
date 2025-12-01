import { getRandomNumber } from '@/utils/get-random-number';

const getOtp = () =>
  Array.from({ length: 4 })
    .map(() => getRandomNumber(0, 9))
    .join('');

export { getOtp };
