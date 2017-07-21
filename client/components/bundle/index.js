import React, { Component } from 'react'

import Loader from 'components/loader';

export default class Bundle extends Component {

  contructor () {
    this.state = {
      // short for "module" but that's a keyword in js, so "mod"
      mod: null
    }
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
      mod: null
    })
    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render() {
    if(this.state.mod) {
      if(typeof this.props.children == 'function') {
        return this.props.children(this.state.mod);
      } else {
        return this.props.children;
      }
    } else {
      return <Loader size={20} />;
    }
  }
}
