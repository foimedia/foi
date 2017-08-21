import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';

const radius = styleUtils.radius/3 + 'px';

const styles = css`
  width: 100%;
  height: auto;
  line-height: 1.5;
  min-height: 0;
  display: block;
  font-family: 'Inconsolata', monospace;
  border-radius: ${radius};
  font-size: .9em;
  overflow: auto;
  white-space: normal;
  background: #f7f7f7;
  border: 1px solid #e7e7e7;
  color: #999;
  box-sizing: border-box;
  resize: none;
  outline: none;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-bottom: ${styleUtils.margins[i]}rem;
    padding: ${styleUtils.margins[i]/2}rem;
  `)}
  &:hover,
  &:active,
  &:focus {
    border-color: #d7d7d7;
  }
`

const SelectableWrapper = styled.span`
  display: block;
  position: relative;
  textarea.selectable {
    ${styles}
  }
  .clipboard {
    font-size: .6em;
    display: none;
    background: ${styleUtils.color};
    position: absolute;
    color: #fff;
    bottom: 2px;
    right: 2px;
    line-height: 100%;
    padding: .5rem;
    border-radius: ${radius} 0 ${radius} 0;
    cursor: pointer;
  }
  &:hover {
    .clipboard {
      display: block;
    }
  }
`

export const Code = styled.code`
  font-family: 'Inconsolata', monospace;
  background: #f7f7f7;
  color: #999;
  border-radius: 7px;
  font-size: .8em;
  padding: .2rem .5rem;
`

export const Pre = styled.pre`
  ${styles}
  code {
    background: transparent;
    padding: 0;
    font-size: inherit;
  }
`

export class SelectableCode extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClipboardClick = this.handleClipboardClick.bind(this);
  }
  handleClick () {
    const node = findDOMNode(this);
    node.childNodes[0].focus();
    node.childNodes[0].select();
  }
  handleClipboardClick () {
    this.handleClick();
    document.execCommand('copy');
  }
  render () {
    const { children, ...props} = this.props;
    return (
      <SelectableWrapper onClick={this.handleClick}>
        <textarea className="selectable" readOnly={true} {...props} defaultValue={children}></textarea>
        <a href="javascript:void(0);" title="Copy to clipboard" className="clipboard fa fa-clipboard" onClick={this.handleClipboardClick}></a>
      </SelectableWrapper>
    )
  }
}
