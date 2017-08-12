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

window.foiInitialized = false;
const init = function () {
  if(!window.foiInitialized || window.foiInitialized == undefined) {
    window.foiStore = configureStore();
    initServices(foiStore);
    window.foiInitialized = true;
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
        window.foiStore.dispatch(loadChat(chatId));
        const initChat = () => {
          const { chats } = window.foiStore.getState();
          if(chats[chatId]) {
            const chat = chats[chatId];
            unsubscribe();
            const props = {
              chat: chat,
              hideGallery: !node.dataset.gallery || chat.hideGallery,
              more: node.dataset.more || 'button'
            };
            ReactDom.render(
              <Provider store={window.foiStore}>
                <div>
                  {props.displayGallery &&
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
        let unsubscribe = window.foiStore.subscribe(initChat);
      })(i);
    }
  }
});
