import { queryUserOrganizations } from './query-user-organizations';

const getUserOrganizations = async (userId: string) => {
  const userOrganizations = await queryUserOrganizations(userId);

  return userOrganizations;
};

export { getUserOrganizations };
