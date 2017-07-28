export function hasRole (auth, role) {
  if(auth.isSignedIn && Array.isArray(auth.user.roles)) {
    return auth.user.roles.indexOf(role) !== -1;
  } else {
    return false;
  }
}

export function hasUser(auth) {
  return auth.user !== null && !auth.user.anonymous;
}
