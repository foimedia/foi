import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';

const StoriesWrapper = styled.section`
  .story-fade {
    transition: all 200ms ${styleUtils.transition};
  }
  .story-fade.fade-entering, .story-fade.fade-exiting {
    transform: translate(0, -1.5rem);
    opacity: 0.01;
  }
  .story-fade.fade-entered {
    transform: translate(0, 0);
    opacity: 1;
  }
  .story-fade.fade-exited {
    display: none;
  }
`;

class Stories extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    const { children } = this.props;
    const childrenArray = Array.isArray(children) ? children : [children];
    return (
      <StoriesWrapper className="stories">
        <TransitionGroup>
          {childrenArray.map((child, i) =>
            <Transition key={child.key} timeout={200}>
              {(status) => (
                <div className={`story-fade fade-${status}`}>
                  {child}
                </div>
              )}
            </Transition>
          )}
        </TransitionGroup>
      </StoriesWrapper>
    );
  }
}

export default Stories;
