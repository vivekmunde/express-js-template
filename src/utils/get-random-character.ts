const chars = 'abcdefghijklmnopqrstuvwxyz';

const getRandomCharacter = () => chars[Math.round(Math.random() * (chars.length - 1 - 0) + 0)];

export default getRandomCharacter;
