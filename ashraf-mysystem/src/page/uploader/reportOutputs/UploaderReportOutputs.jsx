import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetUploaderReportOutputsByDateMutation } from "../../../features/uploader/report/uploaderReportApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";
import styles from "./uploaderReportOutputs.module.css";
import { EyeFilled } from "@ant-design/icons";
import MainModal from "../../../components/common/modal/MainModal";
import UploaderReportOutputsViewModal from "./UploaderReportOutputsViewModal";

function UploaderReportOutputs() {
  /* API */

  const [getDataByDate] = useGetUploaderReportOutputsByDateMutation();

  /* State */
  const [isSubbmitting, setIsSubmitting] = useState();
  const [filterData, setFilterData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [allResData, setAllResData] = useState([]);
  const [mount, setMount] = useState(0);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [openModal, setOpenModal] = useState({
    open: false,
    data: null,
  });

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  useEffect(() => {
    if (mount >= 1) {
      handleGetDataByDate({ ...selectDate });
    }
    setMount(2);
  }, [mount, selectDate]);

  useEffect(() => {
    setTableData(
      filterData.sort((a, b) => parseInt(b.sana) - parseInt(a.sana))
    );
  }, [filterData]);

  /* Handle get data */
  const handleGetDataByDate = async (values) => {
    if (!values.start || !values.end) {
      setFilterData([]);
      return;
    }
    setTableData([]);
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
          resData?.data?.items_list &&
          Array.isArray(resData?.data?.items_list)
        ) {
          const newData = resData?.data?.items_list;

          setFilterData([...newData]);
          setAllResData(resData?.data);
        } else {
          setFilterData([]);
          setAllResData(null);
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
        setAllResData(null);
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
      title: "Id",
      dataIndex: "item_id",
      width: 150,
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Soni",
      dataIndex: "soni",
      width: 150,
      sortType: "number",
      render: (_, { soni }) => (
        <MainNumberFormat value={formatFloatNumber(soni)} />
      ),
    },
    {
      title: "Amal",
      dataIndex: "operation",
      width: 60,
      align: "center",
      render: (_, itemData) => (
        <Button
          type={"primary"}
          icon={<EyeFilled />}
          size={"small"}
          onClick={() =>
            onOpenModal(itemData, allResData?.sana1, allResData?.sana2)
          }
        />
      ),
    },
  ];

  /*Modal*/
  const onOpenModal = (data, sana1, sana2) =>
    setOpenModal({
      open: true,
      data: {
        ...data,
        sana1,
        sana2,
      },
    });

  const onCloseModal = () =>
    setOpenModal({
      open: false,
      data: null,
    });

  return (
    <>
      {contextHolder}

      <MainModal open={openModal.open} onClose={onCloseModal} width={700}>
        <UploaderReportOutputsViewModal data={openModal.data} />
      </MainModal>

      <div
        style={{ marginTop: "1rem", maxWidth: "800px", margin: "1rem auto" }}
      >
        <Section>
          <div className={styles.header}>
            <p className={styles.headerText}>
              Yetkazib berilgan:&nbsp;
              <b>
                <MainNumberFormat value={formatFloatNumber(allResData?.jami)} />
                kg
              </b>
            </p>
            <p className={styles.headerText}>
              Buyurtma berilgan:&nbsp;
              <b>
                <MainNumberFormat
                  value={formatFloatNumber(allResData?.jami2)}
                />
                kg
              </b>
            </p>
          </div>
          <MainDataTable
            mobile={true}
            showDatePicker={true}
            setDateValue={setSelectDate}
            dateValue={selectDate}
            columns={columns}
            isLoading={isSubbmitting}
            data={tableData}
            pagination={false}
            rowKey={"item_id"}
            scroll={{ x: 300 }}
          />
        </Section>
      </div>
    </>
  );
}

export default UploaderReportOutputs;
