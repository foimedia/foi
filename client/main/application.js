import React, { Component } from 'react';
import Timeline from './timeline';
import { client } from './feathers';


const auth = (token = false) => {
  if(!token) {
    return client.authenticate().catch(() => {
      return client.authenticate({
        strategy: 'anonymous',
        accessToken: null
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
    const stories = client.service('stories');
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
      posts.find({
        query: {
          storyId: {
            $in: [false,undefined,null]
          },
          $sort: {
            sentAt: -1
          }
        }
      }).then(res => {
        const posts = res.data;
        this.setState({ posts });
      });
      stories.find({
        query: {
          $sort: {
            createdAt: -1
          }
        }
      }).then(res => {
        const stories = res.data;
        this.setState({ stories });
      });
    });

    // Add new post to the posts list
    posts.on('created', newPost => {
      if(!newPost.storyId) {
        this.state.posts.unshift(newPost);
        return this.setState({posts: this.state.posts});
      } else {
        this.state.stories.forEach((story, i) => {
          if(newPost.storyId == story.id) {
            this.state.stories[i].posts = this.state.stories[i].posts || [];
            this.state.stories[i].posts.push(newPost);
          }
        });
        return this.setState({stories: this.state.stories});
      }
    });
    posts.on('patched', patchedPost => {
      if(!patchedPost.storyId) {
        this.state.posts.forEach((post, i) => {
          if(patchedPost.id == post.id) {
            this.state.posts[i] = patchedPost;
          }
        });
      }
      return this.setState({posts: this.state.posts});
    });
    stories.on('created', newStory => {
      this.state.stories.unshift(newStory);
      return this.setState({stories: this.state.stories});
    });

    stories.on('patched', patchedStory => {
      this.state.stories.forEach((story, i) => {
        if(patchedStory.id == story.id) {
          this.state.stories[i] = patchedStory;
        }
      });
      return this.setState({stories: this.state.stories});
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
    const { stories, posts, payload, user } = this.state;
    if(posts === undefined || stories === undefined) {
      return <main>
        <h1>Loading</h1>
      </main>;
    } else if(!posts.length || !stories.length) {
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
        <Timeline stories={stories || []} posts={posts || []} />
      </main>
    }
  }

}

export default Application;
