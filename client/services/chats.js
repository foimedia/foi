import { hasRole } from 'services/auth';

export function getTitle (chat) {
  return chat.title || `${chat.first_name} ${chat.last_name}`.trim();
}

export function canManage (chat, auth = false) {
  if(chat.type == 'private' || hasRole(auth, 'admin')) {
    return true;
  } else {
    if(chat.all_members_are_administrators) {
      return true;
    } else if(Array.isArray(chat.admins) && auth.user && chat.admins.indexOf(auth.user.id) !== -1){
      return true;
    } else {
      return false;
    }
  }
}
