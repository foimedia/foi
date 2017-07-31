import { hasUser } from './auth';

export function canRemove (story, auth) {
  return hasUser(auth) && story.userId == auth.user.id;
}
