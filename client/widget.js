import React from 'react';
import ReactDom from 'react-dom';

// import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'services/feathers';

import Bundle from 'components/bundle';
import loadChat from 'bundle-loader?lazy!scenes/chat';

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
        xhr.addEventListener('load', function() {
          if(this.status == 200) {
            const props = {
              chatId: chatId,
              header: false
            };
            ReactDom.render(
              <Provider store={store}>
                <Bundle load={loadChat}>
                  {Chat => (
                    <Chat {...props} />
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
