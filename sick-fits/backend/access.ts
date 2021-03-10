// At it's simplest, access control is either a yes or no value depending on the user's session

import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}