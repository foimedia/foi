import React from 'react';
import ReactDom from 'react-dom';

import { Provider } from 'react-redux';
import { store } from 'services/feathers';

import Bundle from 'components/bundle';
import loadChatStories from 'bundle-loader?lazy!containers/chat-stories';

document.addEventListener('DOMContentLoaded', function() {
  const nodes = document.getElementsByClassName('foi-widget');
  if(nodes && nodes.length) {
    for(var i = 0; i < nodes.length; i++) {
      (function(i) {
        const node = nodes[i];
        const chatId = node.dataset.chat;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${foi.url}/chats/${chatId}`, true);
        xhr.send();
        xhr.addEventListener('load', function(res) {
          if(this.status == 200) {
            const props = {
              widgetChat: JSON.parse(res.target.response),
              more: node.dataset.more || 'button'
            };
            ReactDom.render(
              <Provider store={store}>
                <Bundle load={loadChatStories}>
                  {ChatStories => (
                    <ChatStories {...props} />
                  )}
                </Bundle>
              </Provider>,
              node
            );
          }
        });
      })(i);
    }
  }
});
