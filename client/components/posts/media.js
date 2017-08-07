import React, { Component } from 'react';
import styled from 'styled-components';

class PostMedia extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  getFile (index = null) {
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

  getFileUrl (index = null, thumb = false) {
    const file = thumb ? this.getFile(index).thumb : this.getFile(index);
    if(file !== undefined)
      return foi.url + '/files/' + file.file_id + '/' + file.file_name;
    else
      return '';
  }

  getMime (index = null) {
    const file = this.getFile(index);
    let mime;
    if(file !== undefined) {
      mime = file.mime_type;
    }
    return mime;
  }

}

export default PostMedia;
