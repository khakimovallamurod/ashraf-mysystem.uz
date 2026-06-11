import { CheckOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import { useAddAdminPolkaMutation } from "../../../../features/admin/polka/adminPolkaApiSlice";
import { useGetCashierWorkerQuery } from "../../../../features/cashier/salary/cashierSalaryApiSlice";
import DateAndCheckbox from "./DateAndCheckbox";

function CashierAttendanceDrawer() {
  // Form
  const [form] = Form.useForm();

  // Api
  const { data, isLoading, isError, refetch } = useGetCashierWorkerQuery();

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [tableData, setTableData] = useState([]);

  // Message
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* Memo */
  useEffect(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      setTableData([...data.data]);
    }
  }, [data]);

  const [addPolka] = useAddAdminPolkaMutation();

  /* Handle Submit */
  const handleSubmit = async () => {
    /* Set Event */
    setIsSubmitting(true);
    /* Set status */
    setStatus("validating");
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = tableData
        .filter((item) => !!item.davomat && item.davomat?.checkbox)
        .map((item) => ({
          worker_id: item?.id,
          date: item?.davomat?.date,
          time: item?.davomat?.time,
          ishxonada: item?.davomat?.checkbox,
        }));
      console.log(data);
      return;
      const resData = await addPolka(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        setStatus("error");
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
      setTimeout(() => {
        setStatus("");
      }, 2000);
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        setStatus("warning");
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

  // Select date
  const onSelectDateAndCheckbox = (value, itemId) => {
    if (!value.isChange) return;

    const res = tableData.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          davomat: { ...value },
        };
      }
      return item;
    });

    setTableData(res);
  };

  // Columns
  const columns = [
    {
      title: "Nomi",
      dataIndex: "fio",
      sortType: "string",
    },
    {
      title: "Telefon",
      dataIndex: "telefon",
    },
    {
      title: "Amal",
      dataIndex: "operation",
      width: 300,
      render: (_, { id, davomat }) => (
        <DateAndCheckbox
          checked={davomat ? davomat?.checkbox : false}
          setValue={(val) => onSelectDateAndCheckbox(val, id)}
          value={davomat}
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <MainDataTable
        customHeader={
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleSubmit()}
          >
            Saqlash
          </Button>
        }
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        data={tableData}
        columns={columns}
        pagination={false}
        scroll={"disable"}
        rowClassName={(render) => {
          if (
            tableData.find((item) => item.id === render.id)?.davomat?.checkbox
          ) {
            return "row-success";
          }
        }}
      />
    </>
  );
}

export default CashierAttendanceDrawer;
