import React, { Component } from 'react';
import styled from 'styled-components';
import client from '../main/feathers';

class PostMedia extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    const { data } = this.props;

  }

  getFileUrl() {
    const { data } = this.props;
    return '/files/' + data.file_id + '/' + data.file_name;
  }

  getMime() {
    const { data } = this.props;
    return data.mime_type;
  }

}

export default PostMedia;
