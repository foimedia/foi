import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const Wrapper = styled.div`
  width: 100%;
  overflow: auto;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-top: ${styleUtils.margins[i]}rem;
    margin-bottom: ${styleUtils.margins[i]}rem;
  `)}
  table {
    width: 100%;
    color: #666;
    table-layout: auto;
    border-collapse: collapse;
    font-family: 'Inconsolata', monospace;
    overflow: auto;
    margin: 0;
    tr {
      margin: 0;
      padding: 0;
      &:first-child {
        th,
        td {
          padding-top: 0;
        }
      }
      &:last-child {
        th,
        td {
          border-bottom: 0;
          padding-bottom: 0;
        }
      }
    }
    th,
    td {
      border-bottom: 1px solid #eee;
      margin: 0;
      ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
        padding: ${styleUtils.margins[i]/2}rem;
      `)}
      &:first-child {
        padding-left: 0;
      }
    }
    th {
      text-align: left;
      text-transform: uppercase;
      white-space: nowrap;
    }
  }
`

export default class Table extends Component {
  render () {
    return (
      <Wrapper>
        <table>
          {this.props.children}
        </table>
      </Wrapper>
    )
  }
}
