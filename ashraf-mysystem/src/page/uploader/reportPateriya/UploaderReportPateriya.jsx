import { message } from "antd";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetUploaderReportPateriyaMutation } from "../../../features/uploader/report/uploaderReportApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function UploaderReportPateriya() {
  /* API */

  const [getDataByDate] = useGetUploaderReportPateriyaMutation();

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

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      width: 150,
      sortType: "string",
    },
    {
      title: "Mahsulot nomi",
      dataIndex: "product_name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa (kg)",
      dataIndex: "massa",
      width: 150,
      sortType: "number",
      render: (_, { massa }) => (
        <MainNumberFormat value={formatFloatNumber(massa)} />
      ),
    },
  ];

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
          resData?.data?.list &&
          Array.isArray(resData?.data?.list)
        ) {
          const newData = resData?.data?.list?.map((item) => ({
            ...item,
            list: item?.list?.map((item) => ({
              ...item,
              id: uuidv4(),
            })),
          }));

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
    <div style={{ marginTop: "1rem", maxWidth: "800px", margin: "1rem auto" }}>
      {contextHolder}
      <Section>
        <h4>
          <MainNumberFormat
            value={formatFloatNumber(allResData?.jamimassa || 0)}
          />
          kg
        </h4>
        {/* <MainRangeDatePicker setValue={setDateValue} value={dateValue} /> */}
        <MainDataTable
          mobile={true}
          showDatePicker={true}
          setDateValue={setSelectDate}
          dateValue={selectDate}
          columns={columns}
          isLoading={isSubbmitting}
          data={tableData}
          pagination={false}
          key={"product_id"}
          scroll={{ x: 300 }}
          expandableTableCurrent={{
            expandedRowRender: (record) => (
              <MainDataTable
                tableHeaderHidden={true}
                customHeader={false}
                data={record?.list}
                columns={[
                  {
                    title:"Massa",
                    dataIndex: "massa",
                    render: (_, {massa}) => <MainNumberFormat value={massa} />
                  },
                  {
                    title:"Izoh",
                    dataIndex: "izoh",
                  },
                  {
                    title:"Vaqt",
                    dataIndex: "vaqt",
                  },
                ]}
              />
            ),
          }}
        />
      </Section>
    </div>
  );
}

export default UploaderReportPateriya;
