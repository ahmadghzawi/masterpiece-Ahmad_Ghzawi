import React, { Component } from "react";
import Add from "../components/Add";
import Container from "../components/Container";
import Admin from "../components/Admin";
import axios from "axios";
import User from "../components/User";
import Product from "../components/Product";

export default class DashboardPage extends Component {
  state = {
    admins: [],
    users: [],
    products: [],
    selectedProducts: [],
    selectedCategory: "All Categories",
    categories: [],
    username: "",
    password: "",
    role: "",
    edit: null,
    msg:
      "Username:\n" +
      "\t\t\tmust be at least 3 characters long without spaces\n" +
      "\n" +
      "Password:\n" +
      "\t\t\tmust be at least 8 characters long\n" +
      "\t\t\tmust contain at least one digit\n" +
      "\t\t\tmust contain at least one lower case\n" +
      "\t\t\tmust contain at least one upper case\n"
  };

  UNSAFE_componentWillMount() {
    if (!this.props.cookies.get("user")) this.props.history.push("/");
  }

  componentDidMount = async () => {
    await this.getUsers();
    await this.getProductsAndCategories();
  };

  getUsers = async () => {
    await axios
      .get("https://ard-w-talab-version-2.herokuapp.com/users/API/data")
      .then(async res => {
        let admins = [];
        let users = [];
        res.data.forEach(user => {
          if (!user.username) users.push(user);
          else admins.push(user);
        });
        await this.setState({ admins, users });
      })
      .catch(err => console.log(err));
  };

  getProductsAndCategories = async () => {
    await axios
      .get("https://ard-w-talab-version-2.herokuapp.com/posts/API/data")
      .then(async res => {
        await this.setState({
          products: res.data.products,
          selectedProducts: res.data.products,
          categories: res.data.categories
        });
      })
      .catch(err => console.log(err));
  };

  getCategories = () => {
    let categories = {};
    this.state.products.forEach(product => {
      let key = product.product_category;
      if (!categories[key]) categories[key] = 1;
    });
    categories = Object.keys(categories);
    this.setState({ categories });
  };

  getProductsByCategory = event => {
    event.preventDefault();
    let selectedCategory = event.target.value;
    if (selectedCategory === "All Categories") {
      this.setState({
        selectedCategory,
        selectedProducts: [...this.state.products]
      });
    } else {
      let selectedProducts = this.state.products.filter(
        product => product.product_category === selectedCategory
      );
      this.setState({ selectedProducts, selectedCategory });
    }
  };

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

  add = async event => {
    event.preventDefault();
    if (event.target["role"].value !== "role (admin/owner)") {
      this.state.username = event.target["username"].value;
      this.state.password = event.target["password"].value;
      this.state.role = event.target["role"].value;
      await this.removeSpace();

      const { username, password, role } = this.state;

      if (this.checkForm())
        axios
          .post(
            "https://ard-w-talab-version-2.herokuapp.com/users/API/dashboardAdd",
            { username, password, role }
          )
          .then(async res => {
            if (res.data !== "user already exists") {
              let admins = [
                ...this.state.admins,
                { _id: res.data._id, username, password, role }
              ];
              this.setState({ admins});
            } else alert(res.data);
          })
          .catch(err => console.log(err.message));
      else alert(this.state.msg);
    } else alert("Kindly, select a role!");
  };

