import React, { Component } from "react";
import axios from "axios";

export default class LoginPage extends Component {
  state = {
    username: "",
    password: "",
    usernameMsg: null,
    passwordMsg: null,
    invalid: null
  };

  UNSAFE_componentWillMount() {
    if (this.props.cookies.get("user")) this.props.history.push("/dashboard");
  }

  removeSpace = () => {
    for (let key in this.state) {
      if (typeof this.state[key] === "string") {
        let value = this.state[key];
        while (value[value.length - 1] === " ") {
          value = value.slice(0, -1);
        }
        this.setState({ [key]: value });
      }
    }
  };

  submitForm = async event => {
    event.preventDefault();
    this.state.username = event.target["username"].value;
    this.state.password = event.target["password"].value;
    await this.removeSpace();
    const { username, password } = this.state;

    if (this.checkForm())
      axios
        .post(
          "https://ard-w-talab-version-2.herokuapp.com/users/API/dashboardLogin",
          { username, password }
        )
        .then(async res => {
          if (res.data !== null) {
            const { _id, role } = res.data;
            await this.props.cookies.set("user", _id, { path: "/" });
            await this.props.cookies.set("role", role, { path: "/" });
            this.props.history.push("/dashboard");
          } else {
            this.setState({
              usernameMsg: null,
              passwordMsg: null,
              invalid: (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  Invalid Email or Password
                </p>
              )
            });
          }
        })
        .catch(err => console.log(err.message));
  };

  checkForm = () => {
    const { username, password } = this.state;

    const regUsername = /^[a-zA-Z][^\s#&<>"~;.=+*!@%^&()[\]/,$^%{}?123456789]{2,29}$/;
    const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    const usernameTest = regUsername.test(username);
    const passwordTest = regPassword.test(password);

    if (usernameTest && passwordTest) return true;

    if (!usernameTest)
      this.setState({
        invalid: null,
        usernameMsg: (
          <ul style={{ color: "red", textAlign: "left" }}>
            Username is Invalid!
            <li>must be at least 3 characters long without spaces</li>
          </ul>
        )
      });
    else this.setState({ usernameMsg: null });

    if (!passwordTest)
      this.setState({
        invalid: null,
        passwordMsg: (
          <ul style={{ color: "red", textAlign: "left" }}>
            Password is Invalid! <li>must be at least 8 characters long</li>
            <li>must contain at least one digit</li>
            <li>must contain at least one lower case</li>
            <li>must contain at least one upper case</li>
          </ul>
        )
      });
    else this.setState({ passwordMsg: null });

    return false;
  };

  render() {
    return (
      <div className="login-form">
        <form onSubmit={this.submitForm} method="post">
          <h2 className="text-center font-weight-bold">3ard w Talab</h2>
          <h4 className="text-center">Dashboard</h4>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              required
              name="username"
            />
            {this.state.usernameMsg}
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              required
              name="password"
            />
            {this.state.passwordMsg}
          </div>
          <div className="form-group">
            {this.state.invalid}
            <button type="submit" className="btn btn-dark btn-block">
              Log in
            </button>
          </div>
        </form>
      </div>
    );
  }
}
