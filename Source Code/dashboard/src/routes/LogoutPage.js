import { Component } from "react";

export default class LogoutPage extends Component {
  state = {};

  componentDidMount() {
    this.props.cookies.remove('user')
    this.props.cookies.remove('role')
    this.props.history.push("/");
  }

  render() {
    return null;
  }
}