  checkForm = () => {
    const { username, password } = this.state;

    const regUsername = /^[a-zA-Z][^\s#&<>"~;.=+*!@%^&()[\]/,$^%{}?123456789]{2,29}$/;
    const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    const usernameTest = regUsername.test(username);
    const passwordTest = regPassword.test(password);

    if (usernameTest && passwordTest) return true;
    return false;
  };

  editAdmin = async (_id, usernameInput, passwordInput, roleInput) => {
    this.state.username = usernameInput;
    this.state.password = passwordInput;
    this.state.role = roleInput;
    await this.removeSpace();
    const { username, password, role } = this.state;

    if (this.checkForm())
      axios
        .post(
          "https://ard-w-talab-version-2.herokuapp.com/users/API/editAdmin",
          { _id, username, password, role }
        )
        .then(() => {
          let admins = this.state.admins.filter(user => user._id !== _id);
          this.setState({
            admins: [...admins, { _id, username, password, role }]
          });
        })
        .catch(err => console.log(err.message));
    else alert(this.state.msg);
  };

  deleteProducts = _id => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deleteUserPosts/${_id}`
      )
      .then(async res => {
        let products = this.state.products.filter(
          product => product.seller_id !== _id
        );
        let selectedProducts = this.state.selectedProducts.filter(
          product => product.seller_id !== _id
        );
        await this.setState({ products, selectedProducts });
        this.getCategories();
      })
      .catch(err => console.log(err));
  };

  deleteUser = _id => {
    let user = this.state.admins.filter(user => user._id === _id);
    if (user.length === 0) {
      console.log(_id);
      this.deleteProducts(_id);
    }

    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/users/API/delete/${_id}`
      )
      .then(() => {
        let admins = this.state.admins.filter(user => user._id !== _id);
        let users = this.state.users.filter(user => user._id !== _id);
        this.setState({ admins, users });
      })
      .catch(err => console.log(err.message));
  };

  deleteProduct = _id => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deletePost/${_id}`
      )
      .then(async () => {
        let products = this.state.products.filter(
          product => product._id !== _id
        );
        let selectedProducts = this.state.selectedProducts.filter(
          product => product._id !== _id
        );
        await this.setState({ products, selectedProducts });
        this.getCategories();
      })
      .catch(err => console.log(err.message));
  };

  redirectToProductPage = productInfo => {
    let { users } = this.state;
    let seller = this.state.users.filter(
      user => user._id === productInfo.seller_id
    );
    seller = seller[0];
    this.props.history.push({
      pathname: "/product",
      state: { seller, users, productId : productInfo._id }
    });
  };

  render() {
    const { role } = this.props.cookies.cookies;
    const {
      admins,
      users,
      selectedProducts,
      categories,
      msg,
      selectedCategory,
      username,
      password
    } = this.state;

    const adminsToShow = admins.map(admin => (
      <Admin
        key={admin._id}
        data={admin}
        editAdmin={this.editAdmin}
        deleteUser={this.deleteUser}
        msg={msg}
      />
    ));

    const usersToShow = users.map(user => (
      <User
        key={user._id}
        data={user}
        deleteUser={this.deleteUser}
        role={role}
      />
    ));

    const productsToShow = selectedProducts.map(product => (
      <Product
        key={product._id}
        data={product}
        deleteProduct={this.deleteProduct}
        redirectToProductPage={this.redirectToProductPage}
      />
    ));

    const categoriesToSelect = categories.map((category, index) => (
      <option key={index} value={category}>
        {category}
      </option>
    ));

    if (this.props.location.state !== undefined) return null;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8 mt-3">
            {role === "owner" && <Add add={this.add}/>}
          </div>
          <div className="col-md-2 mt-3">
          <button
              className="btn btn-info float-right"
              onClick={() => this.props.history.push("/logout")}
            >
              LogOut
            </button>
          </div>
        </div>
        {role === "owner" && (
          <div className="row mt-4">
            <Container
              className="col-md-12"
              title="Admins & Owners"
              height="400px"
            >
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Password</th>
                    <th scope="col">Role</th>
                    <th scope="col" className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>{adminsToShow}</tbody>
              </table>
            </Container>
          </div>
        )}

        <hr />
        <div className="row">
          <Container className="col-md-6 mt-4" title="Users">
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Full Name</th>
                  <th scope="col">Email</th>
                  {role === "owner" ? <th scope="col">Password</th> : null}
                  <th scope="col">Phone No.</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>{usersToShow}</tbody>
            </table>
          </Container>

          <Container className="col-md-6 mt-4 mb-4" title="Products">
            <select
              className="custom-select"
              name="role"
              defaultValue={selectedCategory}
              onChange={event => this.getProductsByCategory(event)}
            >
              <option defaultValue="All Categories">All Categories</option>
              {categoriesToSelect}
            </select>
            {productsToShow}
          </Container>
        </div>
      </div>
    );
  }
}
