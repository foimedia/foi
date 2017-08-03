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
    span.item {
      display: block;
      padding: .75rem;
      border-bottom: 1px solid ${styleUtils.color};
      a {
        .fa {
          margin-left: .5rem;
          font-size: .8em;
          opacity: .4;
        }
      }
    }
    .actions {
      float: right;
      .fa {
        font-weight: normal;
        font-size: 1.2em;
        line-height: 1.4;
        color: #ddd;
        &:hover,
        &:active,
        &:focus {
          color: ${styleUtils.color};
        }
      }
    }
    &:last-child {
      span.item {
        border-bottom: 0;
      }
    }
  }
  ${props => props.primary && css`
    background-color: ${styleUtils.color};
    li span.item {
      border-color: rgba(255,255,255,0.2);
      a {
        color: #fff;
      }
      .fa {
        color: #fff;
      }
    }
  `}
  ${props => props.dark && css`
    border-color: #444;
    li span.item {
      border-color: #444;
      a {
        color: #fff;
        &:hover,
        &:active,
        &:focus {
          color: #aaa;
        }
      }
    }
  `}
`

export default List;
