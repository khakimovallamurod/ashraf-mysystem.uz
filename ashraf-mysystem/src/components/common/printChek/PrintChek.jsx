import { List, Table, Typography } from "antd";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import LazyImage from "../lazyLoad/LazyImage";
import MainNumberFormat from "../numberFormat/MainNumberFormat";
import styles from "./printChek.module.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/authSlice";

const columns = [
  {
    title: "Nomi",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Massasi",
    dataIndex: "mass",
    key: "mass",
    render: (mass) => (
      <span>
        <b><MainNumberFormat value={mass} /></b>&nbsp;kg
      </span>
    ),
  },
  {
    title: "Narxi",
    dataIndex: "price",
    key: "price",
    render: (price) => <MainNumberFormat value={price} />,
  },
  {
    title: "Summa",
    dataIndex: "total",
    key: "total",
    render: (total) => <MainNumberFormat value={total} />,
  },
];

function PrintChek(props, ref) {
  /* Props */
  const { printProducts = [] } = props;
  
  /* Ref */
  const printRef = React.useRef();
  
  const userData = useSelector(selectCurrentUser);

  /* Memo */
  const tableData = useMemo(() => {
    if (printProducts?.length) {
      return printProducts.map((item, index) => {
        return {
          id: item?.id,
          name: item?.productName,
          price: item?.price,
          mass: item?.mass,
          total: item?.total,
        };
      });
    }
    return [];
  }, [printProducts]);

  /* Handle prind with ref */
  useImperativeHandle(ref, () => ({
    print: handlePrint,
  }));

  /* Handle prind */
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div ref={printRef} className={styles.printContainer}>
      <LazyImage imgUrl={"/images/logo-dark.png"} width={120} />

      <List className={styles.list}>
        <List.Item className={styles.listItem}>My system</List.Item>
        <List.Item className={styles.listItem}>+998(99)200-33-53</List.Item>
        <List.Item className={styles.listItem}>
          <b>Check raqami: 12323</b>
        </List.Item>
        <List.Item className={styles.listItem}>
          <Typography.Text strong>
            <b>{userData?.name} {userData?.surname}</b>
          </Typography.Text>
        </List.Item>
      </List>

      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={tableData}
        rowKey={"id"}
        pagination={false}
        locale={{
          emptyText: (
            <Typography.Title level={5} disabled>
              Mahsulot mavjud emas!
            </Typography.Title>
          ),
        }}
      />

      <table style={{ width: "100%", textAlign: "left" }} cellSpacing={10}>
        <tbody>
          <tr>
            <td>Xaridor:</td>
            <td>Eshmat</td>
          </tr>
          <tr>
            <td>Jami summa:</td>
            <td>
              <MainNumberFormat value={10000} /> so'm
            </td>
          </tr>
          <tr>
            <td>To'lov turi:</td>
            <td>Naqd</td>
          </tr>
          <tr>
            <td>Tranzaksiya vaqti:</td>
            <td>1234</td>
          </tr>
        </tbody>
      </table>
      <p>
        <Typography.Text strong>Xaridingiz uchun raxmat!!!</Typography.Text>
      </p>
      <p
        style={{
          marginTop: "1rem",
          borderBottom: "1px solid",
          paddingBottom: ".5rem",
        }}
      >
        <Typography.Text strong>Eslatma!!!</Typography.Text>
      </p>
      <p>
        <Typography.Text strong>
          Mahsulotlar, ushbu to'lov qog'ozi ko'rsatilgandagina - Qaytarib
          olinadi!
        </Typography.Text>
      </p>
    </div>
  );
}

export default forwardRef(PrintChek);
