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

  getFile(index = null) {
    const { data } = this.props;
    let file;
    if(Array.isArray(data)) {
      index = index || data.length - 1;
      file = data[index];
    } else {
      file = data;
    }
    return file;
  }

  getFileUrl(index = null) {
    const file = this.getFile(index);
    return '/files/' + file.file_id + '/' + file.file_name;
  }

  getMime() {
    const { data } = this.props;
    return data.mime_type;
  }

}

export default PostMedia;
