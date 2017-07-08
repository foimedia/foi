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

function Message (message) {
  Object.assign(this, message);
};

Message.prototype.getCreator = function () {
  return this.forward_from ? this.forward_from.id : this.from.id;
};

Message.prototype.getCreatorSentAt = function () {
  return this.forward_date ? new Date(this.forward_date * 1000) : new Date(this.date * 1000);
};

Message.prototype.getEditedAt = function () {
  return this.edit_date ? new Date(this.edit_date * 1000) : new Date(this.date * 1000);
};

Message.prototype.getSentAt = function () {
  return new Date(this.date * 1000);
};

Message.prototype.getType = function () {
  let type;
  for(var key in this) {
    supportedTypes.forEach(supportedType => {
      if(key == supportedType) {
        type = key;
      }
    });
  }
  return type;
};

Message.prototype.hasEntity = function (entityType) {
  const entities = this.entities;
  let hasEntity = false;
  if(entities && entities.length) {
    entities.forEach(entity => {
      if(entity.type == entityType)
        hasEntity = true;
    });
  }
  return hasEntity;
};

Message.prototype.isBotCommand = function () {
  if(this.hasEntity('bot_command')) {
    // Any slash following a string receives the bot command entity
    if(this.text.indexOf('/') == 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

exports = module.exports = Message;
