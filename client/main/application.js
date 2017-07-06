import React, { Component } from 'react';
import Timeline from './timeline';
import { client } from './feathers';


const auth = (token = false) => {
  if(!token) {
    return client.authenticate().catch(() => {
      return client.authenticate({
        strategy: 'anonymous'
      });
    });
  } else {
    return client.logout().then(() => {
      return client.authenticate({
        strategy: 'jwt',
        accessToken: token
      });
    });
  }
};

class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    const posts = client.service('posts');
    const authorize = client.service('authorize');

    client.on('authenticated', data => {
      client.passport.verifyJWT(data.accessToken).then(payload => {
        console.log(payload);
        this.setState({
          payload: payload,
          user: payload.user
        });
      });
    });

    authorize.on('created', data => {
      auth(data.accessToken);
    });

    auth().then(() => {
      return posts.find({
        query: {
          $sort: {
            sentAt: -1
          }
        }
      }).then(postPage => {
        const posts = postPage.data;
        this.setState({ posts });
      });
    });

    // Add new post to the posts list
    posts.on('created', newPost => {
      this.state.posts.unshift(newPost);
      return this.setState({posts: this.state.posts});
    });

    posts.on('patched', patchedPost => {
      this.state.posts.forEach((post, i) => {
        if(patchedPost.id == post.id) {
          this.state.posts[i] = patchedPost;
        }
      });
      return this.setState({posts: this.state.posts});
    });

  }

  logout() {
    this.setState({
      payload: undefined,
      user: undefined
    });
    client.logout().then(() => {
      client.authenticate({
        strategy: 'anonymous',
        acesssToken: null
      });
    });
  }

  render() {
    const { posts, payload, user } = this.state;
    if(posts === undefined) {
      return <main>
        <h1>Loading</h1>
      </main>;
    } else if(!posts.length) {
      return <main>
        <h1>No posts were found</h1>
      </main>;
    } else {
      return <main>
        {(user === undefined && payload !== undefined) &&
          <a href={`https://telegram.me/QAPBot?start=${payload.key}`} target="_blank">Authenticate</a>
        }
        {user !== undefined &&
          <div>
            <h2>Hello, {user.first_name}.</h2>
            <a href="javascript:void(0);" onClick={this.logout.bind(this)}>Logout</a>
          </div>
        }
        <Timeline posts={posts} />
      </main>
    }
  }

}

export default Application;
