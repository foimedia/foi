import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import styleUtils from 'services/style-utils';

const maxWidth = 300;

const SidebarWrapper = styled.div`
  font-size: 1.2em;
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
    border-right: 1px solid #eee;
    > * {
      border-bottom: 1px solid #eee;
      padding-top: 1rem;
      padding-bottom: 1rem;
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
      h3 {
        margin: 0 0 .5rem;
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
    right: 0;
    background: #111;
    color: #fff;
    z-index: 10;
    line-height: 3rem;
    font-size: 1em;
    a {
      color: #fff;
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-left: ${styleUtils.margins[i]}rem;
      padding-right: ${styleUtils.margins[i]}rem;
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
    const nextUser = nextProps.auth.user;
    const thisUser = this.props.auth.user;
    if(nextProps.location !== this.props.location) {
      this.setState({
        active: false
      });
    }
    if(nextUser && !nextUser.anonymous && nextUser !== thisUser) {
      this.setState({
        active: true
      });
    }
    if(nextUser && nextUser.anonymous && nextUser !== thisUser) {
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

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default withRouter(connect(mapStateToProps)(Sidebar));
