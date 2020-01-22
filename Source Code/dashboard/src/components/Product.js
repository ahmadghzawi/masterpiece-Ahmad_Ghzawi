import React from "react";

const Product = props => {
  const { data, redirectToProductPage, deleteProduct } = props;
  return (
    <div className="card m-3 overflow-hidden" style={{ height: "250px" }}>
      <div
        className="row no-gutters product"
        onClick={() => redirectToProductPage(data)}
      >
        <div className="col-md-4">
          <img src={data.image_path} className="card-img" alt={data.title} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              <b>{data.title}</b>
            </h5>
            <p className="card-text">
              <b>Category:</b> {data.product_category}
            </p>
            <p className="card-text">
              <b>Location:</b> {data.location}
            </p>
            <p className="card-text">
              <b>Info:</b> {data.info}
            </p>
            <p className="card-text float-left">
              <b>Bid:</b> {data.bid}JOD
            </p>

            <p className="card-text" style={{ clear: "left" }}>
              <small className="text-muted">{data.seller_id}</small>
            </p>
          </div>
        </div>
      </div>
      <button
        className="btn btn-danger position-absolute"
        style={{ bottom: "25px", right: "25px" }}
        onClick={() => deleteProduct(data._id)}
      >
        DELETE
      </button>
    </div>
  );
};

export default Product;
