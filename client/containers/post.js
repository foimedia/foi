import React, { Component } from 'react';
import client from 'services/feathers';
import Loader from 'components/loader';
import PostComponent from 'components/posts';

class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      post: undefined
    };
    this.service = client.service('posts');
    this.updatePost = this.updatePost.bind(this);
  }

  updatePost (newPost) {
    const { post } = this.props;
    if(newPost.id == post.id) {
      this.setState({ post: newPost });
    }
  }

  componentDidMount() {
    const { post } = this.props;
    this.setState({ post: Object.assign({}, post) });
    this.service.on('patched', this.updatePost);
    this.service.on('updated', this.updatePost);
  }

  componentWillUnmount () {
    this.service.off('patched', this.updatePost);
    this.service.off('updated', this.updatePost);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.post !== this.state.post;
  }

  render() {

    const { post } = this.state;

    if(post == undefined) {
      return <Loader size={20} />;
    } else {
      return <PostComponent post={post} />;
    }
  }

}

export default Post;
