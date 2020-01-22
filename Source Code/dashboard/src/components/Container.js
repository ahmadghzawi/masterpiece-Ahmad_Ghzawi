import React from "react";

const Container = props => (
  <div className={props.className}>
    <div className="card" style={{ height: props.height || null, overflow: 'auto' }}>
      <div className="card-header">{props.title}</div>
      {props.children}
    </div>
  </div>
);

export default Container;
