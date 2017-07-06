const getCreator = msg => {
  return msg.forward_from ? msg.forward_from.id : msg.from.id;
};
const getCreatorSentAt = msg => {
  return msg.forward_date ? new Date(msg.forward_date * 1000) : new Date(msg.date * 1000);
}
const getMessageEditedAt = msg => {
  return msg.edit_date ? new Date(msg.edit_date * 1000) : new Date(msg.date * 1000);
};
const getSentAt = msg => {
  return new Date(msg.date * 1000);
};

const supportedTypes = [
  'text',
  'photo',
  'audio',
  'document',
  'sticker',
  'video',
  'voice',
  'video_note',
  'contact',
  'location',
  'venue'
];

function getType (msg) {
  let detected;
  for(var key in msg) {
    supportedTypes.forEach(type => {
      if(key == type) {
        detected = key;
      }
    });
  }
  return detected;
};

function hasEntity (msg, entityType) {
  const entities = msg.entities;
  let hasEntity = false;
  if(entities && entities.length) {
    entities.forEach(entity => {
      if(entity.type == entityType)
        hasEntity = true;
    });
  }
  return hasEntity;
};

function isBotCommand(msg) {
  if(hasEntity(msg, 'bot_command')) {
    // Any slash following a string receives the bot command entity
    if(msg.text.indexOf('/') == 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

function parse (msg) {
  const type = getType(msg);
  if(type !== undefined && !isBotCommand(msg)) {
    const post = {
      id: msg.message_id,
      sentAt: getSentAt(msg),
      creatorSentAt: getCreatorSentAt(msg),
      editedAt: getMessageEditedAt(msg),
      type: type,
      content: msg[type],
      mediaId: msg[type].file_id,
      userId: msg.from.id,
      chatId: msg.chat.id,
      creatorId: getCreator(msg)
    };
    return post;
  }
  return false;
};

module.exports = function () {
  return {
    supportedTypes,
    hasEntity,
    parse
  };
};
