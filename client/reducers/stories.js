import actions, {
  STORY_NEW,
  STORY_UPDATE,
  STORY_REMOVE,
  STORY_GET_SUCCESS,
  STORY_PATCH_SUCCESS,
  STORY_REMOVE_SUCCESS
} from 'actions/stories';

import {
  POST_NEW,
  POST_REMOVE,
  POST_REMOVE_SUCCESS
} from 'actions/posts';

import {
  CHAT_STORIES_SUCCESS,
  CHAT_STORIES_EXPAND
} from 'actions/chats';

const initialState = {};

const initialStory = {};

export default function reducer (state = initialState, action) {
  switch(action.type) {
    case STORY_NEW :
    case STORY_UPDATE :
    case STORY_GET_SUCCESS :
    case STORY_PATCH_SUCCESS : {
      state = Object.assign({}, state);
      updateStory(state, action.id, action.data);
      updateStory(state, action.id, {
        posts: getItemsIds(state[action.id].posts)
      });
      return state;
    }
    case CHAT_STORIES_SUCCESS :
    case CHAT_STORIES_EXPAND : {
      if(action.res.data !== undefined) {
        state = Object.assign({}, state);
        updateFromArray(state, action.res.data);
        action.res.data.forEach(story => {
          updateStory(state, story.id, {
            posts: getItemsIds(state[story.id].posts)
          });
        });
      }
      return state;
    }
    case POST_NEW : {
      state = Object.assign({}, state);
      const storyId = action.data.storyId;
      const story = state[storyId];
      if(
        story !== undefined &&
        (!story.posts || !story.posts.some(id => id == action.id))
      ) {
        story.posts = [...(story.posts || []), action.id];
      }
      return state;
    }
    case POST_REMOVE :
    case POST_REMOVE_SUCCESS : {
      state = Object.assign({}, state);
      const storyId = action.data.storyId;
      const story = state[storyId];
      if(story !== undefined && story.posts && story.posts.length) {
        story.posts = story.posts.filter(id => id !== action.id);
      }
      return state;
    }
    case STORY_REMOVE :
    case STORY_REMOVE_SUCCESS : {
      if(state[action.id]) {
        state = Object.assign({}, state);
        delete state[action.id];
      }
      return state;
    }
    default:
      return state;
  }
}

const updateState = (state, newState = initialState) => {
  return Object.assign({}, state, newState);
};

const updateStory = (state, id, data = initialStory) => {
  state[id] = Object.assign({}, initialStory, state[id] || {}, data);
};

const getItemsIds = (items) => items.map(item => typeof item == 'string' ? item : item.id);

const updateFromArray = (state, data = []) => {
  data.forEach(story => {
    updateStory(state, story.id, story);
  });
  return state;
};
