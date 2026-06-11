import React from "react";
import LazyImage from "../lazyLoad/LazyImage";

function PrintChekContent({ children }) {
  return (
    <>
      <LazyImage imgUrl={"/images/custom-logo.png"} width={120} />
      <p style={{ marginBottom: "1rem" }}>My system</p>

      {children}

      <div
        style={{
          marginTop: "1rem",
          borderTop: "1px solid",
        }}
      >
        <p
          style={{
            paddingBottom: ".5rem",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {/* Comment */}
        </p>
      </div>
    </>
  );
}

export default PrintChekContent;
