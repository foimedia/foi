import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import styleUtils from '../style-utils';

const sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 200px;
  padding: 3rem 2rem;
  z-index: 10;
  font-size: .8em;
  border-right: 1px solid #ddd;
`;

export default sidebar;
