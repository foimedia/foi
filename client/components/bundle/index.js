import React, { Component } from 'react'

export default class Bundle extends Component {

  constructor (props) {
    super(props);
    this.state = {
      mod: null
    }
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.load !== this.props.load) {
      this.load(this.props)
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
      return null;
    }
  }
}
