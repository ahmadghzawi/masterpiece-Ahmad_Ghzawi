import React from "react";

const Offer = props => {
  const { data, users, redirectToOfferPage } = props;
  let buyer = users.filter(user => user._id === Object.keys(data)[0]);
  buyer = buyer[0];

  const dateStamp = data[buyer._id].date.split(" ");
  const date = dateStamp[0] + " " + dateStamp[1] + " " + dateStamp[2] + " " + dateStamp[3];
  const time = dateStamp[4] + " " + dateStamp[5];
  return (
    <div className="col-md-4">
      <div className="card m-3">
        <div className="row no-gutters product" onClick={() => redirectToOfferPage(buyer, data[buyer._id])}>
          <div className="col-md-12">
            <div className="card-body">
              <p className="card-text">
                <b>From:</b> {buyer.name}
              </p>
              <p className="card-text">
                <b>Price:</b> {data[buyer._id].price} JOD
              </p>
              <p className="card-text">
                <b>Date:</b> {date}
              </p>
              <p className="card-text float-left">
                <b>Time:</b> {time}
              </p>

              <p className="card-text" style={{ clear: "left" }}>
                <small className="text-muted">{data.seller_id}</small>
              </p>
            </div>
          </div>
        </div>
        {/* <button
          className="btn btn-danger position-absolute"
          style={{ bottom: "25px", right: "25px" }}
          onClick={() => deleteOffer(buyer._id, product_id)}
        >
          DELETE
        </button> */}
      </div>
    </div>
  );
};

export default Offer;
