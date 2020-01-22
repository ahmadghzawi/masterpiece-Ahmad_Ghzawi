import React from "react";

const Add = props => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <form onSubmit={props.add}>
          <div className="form-row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="username"
                name="username"
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="password"
                name="password"
                required
              />
            </div>
            <div className="col">
              <select className="custom-select" name="role">
                <option defaultValue>role (admin/owner)</option>
                <option value="admin">admin</option>
                <option value="owner">owner</option>
              </select>
            </div>
            <div className="col">
              <input
                type="submit"
                className="form-control btn btn-primary "
                name="add"
                value="ADD"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default Add;
