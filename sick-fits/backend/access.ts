// At it's simplest, access control is either a yes or no value depending on the user's session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(permissionsList.map(permission => [
  permission,
  function({ session }: ListAccessArgs) {
    return !!session?.data.role?.[permission]
  }
]));

// permissions check if someone meets a criteria - yes or no

export const permissions = {
  ...generatedPermissions,
  isAwesome({ session }: ListAccessArgs) {
    return session?.data.name.includes('mike');
  },
};

// export const permissions = {
//   canManageProducts({ session }) {
//     return session?.data.role?.canManageProducts;
//   },
//   canSeeOtherUsers({ session }) {
//     return session?.data.role?.canSeeOtherUsers;
//   },
//   canManageUsers({ session }) {
//     return session?.data.role?.canManageUsers;
//   },
//   canManageRoles({ session }) {
//     return session?.data.role?.canManageRoles;
//   },
//   canManageCart({ session }) {
//     return session?.data.role?.canManageCart;
//   },
//   canManageOrders({ session }) {
//     return session?.data.role?.canManageCart;
//   },
  
// };

// rule based functions 