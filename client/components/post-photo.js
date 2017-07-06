import React, { Component } from 'react';
import styled from 'styled-components';
import PostMedia from './post-media';

class PostPhoto extends PostMedia {

  render() {
    const { data } = this.props;

    console.log(data);

    return <img src={this.getFileUrl()} />;
  }

}

export default PostPhoto;
