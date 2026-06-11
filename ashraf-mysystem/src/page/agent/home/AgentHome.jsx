import { Col } from "antd";
import React, { useMemo, useRef, useState } from "react";
import MainRow from "../../../components/ui/row/MainRow";
import { useGetAgentProductsQuery } from "../../../features/agent/agentApiSlice";
import AgentOrderUploaderCalculator from "./components/AgentOrderUploaderCalculator";
import AgentOrderUploaderCheckout from "./components/AgentOrderUploaderCheckout";
import AgentOrderUploaderProducts from "./components/AgentOrderUploaderProducts";

function AgentHome() {
  /* Ref */
  const calcRef = useRef();
  const checkoutRef = useRef();

  /* State */
  const [productsData, setProductsData] = useState([]);

  /* API */
  const products = useGetAgentProductsQuery();

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

  /* Customer data */
  const handleSetCustomer = (data) => {
    checkoutRef.current.setCustomerData(data);
  };
 
  return (
    <>
      <MainRow>
        {/* Products */}
        <Col xs={24} md={12} xl={10} xxl={8} style={{ height: "100%" }}>
          <AgentOrderUploaderProducts
            productsList={[...productsList]}
            handleAddInputs={handleAddInputs}
          />
        </Col>

        {/* Calculator */}
        <Col xs={24} md={12} xl={9} xxl={10} style={{ height: "100%" }}>
          <AgentOrderUploaderCalculator
            ref={calcRef}
            setProductsData={setProductsData}
            setCustomer={handleSetCustomer}
          />
        </Col>

        {/* Chek */}
        <Col xs={24} xl={5} xxl={6} style={{ height: "100%" }}>
          <AgentOrderUploaderCheckout
            ref={checkoutRef}
            productsData={productsData}
            onRestart={handleRestart}
          />
        </Col>
      </MainRow>
    </>
  );
}

export default AgentHome;
