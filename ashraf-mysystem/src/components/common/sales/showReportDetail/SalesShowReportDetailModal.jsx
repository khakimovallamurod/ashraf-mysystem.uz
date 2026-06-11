import { Divider, Skeleton, Table, Tag, Typography, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useGetSalesReportDetailMutation } from "../../../../features/sales/salesApiSlice";
import MainModal from "../../modal/MainModal";
import MainNumberFormat from "../../numberFormat/MainNumberFormat";
import styles from "./salesShowReportDetailModal.module.css";
import MainEmptyTable from "../../errors/empty/table/MainEmptyTable";

function SalesShowReportDetailModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));

  /* State */
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [dataType, setDataType] = useState("");

  /* API */
  const [getReportDetailData] = useGetSalesReportDetailMutation();

  /* Modal */
  const handleOpenModal = ({ id, status, dataType = "" }) => {
    setOpenModal({ open: true });
    handleGetData({ id, status });
    setDataType(dataType);
  };
  const handleCloseModal = () => setOpenModal({ open: false });

  /* handleGetData */
  const handleGetData = async ({ id, status }) => {
    /* Loading */
    setIsSubmitting(true);

    try {
      const resData = await getReportDetailData({ id, status }).unwrap();
      if (resData?.success === true) {
        /* Success */
        if (resData?.data) {
          const list = resData?.data?.items?.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
          if (list && list.length) {
            setTableData(list);
          } else {
            setTableData([]);
          }
          setDetailData(resData?.data);
        } else {
          setTableData([]);

          setDetailData(null);
        }
      } else if (resData?.success === false) {
        /* Error */

        if (resData?.message) {
          message.error(resData.message);
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: "T/r",
      dataIndex: "id",
      key: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "item_name",
      key: "item_name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Narxi",
      dataIndex: "price",
      key: "price",
      width: 150,
      sortType: "number",
      render: (_, { price }) => <MainNumberFormat value={price} />,
    },
    {
      title: "Soni",
      dataIndex: "soni",
      key: "soni",
      width: 150,
      sortType: "number",
      render: (_, { soni }) => <MainNumberFormat value={soni} />,
    },
    {
      title: "Summa",
      dataIndex: "summa",
      key: "summa",
      width: 150,
      sortType: "number",
      render: (_, { summa }) => <MainNumberFormat value={summa} />,
    },
  ];

  const paidInSum = Number(detailData?.naqdsum || 0)
    + Number(detailData?.bank || 0)
    + Number(detailData?.karta || 0)
    + Number(detailData?.valyuta || 0);

  return (
    <MainModal open={openModal.open} onClose={handleCloseModal} width={600}>
      {dataType === "berilgan" ? (
        isSubmitting ? (
          <Skeleton active />
        ) : (
          <>
            <div style={{ padding: "1rem 0" }}>
              <h3>Yetkazib beruvchia: {detailData?.dostavka}</h3>
              {detailData?.holat && <h5>Holat: {detailData?.holat}</h5>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                <div>
                  <p>
                    Xaridor:{" "}
                    <b>
                      {detailData?.client} <br />
                    </b>
                  </p>
                  <p>
                    Telefon:{" "}
                    <b>
                      {detailData?.client_telefon} <br />
                    </b>
                  </p>
                </div>
                <div>
                  <p>
                    Summa:{" "}
                    <b>
                      <MainNumberFormat value={detailData?.summa} />
                    </b>
                  </p>
                  <p>
                    Sana: <b>{detailData?.vaqt}</b>
                  </p>
                </div>
              </div>
            </div>
            <Table
              size="small"
              columns={columns}
              isLoading={isSubmitting}
              // isError={isError}
              dataSource={tableData}
              // refetch={refetch}
              rowKey={"id"}
              locale={{
                emptyText: () => <MainEmptyTable />,
              }}
            />
          </>
        )
      ) : (
        <>
          <div style={{ padding: "1rem 0" }}>
            <h3 style={{ marginBottom: "1rem" }}>
              Yetkazib beruvchi: {detailData?.dostavka}
            </h3>
            {detailData?.holat && (
              <h4>
                <Tag color="blue">Holat: {detailData?.holat}</Tag>
              </h4>
            )}
            {isSubmitting ? (
              <Skeleton active />
            ) : (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <div className={styles.headerItem}>
                    Xaridor:{" "}
                    <b>
                      {detailData?.client} <br />
                    </b>
                  </div>
                  <div className={styles.headerItem}>
                    Telefon:{" "}
                    <b>
                      {detailData?.client_telefon} <br />
                    </b>
                  </div>
                  {detailData?.product_name && (
                    <div className={styles.headerItem}>
                      Mahsulot nomi:{" "}
                      <b>
                        {detailData?.product_name} <br />
                      </b>
                    </div>
                  )}
                  {detailData?.massa && (
                    <div className={styles.headerItem}>
                      Massasi:{" "}
                      <b>
                        <MainNumberFormat value={detailData?.massa} /> <br />
                      </b>
                    </div>
                  )}
                </div>
                <Divider />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                  <p>
                    Naqd so'm:{" "}
                    <b>
                      <MainNumberFormat value={detailData?.naqdsum} /> so'm
                    </b>
                  </p>
                  <p>
                    Bank:{" "}
                    <b>
                      <MainNumberFormat value={detailData?.bank} /> so'm
                    </b>
                  </p>
                  <p>
                    Karta:{" "}
                    <b>
                      <MainNumberFormat value={detailData?.karta} /> so'm
                    </b>
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2rem",
                    marginTop: "1rem",
                  }}
                >
                  <p>
                    Naqd usd:{" "}
                    <b>
                      <MainNumberFormat value={detailData?.naqdusd} />
                    </b>
                  </p>
                  <p>
                    Valyuta:{" "}
                    <b>
                      <MainNumberFormat value={detailData?.valyuta} /> so'm
                    </b>
                  </p>
                </div>
                <Divider />
                <Typography.Title level={5}>
                  TO'LANGAN:{" "}
                  <b>
                    <MainNumberFormat value={paidInSum} /> so'm
                  </b>
                </Typography.Title>
                <Typography.Title level={5}>
                  SUMMA:{" "}
                  <b>
                    <MainNumberFormat value={detailData?.summa} /> so'm
                  </b>
                </Typography.Title>
              </>
            )}
          </div>
        </>
      )}
    </MainModal>
  );
}

export default forwardRef(SalesShowReportDetailModal);
