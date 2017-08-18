import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const Body = styled.div`
  max-width: 700px;
  padding: 0 .75rem;
  ${styleUtils.media.tablet`
    padding: 0;
  `}
`;

export default Body;
