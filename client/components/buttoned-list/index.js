import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';

const List = styled.ul`
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
  border: 1px solid ${styleUtils.color};
  border-radius: 5px;
  font-family: "Inconsolata";
  font-size: 1em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  ${styleUtils.media.desktop`
    border-radius: ${styleUtils.radius/2}px;
  `}
  li {
    margin: 0;
    padding: 0;
    span {
      display: block;
      padding: .75rem;
      border-bottom: 1px solid ${styleUtils.color};
    }
    .fa {
      font-weight: normal;
      float: right;
      font-size: 1.2em;
      line-height: 1.4;
      color: #ddd;
    }
    &:hover {
      .fa {
        color: #999;
        &:hover {
          color: ${styleUtils.color}
        }
      }
    }
    &:last-child {
      span {
        border-bottom: 0;
      }
    }
  }
  ${props => props.dark && css`
    border-color: #444;
    li span {
      border-color: #444;
      a {
        color: #f0f0f0;
        &:hover {
          color: ${styleUtils.color};
        }
      }
    }
  `}
`

export default List;
