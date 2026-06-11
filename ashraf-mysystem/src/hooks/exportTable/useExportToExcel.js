import { Excel } from "antd-table-saveas-excel";

function useExportToExcel() {
  const handleSetData = (columns, data, otherData) => {
    return {
      columns: columns?.map((item) => {
        const { key, title, dataIndex } = item;
        return {
          key,
          title: title,
          dataIndex,
        };
      }),
      data: [...data, ...otherData],
    };
  };

  const onExport = ({ fileName='My-system-excel', columns = [], data = [], otherData = [] }) => {
    const res = handleSetData(columns, data, otherData);
    if (res) {
      const excel = new Excel();
      excel
        .addSheet("sheet 1")
        .addColumns(res.columns)
        .addDataSource(res?.data)
        .saveAs(`${fileName}.xlsx`);
    }
  };

  return [onExport];
}

export default useExportToExcel;
