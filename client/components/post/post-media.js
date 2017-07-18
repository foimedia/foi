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
    if(data !== undefined) {
      if(Array.isArray(data)) {
        index = index || data.length - 1;
        file = data[index];
      } else {
        file = data;
      }
    }
    return file;
  }

  getFileUrl(index = null) {
    const file = this.getFile(index);
    if(file !== undefined)
      return '/files/' + file.file_id + '/' + file.file_name;
    else
      return '';
  }

  getMime() {
    const { data } = this.props;
    let mime;
    if(data !== undefined) {
      mime = data.mime_type;
    }
    return mime;
  }

}

export default PostMedia;
