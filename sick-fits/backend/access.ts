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

// rule based functions - can return a boolean - yes or no - or a filter which limits which products they can CRUD

export const rules = {

  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    };
    // 1. do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    };
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    };
    // 1. do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    };
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    };
    // 1. do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    };
    // 2. if not, do they own this item?
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    };
    if (permissions.canManageProducts({ session })) {
      return true; //They can read everything!
    }
    // they should only see available products (based on the status field)
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    };
    if (permissions.canManageUsers({ session })) {
      return true;
    };
    // 2. Otherwise they may only update themselves!
    return { id: session.itemId };
  },
}