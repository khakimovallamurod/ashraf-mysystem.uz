import React from "react";

function TableTr({ children, rowSpan, colSpan, border = true, style = {} }) {
  return (
    <tr
      style={style}
      rowSpan={rowSpan}
      colSpan={colSpan}
      className={border ? "border" : ""}
    >
      {children}
    </tr>
  );
}

export default TableTr;
