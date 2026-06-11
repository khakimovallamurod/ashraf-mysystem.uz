import React from "react";

function PrintChekTable({
  columns = [],
  data = [],
  rowKey = "id",
  border = "default",
}) {
  return (
    <table
      className={`printTable printCheckTable ${
        border === "none"
          ? "borderNone"
          : border === "row"
          ? "borderRow"
          : "border"
      }`}
    >
      <thead>
        <tr>
          {columns.map((item) => (
            <th key={item.key}>{item.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!data.length ? (
          <tr>
            <td colSpan={4}>
              <div style={{ textAlign: "center" }}>Ma'lumot mavjud emas!</div>
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item[rowKey]}>
              {columns.map((colItem) => (
                <td key={colItem.key}>
                  <div className="printCheckItem">
                    {colItem?.render
                      ? colItem?.render(item[colItem?.dataIndex], item)
                      : item[colItem.dataIndex]}
                  </div>
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default PrintChekTable;
