export function getTitle (chat) {
  return chat.title || `${chat.first_name} ${chat.last_name}`.trim();
}

export function canManage (chat, user = false) {
  if(chat.type == 'private') {
    return true;
  } else {
    if(chat.all_members_are_administrators) {
      return true;
    } else if(Array.isArray(chat.admins) && user && chat.admins.indexOf(user.id) !== -1){
      return true;
    } else {
      return false;
    }
  }
}
