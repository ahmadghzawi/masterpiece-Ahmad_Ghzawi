import React, { Component } from "react";
import Container from "../components/Container";
import axios from "axios";
import Offer from "../components/Offer";

export default class ProductPage extends Component {
  state = {
    ...this.props.location.state,
    product: {},
    offers: []
  };

  UNSAFE_componentWillMount() {
    if (!this.props.cookies.get("user")) this.props.history.push("/");
  }

  componentDidMount = () => {
    this.getProductAndOffers();
  };

  getProductAndOffers = () => {
    let _id = this.state.productId;
    axios
      .get(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/getProduct/${_id}`
      )
      .then(({ data }) => {
        let product = {};
        let offers = [];
        for (let key in data) {
          if (typeof data[key] === "object") {
            offers.push({ [key]: data[key] });
          } else {
            product[key] = data[key];
          }
        }
        this.setState({ product, offers });
      })
      .catch(err => console.log(err));
  };

  deleteProduct = _id => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deletePost/${_id}`
      )
      .then(() => this.props.history.push("/dashboard"))
      .catch(err => console.log(err.message));
  };

  // deleteOffer = (buyer, _id) => {
  //   axios
  //     .put(
  //       "https://ard-w-talab-version-2.herokuapp.com/posts/API/deleteOffer",
  //       { buyer, _id }
  //     )
  //     .then(() => {
  //       let offers = this.state.offers.filter(
  //         offer => Object.keys(offer)[0] !== buyer
  //       );
  //       this.setState({ offers });
  //     })
  //     .catch(err => console.log(err.message));
  // };

  redirectToOfferPage = (buyer, offer) => {
    const { product, offers } = this.state;
    this.props.history.push({
      pathname: "/offer",
      state: { product, offers, buyer, offer }
    });
  };

  render() {
    const { product, offers, seller, users } = this.state;
    const offersToShow = offers.map((offer, index) => (
      <Offer
        key={index}
        data={offer}
        users={users}
        // deleteOffer={this.deleteOffer}
        product_id={product._id}
        redirectToOfferPage={this.redirectToOfferPage}
      />
    ));

    let prices = [];
    offers.forEach(offer =>
      prices.push(parseInt(Object.values(offer)[0].price))
    );
    prices = prices.sort((a, b) => b - a);
    const lowestPrice = prices[prices.length - 1];

    return (
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-12">
            <button
              className="btn btn-success float-left"
              onClick={() => this.props.history.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="btn btn-info float-right"
              onClick={() => this.props.history.push("/logout")}
            >
              LogOut
            </button>
          </div>
        </div>
        <hr />

        <div className="row mt-3">
          <Container
            className="col-md-12"
            title={"Owner: " + seller.name + " " + seller._id}
          >
            <div className="container-fluid">
              <div className="row mt-3 mb-3" style={{ fontSize: 20 }}>
                <div className="col-md-3">
                  <img
                    src={product.image_path}
                    alt={product.title}
                    title={product.title}
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <div className="col-md-1"></div>

                <div className="col-md-4 d-flex flex-column justify-content-around">
                  <p>
                    <b>Title:</b> {product.title}
                  </p>
                  <p>
                    <b>Category:</b> {product.product_category}
                  </p>
                  <p>
                    <b>Location:</b> {product.location}
                  </p>
                </div>
                <div className="col-md-4 d-flex flex-column justify-content-around">
                  <p>
                    <b>Info:</b> {product.info}
                  </p>
                  <p>
                    <b>Bid:</b> {product.bid} JOD
                  </p>
                  <p>
                    <b>Lowest Price:</b> {lowestPrice} JOD
                  </p>
                </div>

                <button
                  className="btn btn-danger position-absolute"
                  style={{ fontSize: 20, bottom: "10px", right: "25px" }}
                  onClick={() => this.deleteProduct(product._id)}
                >
                  DELETE
                </button>
              </div>
            </div>
          </Container>
        </div>

        <div className="row mt-3">
          <Container className="col-md-12" title="Offers">
            <div className="container-fluid">
              <div className="row mt-3 mb-3" style={{ fontSize: 20 }}>
                {offersToShow}
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
