import React, { Component } from "react";
import Container from "../components/Container";
// import axios from "axios";

export default class OfferPage extends Component {
  state = {
    ...this.props.location.state
  };

  UNSAFE_componentWillMount() {
    if (!this.props.cookies.get("user")) this.props.history.push("/");
  }

  // deleteOffer = () => {
  //   const buyer = this.state.buyer._id;
  //   const _id = this.state.product._id;
  //   axios
  //     .put(
  //       "https://ard-w-talab-version-2.herokuapp.com/posts/API/deleteOffer",
  //       { buyer, _id }
  //     )
  //     .then(() => {
  //       this.props.history.goBack();
  //     })
  //     .catch(err => console.log(err.message));
  // };

  render() {
    const { product, offers, buyer, offer } = this.state;

    let prices = [];
    offers.forEach(offer =>
      prices.push(parseInt(Object.values(offer)[0].price))
    );
    prices = prices.sort((a, b) => b - a);
    const highestPrice = prices[0];
    const lowestPrice = prices[prices.length - 1];
    const rank = prices.indexOf(parseInt(offer.price)) + 1;

    const dateStamp = offer.date.split(" ");
    const date =
      dateStamp[0] +
      " " +
      dateStamp[1] +
      " " +
      dateStamp[2] +
      " " +
      dateStamp[3];
    const time = dateStamp[4] + " " + dateStamp[5];

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
              className="btn btn-primary float-left ml-3"
              onClick={() => this.props.history.goBack()}
            >
              Product
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
            title={"From: " + buyer.name + " " + buyer._id}
          >
            <div className="container-fluid">
              <div className="row mt-3 mb-3" style={{ fontSize: 20 }}>
                <div className="col-md-3"></div>

                <div className="col-md-4">
                  <p className="mt-3">
                    <b>Price:</b> {offer.price} JOD
                  </p>
                  <p className="mt-3">
                    <b>Date:</b> {date}
                  </p>
                  <p className="mt-3">
                    <b>Time:</b> {time}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mt-3">
                    <b>Offer Rank:</b> {rank}
                  </p>
                  <p className="mt-3">
                    <b>Lowest Price:</b> {lowestPrice} JOD
                  </p>
                  <p className="mt-3">
                    <b>Highest Price:</b> {highestPrice} JOD
                  </p>
                </div>
                {/* <div className="col-md-1">
                  <button
                    className="btn btn-danger position-absolute"
                    style={{ fontSize: 20, bottom: "10px", right: "25px" }}
                    onClick={this.deleteOffer}
                  >
                    DELETE
                  </button>
                </div> */}
              </div>
            </div>
          </Container>
        </div>

        <div className="row mt-3 mb-3">
          <Container className="col-md-12" title="Product">
            <div className="container-fluid">
              <div className="row mt-3 mb-3">
                <div className="card m-3 ">
                  <div className="row no-gutters" style={{height: '450px'}}>
                    <div className="col-md-5">
                      <img
                        src={product.image_path}
                        className="card-img"
                        style={{objectFit: 'cover', height: '450px'}}
                        alt={product.title}
                      />
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-6">
                      <div className="card-body d-flex flex-column justify-content-around " style={{fontSize: 25, height: '450px'}}>
                        <h5 className="card-title mb-5" style={{fontSize: 30}}>
                          <b>{product.title}</b>
                        </h5>
                        <p className="card-text mt-5">
                          <b>Category:</b> {product.product_category}
                        </p>
                        <p className="card-text">
                          <b>Location:</b> {product.location}
                        </p>
                        <p className="card-text">
                          <b>Info:</b> {product.info}
                        </p>
                        <p className="card-text">
                          <b>Bid:</b> {product.bid}JOD
                        </p>

                        <p className="card-text">
                          <small className="text-muted">{product.seller_id}</small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
