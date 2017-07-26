import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import styleUtils from 'services/style-utils';

const SidebarWrapper = styled.div`
  position: relative;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-left: -${styleUtils.margins[i]}rem;
    margin-right: -${styleUtils.margins[i]}rem;
  `)}
  .sidebar-content {
    position: relative;
    z-index: 5;
    background: #222;
    color: #999;
    top: 0;
    left: 0;
    font-size: .8em;
    > * {
      border-bottom: 1px solid #333;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
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
        ${'' /* margin: 0 0 .5rem; */}
        color: #fff;
      }
    }
    img {
      max-width: 100%;
      height: auto;
    }
  }
  .sidebar-inner {
    display: none;
  }
  nav.sidebar-nav {
    line-height: 3rem;
    font-size: 1em;
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    a {
      color: #fff;
      background: #222;
      padding: .5rem;
      margin: -.5rem;
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-left: ${styleUtils.margins[i]}rem;
      padding-right: ${styleUtils.margins[i]}rem;
    `)}
  }
  &.active {
    .sidebar-inner {
      display: block;
    }
    nav.sidebar-nav {
      background: transparent;
    }
  }
  ${styleUtils.media.desktop`
    margin: 0;
    nav.sidebar-nav {
      display: none;
    }
    &.active .sidebar-content,
    .sidebar-content {
      width: 25%;
      position: fixed;
      bottom: 0;
      overflow: auto;
      .sidebar-inner {
        display: block;
      }
    }
  `}
  ${styleUtils.media.desktopHD`
    font-size: 1.2em;
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
    const { auth, children } = this.props;
    const { active } = this.state;
    if(this.hasChildren()) {
      return <SidebarWrapper id="sidebar" className={active ? 'active' : ''}>
        {(auth.user && !auth.user.anonymous) &&
          <nav className="sidebar-nav">
            <a className="toggle fa fa-bars" onClick={this.toggle} href="javascript:void(0);" title="Menu"></a>
          </nav>
        }
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
