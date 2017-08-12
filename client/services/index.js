import chats from './chats';
import stories from './stories';
import posts from './posts';

export default function init (store) {
  chats(store);
  stories(store);
  posts(store);
};
