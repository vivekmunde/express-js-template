import { TListParams } from '@/types/list-params';
import { Role } from '@prisma/client';

const filterRoles = (roles: Role[], args: TListParams<'name'>): Role[] => {
  const searchRegEx = args.search ? new RegExp(args.search, 'ig') : undefined;
  const searchedRoles = searchRegEx ? roles.filter((role) => searchRegEx.test(role.name)) : roles;
  return searchedRoles;
};

const paginateRoles = (roles: Role[], args: TListParams<'name'>): Role[] => {
  return roles.slice((args.page - 1) * args.size, args.page * args.size);
};

const sortRoles = (roles: Role[], args: TListParams<'name'>): Role[] => {
  const sortedRoles = roles.sort((a, b) => {
    const aVal = a[args.sortBy ?? 'name'];
    const bVal = b[args.sortBy ?? 'name'];
    return args.sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
  });

  return sortedRoles;
};

export { filterRoles, paginateRoles, sortRoles };
