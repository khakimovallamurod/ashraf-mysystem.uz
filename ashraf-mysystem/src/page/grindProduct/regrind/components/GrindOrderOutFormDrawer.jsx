import { ReloadOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Drawer, message } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import {
  useGetGrindProductsListQuery,
  useGetGrindProductsPolkaQuery,
} from "../../../../features/grindProduct/GrindProductApiSlice";
import { useAddGrindRegrindMutation } from "../../../../features/grindProduct/regrind/grindRegrindApiSlice";
import GrindOutListTable from "../../orderStorage/components/grindOutList/GrindOutListTable";
import GrindOutFormTable from "../../orderStorage/components/order/GrindOutFormTable";
import styles from "./grindRegrind.module.css";

function GrindOrderOutFormDrawer(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: (orderId) => handleOpenProductListDrawer(orderId),
  }));

  /* State */
  const [openDrawer, setOpenDrawer] = useState({
    open: false,
    orderId: null,
  });
  const [allProducts, setAllProducts] = useState([]);
  const [grindOutList, setGrindOutList] = useState([]);
  /* api state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [switchValue] = useState(false);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "grindOutApi";

  /* API */
  const polkaData = useGetGrindProductsPolkaQuery();
  const productsRes = useGetGrindProductsListQuery();
  const [addGrindOut] = useAddGrindRegrindMutation();

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
    setOpenDrawer({
      open: true,
      orderId,
    });
  const handleCloseDrawer = () =>
    setOpenDrawer({
      open: false,
      orderId: null,
    });

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
      return;
    }

    try {
      const data = {
        zayavka_id: openDrawer.orderId,
        products: grindOutList.map((item) => ({
          product_id: item.id,
          massa: item.mass,
          yashik: item.yashik_mass,
          polka_id: item.polka.id,
          bulim_id: item.polka.bulim_id,
        })),
        isend: switchValue,
      };

      const resData = await addGrindOut(data).unwrap();
      if (resData?.success === true) {
        handleClear();
        handleCloseDrawer();
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
        onClose={handleCloseDrawer}
        open={openDrawer.open}
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
    </>
  );
}

export default forwardRef(GrindOrderOutFormDrawer);
