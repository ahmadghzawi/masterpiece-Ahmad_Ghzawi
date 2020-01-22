import React, { Component } from "react";

class Admin extends Component {
  state = { edit: false };

  edit = () => {
    this.props.editAdmin(
      this.props.data._id,
      this.usernameInput.value,
      this.passwordInput.value,
      this.roleInput.value
    );
    this.setState({ edit: false });
  };

  render() {
    const { _id, username, password, role } = this.props.data;
    return (
      <tr>
        {this.state.edit ? (
          <>
            <td>
              <input
                type="text"
                className="form-control"
                name="username"
                ref={username => (this.usernameInput = username)}
                defaultValue={username}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                name="password"
                ref={password => (this.passwordInput = password)}
                defaultValue={password}
              />
            </td>
            <td>
              <select
                className="custom-select"
                name="role"
                ref={role => (this.roleInput = role)}
              >
                <option defaultValue={role}>{role}</option>
                <option value={role === "owner" ? "admin" : "owner"}>
                  {role === "owner" ? "admin" : "owner"}
                </option>
              </select>
            </td>
            <td className="d-flex justify-content-center">
              <button className="btn btn-success mr-2" onClick={this.edit}>
                UPDATE
              </button>
              <button
                className="btn btn-warning ml-2"
                onClick={() => this.setState({ edit: false })}
              >
                CANCEL
              </button>
            </td>
          </>
        ) : (
          <>
            <td>{username}</td>
            <td>{password}</td>
            <td>{role}</td>
            <td className="d-flex justify-content-center">
              <button
                className="btn btn-info mr-2"
                onClick={() => this.setState({ edit: true })}
              >
                EDIT
              </button>
              <button
                className="btn btn-danger ml-2"
                onClick={() => this.props.deleteUser(_id)}
              >
                DELETE!
              </button>
            </td>
          </>
        )}
      </tr>
    );
  }
}

export default Admin;
