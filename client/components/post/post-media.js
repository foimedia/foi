import React, { Component } from 'react';
import styled from 'styled-components';

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
    let file;
    if(Array.isArray(data)) {
      file = data[data.length-1];
    } else {
      file = data;
    }
    return '/files/' + file.file_id + '/' + file.file_name;
  }

  getMime() {
    const { data } = this.props;
    return data.mime_type;
  }

}

export default PostMedia;
