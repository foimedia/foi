import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import styleUtils from 'services/style-utils';

const SidebarWrapper = styled.div`
  position: relative;
  h3 {
    color: #fff;
  }
  nav.sidebar-nav {
    font-size: 1em;
    line-height: 1.5rem;
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    a {
      color: #fff;
      background: #222;
      line-height: 1.5rem;
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-top: ${styleUtils.margins[i]}rem;
      padding-right: ${styleUtils.margins[i]*2}rem;
      a {
        padding: ${styleUtils.margins[i]}rem;
        margin -${styleUtils.margins[i]}rem;
      }
    `)}
  }
  &.active {
    .sidebar-content .inner {
      display: block;
    }
    nav.sidebar-nav {
      background: transparent;
    }
  }
  .sidebar-content {
    position: relative;
    z-index: 5;
    background: #222;
    color: #999;
    top: 0;
    left: 0;
    font-size: .8em;
    line-height: 1.5rem;
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-left: ${styleUtils.margins[i]}rem;
      padding-right: ${styleUtils.margins[i]}rem;
    `)}
    > * {
      float: left;
      line-height: 1.5rem;
      display: inline-block;
      box-sizing: border-box;
      ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
        padding: ${styleUtils.margins[i]}rem;
      `)}
      &:last-child {
        border-bottom: 0;
      }
    }
    .inner {
      display: none;
      float: none;
    }
    img {
      max-width: 100%;
      height: auto;
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
      padding: 0;
      overflow: auto;
      line-height: 1.5;
      > * {
        float: none;
        display: block;
        border-bottom: 1px solid #333;
        line-height: 1.5;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .inner {
        display: block;
      }
    }
  `}
  ${styleUtils.media.desktopHD`
    font-size: 1.2em;
    .sidebar-content {
      > * {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
        padding-left: 2rem;
        padding-right: 2rem;
      }
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
      return (
        <SidebarWrapper id="sidebar" className={active ? 'active' : ''}>
          {(auth.user && !auth.user.anonymous) &&
            <nav className="sidebar-nav">
              <a className="toggle fa fa-bars" onClick={this.toggle} href="javascript:void(0);" title="Menu"></a>
            </nav>
          }
          <div className="sidebar-content">
            {children}
          </div>
        </SidebarWrapper>
      )
    } else {
      return null;
    }
  }

};

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default withRouter(connect(mapStateToProps)(Sidebar));
