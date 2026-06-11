import { Select, message } from "antd";
import React, { useEffect, useState } from "react";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../../components/common/section/Section";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import { useGetSupplierDebtByDateMutation } from "../../../../features/supplier/debt/supplierDebtApiSlice";
import formatCurrency from "../../../../util/formatCurrency";

function SupplierDebtHistory() {
  /* State */
  const [isSubbmitting, setIsSubmitting] = useState(false);
  const [mount, setMount] = useState(0);
  const [allResData, setAllResData] = useState();
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [filterData, setFilterData] = useState([]);

  /* API */
  const [getDataByDate] = useGetSupplierDebtByDateMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  useEffect(() => {
    if (mount >= 1) {
      handleGetDataByDate({ ...selectDate });
    }
    setMount(true);
  }, [selectDate]);

  /* Handle get data */
  const handleGetDataByDate = async (values) => {
    if (!values.start || !values.end) {
      setFilterData([]);
      return;
    }
    /* Set Event */
    setIsSubmitting(true);

    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const resData = await getDataByDate({
        start: values.start,
        end: values.end,
      }).unwrap();

      if (resData?.success === true) {
        if (
          resData?.success === true &&
          resData?.data &&
          resData?.data?.list &&
          Array.isArray(resData?.data?.list)
        ) {
          const newData = resData?.data?.list;
          setFilterData([...newData]);
          setAllResData(resData?.data);
        }

        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        setFilterData([]);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Mijoz",
      dataIndex: "client",
      width: 150,
    },
    {
      title: "Telefon",
      dataIndex: "telefon",
      width: 150,
    },
    {
      title: "Summa",
      dataIndex: "summa",
      align: "left",
      width: 120,
      render: (_, { summa }) => <>{formatCurrency(summa)}</>,
    },
    {
      title: "Vaqt",
      dataIndex: "vaqt",
      width: 150,
    },
  ];

  return (
    <>
      {contextHolder}

      <Section>
        <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
          <p>
            Summa:{" "}
            <b>
              <MainNumberFormat value={allResData?.itog} /> so'm
            </b>
          </p>
        </div>
        <MainDataTable
          mobile={true}
          columns={columns}
          isLoading={isSubbmitting}
          // isError={isError}
          data={filterData}
          // refetch={refetch}
          showDatePicker={true}
          setDateValue={setSelectDate}
        />
      </Section>
    </>
  );
}

export default SupplierDebtHistory;
