import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import styleUtils from 'services/style-utils';

const maxWidth = 300;

const SidebarWrapper = styled.div`
  .sidebar-content {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    background: #fff;
    width: 0;
    bottom: 0;
    overflow: auto;
    font-size: .8em;
    border-right: 1px solid #ddd;
    > * {
      border-bottom: 1px solid #ddd;
      padding-top: 2rem;
      padding-bottom: 2rem;
      margin: 0;
      max-width: 100%:
      box-sizing: border-box;
      ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
        padding-left: ${styleUtils.margins[i]}rem;
        padding-right: ${styleUtils.margins[i]}rem;
      `)}
      &:last-child {
        border-bottom: 0;
      }
    }
    img {
      max-width: 100%;
      height: auto;
    }
  }
  nav.sidebar-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    line-height: 4rem;
    font-size: 1em;
    a {
      color: #333;
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-left: ${styleUtils.margins[i]}rem;
      margin-right: ${styleUtils.margins[i]}rem;
    `)}
  }
  &.active {
    .sidebar-content {
      width: 100%;
    }
  }
  ${styleUtils.media.desktop`
    nav.sidebar-nav {
      display: none;
    }
    &.active .sidebar-content,
    .sidebar-content {
      width: 20%;
      max-width: ${maxWidth}px;
      min-width: 225px;
    }
  `}
`;

class Sidebar extends Component {

  constructor (props) {
    super(props);
    this.state = {
      active: false
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.location !== this.props.location) {
      this.setState({
        active: false
      });
    }
  }

  toggle () {
    const { active } = this.state;
    if(active) {
      this.setState({active: false});
    } else {
      this.setState({active: true});
    }
  }

  hasChildren () {
    const { children } = this.props;
    return children !== undefined;
  }

  render () {
    const { children } = this.props;
    const { active } = this.state;
    if(this.hasChildren()) {
      return <SidebarWrapper id="sidebar" className={active ? 'active' : ''}>
        <nav className="sidebar-nav">
          <a className="toggle fa fa-bars" onClick={this.toggle} href="javascript:void(0);" title="Menu"></a>
        </nav>
        <div className="sidebar-content">
          {children}
        </div>
      </SidebarWrapper>;
    } else {
      return null;
    }
  }

};

export default withRouter(Sidebar);
