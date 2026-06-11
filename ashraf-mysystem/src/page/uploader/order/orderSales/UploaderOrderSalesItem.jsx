import {
  CheckOutlined,
  CloseOutlined,
  EditFilled,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  List,
  Popconfirm,
  Skeleton,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MainModal from "../../../../components/common/modal/MainModal";
import MainCol from "../../../../components/ui/col/MainCol";
import { useAddUploaderOrderSalesEndMutation } from "../../../../features/uploader/order/orderOfSales/uploaderOrderOfSalesApiSlice";
import UploaderPrintChek from "./components/UploaderPrintChek";
import UploaderProductsPrintChek from "./components/UploaderProductsPrintChek";
import UploaderSalesOrderChangeSupplierModal from "./components/UploaderSalesOrderChangeSupplierModal";
import UploaderSalesOrderCloseModal from "./components/UploaderSalesOrderCloseModal";
import styles from "./uploaderOrderSales.module.css";

function UploaderOrderSalesItem(props) {
  const {
    isLoading,
    id,
    client,
    status,
    sotuvchi,
    dostavchik,
    yuklovchi,
    vaqt,
    product_list,
    izoh,
    handleOpenModal,
    refetch,
  } = props;
  /* Ref */
  const printRef = useRef(null);
  const printProductsRef = useRef(null);
  const uploaderSalesOrderCloseRef = useRef(null);
  const changeSupplierModalRef = useRef(null);

  /* State */
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [printData, setPrintData] = useState({
    orderId: null,
    productList: [],
    customer: {
      name: "",
      balance: "",
      allTelefon: [],
    },
    date: "",
    chekId: "",
  });

  /* API */
  const [addCloseOrder] = useAddUploaderOrderSalesEndMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "closeOrder";

  useEffect(() => {
    if (product_list && product_list?.length) {
      setTableData(
        product_list.map((item, index) => ({
          ...item,
          id: uuidv4(),
          index: index + 1,
        }))
      );
    }
  }, [product_list]);

  /* Modal */
  // products
  const handleOpenProductsModal = () => setOpenModal(true);
  const handleCloseProductsModal = () => setOpenModal(false);

  /* Handle close order */
  const handleCloseOrder = async (orderId) => {
    setIsSubmitting(true);
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        order_id: orderId,
      };
      const resData = await addCloseOrder(data).unwrap();
      if (resData?.success === true) {
        const {
          product_list,
          old_client_balans,
          client,
          after_balans,
          vaqt,
          all_summa,
          dostavchik,
          dostavchik_telefon,
          agent,
        } = resData.data;

        const newPrintData = {
          orderId: orderId,
          productList: product_list,
          customer: {
            old_balance: old_client_balans,
            name: client?.fio,
            balance: client?.balans,
            allTelefon: [client?.telefon, client?.telefon2, client?.telefon3],
            location: client?.manzil,
            debt: client?.balans,
          },
          afterBalance: after_balans,
          date: vaqt,
          allPoductTotalPrice: all_summa,
          supplier: {
            name: dostavchik,
            telefon: dostavchik_telefon,
          },
          agent,
        };

        handlePrint(newPrintData);
        setTimeout(() => {}, 500);

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

  const handleOpenCloseOrderItemModal = ({
    salesOrderId,
    salesOrderItemId,
  }) => {
    uploaderSalesOrderCloseRef.current.onOpen({
      salesOrderId,
      salesOrderItemId,
    });
  };

  const handleOpenChangeSupplierModal = (orderId) => {
    changeSupplierModalRef.current.onOpen(orderId);
  };

  /* Handle grind */
  const handlePrint = (data) => {
    printRef.current?.onPrint(data);
  };

  const handlePrintProducts = (data) => {
    printProductsRef.current.onPrint(data);
  };
  return (
    <>
      {contextHolder}

      {/* Print chek */}
      <UploaderPrintChek ref={printRef} />

      <UploaderProductsPrintChek ref={printProductsRef} />

      <UploaderSalesOrderCloseModal ref={uploaderSalesOrderCloseRef} />

      {/* Products Modal */}
      <MainModal
        open={openModal}
        onClose={handleCloseProductsModal}
        width={800}
      >
        <Table
          scroll={{ x: 600 }}
          columns={[
            {
              title: "T/r",
              dataIndex: "index",
              key: "index",
            },
            {
              title: "Nomi",
              dataIndex: "product_name",
              key: "product_name",
            },
            {
              title: "Massa(kg)",
              dataIndex: "massa",
              key: "massa",
            },
            {
              title: "Summasi(so'm)",
              dataIndex: "summa",
              key: "summa",
            },
            {
              title: "Tayyorlandi(kg)",
              dataIndex: "tayyorlandi",
              key: "tayyorlandi",
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (_, { status }) => {
                const color =
                  status === "new" ? "cyan-inverse" : "blue-inverse";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
              },
            },
            {
              title: "Amal",
              dataIndex: "operation",
              key: "operation",
              render: (_, { item_id }) => {
                return (
                  <Button
                    type="primary"
                    danger
                    size="small"
                    shape="round"
                    icon={<CloseOutlined />}
                    onClick={() =>
                      handleOpenCloseOrderItemModal({
                        salesOrderId: id,
                        salesOrderItemId: item_id,
                      })
                    }
                  />
                );
              },
            },
          ]}
          rowKey={"id"}
          dataSource={tableData}
        />
      </MainModal>

      {/* Change Supplier Modal */}
      <UploaderSalesOrderChangeSupplierModal
        refetch={refetch}
        ref={changeSupplierModalRef}
      />

      <MainCol>
        <Card
          className={styles.card}
          bodyStyle={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {isLoading ? (
            <div className={styles.loadingCard}>
              <Skeleton size="small" active></Skeleton>
              <Skeleton.Button
                style={{ height: "18px" }}
                block
                size="small"
                active
              ></Skeleton.Button>
              <Skeleton.Button
                block
                size="small"
                active
                className={styles.button}
              ></Skeleton.Button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex" }}>
                <h3 className={styles.titles}>{client}</h3>

                <div style={{ width: "50px" }} />
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <Popconfirm
                    title="Buyurtmani tugatish"
                    description="Buyurtmani tugatmoqchimisiz?"
                    okText="Albatta"
                    cancelText="Yo'q"
                    onConfirm={() => handleCloseOrder(id)}
                    okButtonProps={{
                      loading: isSubmitting,
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      shape="round"
                      icon={<CloseOutlined />}
                    />
                  </Popconfirm>
                </div>
              </div>

              <List className={styles.list} size="small">
                <List.Item>
                  <span>Sotuvchi:</span>
                  <b>{sotuvchi}</b>
                </List.Item>
                <List.Item>
                  <span>Yuklovchi</span>
                  <b>{yuklovchi}</b>
                </List.Item>
                <List.Item>
                  <span>Yetkazib beruvchi</span>
                  <div>
                    <b>{dostavchik}</b>
                    <Button
                      icon={<EditFilled />}
                      style={{ marginLeft: "10px" }}
                      size="small"
                      type="primary"
                      shape="round"
                      onClick={() => handleOpenChangeSupplierModal(id)}
                    />
                  </div>
                </List.Item>
                <List.Item>
                  <span>Sana: </span>
                  <b>{vaqt}</b>
                </List.Item>
                <List.Item>
                  <span>Mahsulotlar:</span>
                  <div>
                    <Button type="link" onClick={handleOpenProductsModal}>
                      Mahsulotlar &nbsp;<b>{product_list?.length}</b>
                    </Button>
                    <Button
                      icon={<PrinterOutlined />}
                      style={{ marginLeft: "10px" }}
                      size="small"
                      type="primary"
                      shape="round"
                      onClick={() => handlePrintProducts(props)}
                    />
                  </div>
                </List.Item>
                <List.Item>
                  <span>Izoh:</span>
                  <span
                    style={{
                      paddingLeft: "1rem",
                      width: "100%",
                      wordWrap: "break-word",
                      display: "inline-block",
                    }}
                  >
                    {" "}
                    {izoh}
                  </span>
                </List.Item>
                <List.Item>
                  <span>Status</span>
                  <Tag color="cyan-inverse">
                    {status ? status.toUpperCase() : ""}
                  </Tag>
                </List.Item>
              </List>

              <Tooltip title="Buyurtmani tasdiqlash">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  className={styles.button}
                  onClick={() => handleOpenModal({ id, product_list })}
                >
                  Tasdiqlash
                </Button>
              </Tooltip>
            </>
          )}
        </Card>
      </MainCol>
    </>
  );
}

export default UploaderOrderSalesItem;
