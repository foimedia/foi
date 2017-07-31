import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const Form = styled.form`
  width: 100%;
  margin: 0;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    p {
      margin-bottom: ${styleUtils.margins[i]}rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
    input,
    textarea {
      margin-top: ${styleUtils.margins[i]/2}rem;
    }
  `)}
  p.form-actions {
    text-align: right;
  }
  label {
    font-family: "Inconsolata", monospace;
    color: #666;
  }
  input[type=text],
  input[type=password],
  input[type=email],
  textarea {
    outline: none;
    font-family: "Helvetica", "Open Sans", "Arial", sans-serif;
    line-height: 1.5;
    color: #333;
    border-radius: ${styleUtils.radius/3}px;
    border: 1px solid #ddd;
    width: 100%;
    box-sizing: border-box;
    display: block;
    padding: .7rem;
    &:hover {
      border-color: #bbb;
    }
    &:active,
    &:focus {
      border-color: ${styleUtils.color};
    }
  }
  textarea {
    min-height: 100px;
  }
`

export default Form;
