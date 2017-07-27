import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';
import Loader from 'components/loader';

const StoriesWrapper = styled.section`
  .fade {
    transition: all 200ms ${styleUtils.transition};
  }
  .fade-entering, .fade-exited {
    transform: translate(0, -1.5rem);
    opacity: 0.01;
  }
  .fade-entered, .fade-exiting {
    transform: translate(0, 0);
    opacity: 1;
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
                <div className={`fade fade-${status}`}>
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
