import { Col } from "antd";
import React, { useMemo, useRef, useState } from "react";
import MainRow from "../../../components/ui/row/MainRow";
import { useGetSalesProductsQuery } from "../../../features/sales/salesApiSlice";
import SalesProductSaleCalculator from "./components/SalesProductSaleCalculator";
import SalesProductSaleCheckout from "./components/SalesProductSaleCheckout";
import SalesProductSaleProducts from "./components/SalesProductSaleProducts";

function SalesProductSale() {
  /* Ref */
  const calcRef = useRef();

  /* State */
  const [productsData, setProductsData] = useState([]);

  /* API */
  const products = useGetSalesProductsQuery();

  const productsList = useMemo(() => {
    if (
      products?.data?.success === true &&
      products?.data?.data &&
      Array.isArray(products?.data?.data)
    ) {
      return products?.data.data;
    }
    return [];
  }, [products?.data]);

  const handleAddInputs = (data) => {
    calcRef.current.addInputs(data);
  };

  const handleRestart = () => {
    calcRef.current.restart();
  };

  return (
    <div style={{ marginRight: "-18px", height: "100%" }}>
      <MainRow>
        {/* Products */}
        <Col xs={24} md={12} xl={10} xxl={8} style={{ height: "100%" }}>
          <SalesProductSaleProducts
            productsList={[...productsList]}
            handleAddInputs={handleAddInputs}
          />
        </Col>

        {/* Calculator */}
        <Col xs={24} md={12} xl={9} xxl={10}>
          <SalesProductSaleCalculator
            ref={calcRef}
            setProductsData={setProductsData}
          />
        </Col>

        {/* Chek */}
        <Col xs={24} xl={5} xxl={6}>
          <SalesProductSaleCheckout
            productsData={productsData}
            onRestart={handleRestart}
          />
        </Col>
      </MainRow>
    </div>
  );
}

export default SalesProductSale;
