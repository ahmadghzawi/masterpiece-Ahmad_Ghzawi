import React from "react";

const User = props => (
  <tr>
    <td>{props.data.name}</td>
    <td>{props.data.email}</td>
    {props.role === "owner" ? <td>{props.data.password}</td> : null}
    <td>{props.data.phone_number}</td>

    <td>
      <button
        className="btn btn-danger ml-2"
        onClick={() => props.deleteUser(props.data._id)}
      >
        X
      </button>
    </td>
  </tr>
);

export default User;
