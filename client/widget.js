import React from 'react';
import ReactDom from 'react-dom';

import { Provider } from 'react-redux';

import configureStore from 'store';
import { loadChat } from 'actions/chats';
import client from 'services/feathers';
import initServices from 'services';

import 'styles';

import Bundle from 'components/bundle';
import loadChatGallery from 'bundle-loader?lazy!containers/chat-gallery';
import loadChatStories from 'bundle-loader?lazy!containers/chat-stories';

window._foi = window._foi || {
  initialized: false
};
const init = function () {
  if(!_foi.initialized) {
    _foi.store = configureStore(store => {
      initServices(store);
      _foi.initialized = true;
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const nodes = document.getElementsByClassName('foi-widget');
  if(nodes && nodes.length) {
    for(var i = 0; i < nodes.length; i++) {
      (function(i) {
        const node = nodes[i];
        const chatId = node.dataset.chat;
        init();
        _foi.store.dispatch(loadChat(chatId));
        const initChat = () => {
          const { chats } = _foi.store.getState();
          if(chats[chatId]) {
            const chat = chats[chatId];
            unsubscribe();
            const props = {
              chat: chat,
              gallery: node.dataset.gallery !== undefined ?
                (node.dataset.gallery === 'false' ? false : true) :
                !chat.hideGallery,
              more: node.dataset.more || 'button'
            };
            console.log(props);
            ReactDom.render(
              <Provider store={_foi.store}>
                <div>
                  {props.gallery &&
                    <Bundle load={loadChatGallery}>
                      {ChatGallery => (
                        <ChatGallery {...props} />
                      )}
                    </Bundle>
                  }
                  <Bundle load={loadChatStories}>
                    {ChatStories => (
                      <ChatStories {...props} />
                    )}
                  </Bundle>
                </div>
              </Provider>,
              node
            );
          }
        }
        let unsubscribe = _foi.store.subscribe(initChat);
      })(i);
    }
  }
});
