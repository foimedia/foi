import React from 'react';
import ReactDom from 'react-dom';
import Bundle from 'components/bundle';
import loadStories from 'bundle-loader?lazy!./components/stories';

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
            const query = {
              chatId: chatId
            };
            ReactDom.render(
              <Bundle load={loadStories}>
                {Stories => (
                  <Stories query={query} />
                )}
              </Bundle>,
              node
            );
          }
        });
      })(i);
    }
  }
});
