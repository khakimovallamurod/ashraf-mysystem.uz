import { Col } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";
import MainRow from "../../../components/ui/row/MainRow";
import SalesOrderUploaderCalculator from "./components/SalesOrderUploaderCalculator";
import SalesOrderUploaderCheckout from "./components/SalesOrderUploaderCheckout";
import SalesOrderUploaderProducts from "./components/SalesOrderUploaderProducts";
import { useGetSalesProductsQuery } from "../../../features/sales/salesApiSlice";

function SalesOrderUploader() {
  /* Ref */
  const calcRef = useRef();
  const checkoutRef = useRef();

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

  /* All calculated product */
  const setCalculatedProduct = useCallback((data) => {
    setProductsData(data);
  }, []);

  /* Inputs */
  const handleAddInputs = (data) => {
    calcRef.current.addInputs(data);
  };
  const handleInputsRestart = () => {
    calcRef.current.restart();
  };

  /* Customer data */
  const handleSetCustomer = (data) => {
    checkoutRef.current.setCustomerData(data);
  };
  return (
    <div style={{ marginRight: "-18px", height: "100%" }}>
      <MainRow>
        {/* Products */}
        <Col xs={24} md={12} xl={10} xxl={8} style={{ height: "100%" }}>
          <SalesOrderUploaderProducts
            productsList={[...productsList]}
            handleAddInputs={handleAddInputs}
          />
        </Col>

        {/* Calculator */}
        <Col xs={24} md={12} xl={9} xxl={10}>
          <SalesOrderUploaderCalculator
            ref={calcRef}
            setProductsData={setCalculatedProduct}
            setCustomer={handleSetCustomer}
          />
        </Col>

        {/* Chek */}
        <Col xs={24} xl={5} xxl={6}>
          <SalesOrderUploaderCheckout
            ref={checkoutRef}
            productsData={productsData}
            onRestart={handleInputsRestart}
          />
        </Col>
      </MainRow>
    </div>
  );
}

export default SalesOrderUploader;
