import { ReloadOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Row, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";

import MainCol from "../../../../../components/ui/col/MainCol";
import { useGetGrindProductsListQuery } from "../../../../../features/grindProduct/GrindProductApiSlice";
import { useAddGrindOutProductMutation } from "../../../../../features/grindProduct/order/grindOrderStorageApiSlice";
import GrindOutListTable from "../grindOutList/GrindOutListTable";
import GrindOrderStorageItem from "./GrindOrderStorageItem";
import GrindOutFormTable from "./GrindOutFormTable";
import styles from "./grindOrderStorage.module.css";

function GrindOrderStorageList({ list, isLoading }) {
  /* State */
  const [openProductsListDrawer, setOpenProductsListDrawer] = useState({
    open: false,
    orderId: null,
  });
  const [allProducts, setAllProducts] = useState([]);
  const [grindOutList, setGrindOutList] = useState([]);
  /* api state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "grindOutApi";

  /* API */
  const productsRes = useGetGrindProductsListQuery();
  const [addGrindOut] = useAddGrindOutProductMutation();

  // useMemo
  const tableProductData = useMemo(() => {
    if (!allProducts.length) return [];
    return allProducts;
  }, [allProducts]);

  const tableGrindOutData = useMemo(() => {
    if (!grindOutList.length) return [];
    return grindOutList;
  }, [grindOutList]);

  // useEffect
  useEffect(() => {
    if (
      productsRes?.data?.success === true &&
      productsRes?.data?.data &&
      Array.isArray(productsRes?.data?.data)
    ) {
      setAllProducts([...productsRes?.data.data]);
    }
  }, [productsRes?.data]);

  /* Drawer */
  const handleOpenProductListDrawer = (orderId) =>
    setOpenProductsListDrawer({
      open: true,
      orderId,
    });
  const handleCloseProductListDrawer = () => {
    handleClear();
    setOpenProductsListDrawer({
      open: false,
      orderId: null,
    });
  };

  /* Handle delete */
  const handleDeleteItem = (itemId) => {
    const grindOutProduct = grindOutList.find((item) => item.id === itemId);

    // Validate
    if (!grindOutProduct) {
      message.info(`Bunday "${itemId.id}" mahsulot mavjud emas!`);
      return;
    }

    setGrindOutList((prev) =>
      prev.filter((item) => item.id !== grindOutProduct.id)
    );

    setAllProducts((prev) => [{ ...grindOutProduct }, ...prev]);
  };

  /* Table */
  const handleClear = () => {
    setGrindOutList([]);
    if (
      productsRes?.data?.success === true &&
      productsRes?.data?.data &&
      Array.isArray(productsRes?.data?.data)
    ) {
      setAllProducts([...productsRes?.data.data]);
    }
  };

  /* Handle add to grind out table */
  const handleAddToGrindOut = ({ mass, box, polka, product }) => {
    setGrindOutList((prev) => [
      ...prev,
      {
        ...product,
        mass,
        box,
        polka,
      },
    ]);

    setAllProducts((prev) => prev.filter((item) => item.id !== product.id));
  };

  /* Submit */
  const handleSubmit = async () => {
    /* Set Event */
    setIsSubmitting(true);
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    /* Check data */
    if (!grindOutList.length) {
      /* Message */
      messageApi.open({
        key,
        type: "error",
        content: "Maydalashdan chiqariladigan muhsulotlar mavjud emas!",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const data = {
        zayavka_id: openProductsListDrawer.orderId,
        products: grindOutList.map((item) => ({
          product_id: item.id,
          massa: item.mass,
          yashik: item.box,
          polka_id: item.polka.id,
          bulim_id: item.polka.bulim_id,
        })),
        isend: switchValue,
      };
      const resData = await addGrindOut(data).unwrap();
      if (resData?.success === true) {
        handleCloseProductListDrawer();
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key,
          type: "warning",
          content: `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title="Mahsulotlar"
        placement={"right"}
        onClose={handleCloseProductListDrawer}
        open={openProductsListDrawer.open}
        width={1200}
      >
        <div className={styles.wrapper}>
          <div className={styles.mainCard}>
            <h3 className={styles.title}>Mahsulotlar</h3>

            <GrindOutFormTable
              data={tableProductData}
              setGrindOutList={handleAddToGrindOut}
              isLoading={productsRes.isLoading}
            />
          </div>
          <div className={styles.mainCard}>
            <h3 className={styles.title}>Chiqariladigan mahsulotlar</h3>
            <GrindOutListTable
              data={tableGrindOutData}
              onDelete={handleDeleteItem}
            />
          </div>
        </div>
        <div className={styles.footerWrapper}>
          <Button
            style={{ width: "100%", marginTop: "2rem" }}
            type="primary"
            danger
            icon={<ReloadOutlined />}
            onClick={handleClear}
          >
            Tozalash
          </Button>

          <div
            style={{
              width: "100%",
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* <div>
              <Switch onChange={setSwitchValue} />
              &nbsp; Tugatasizmi
            </div> */}
            <Button
              disabled={!grindOutList.length || isSubmitting}
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              icon={<SendOutlined />}
            >
              Yuborish
            </Button>
          </div>
        </div>
      </Drawer>

      {isLoading ? (
        <Row style={{ width: "100%" }} gutter={[16, 16]}>
          {Array(5)
            .fill("")
            .map((_, index) => (
              <MainCol key={index}>
                <Card
                  style={{
                    width: "100%",
                  }}
                  loading={true}
                ></Card>
              </MainCol>
            ))}
        </Row>
      ) : (
        <Row style={{ width: "100%" }} gutter={[16, 16]}>
          {list.map((item) => (
            <GrindOrderStorageItem
              {...item}
              key={item.id}
              handleOpenDrawer={handleOpenProductListDrawer}
            />
          ))}
        </Row>
      )}
    </>
  );
}

export default GrindOrderStorageList;
