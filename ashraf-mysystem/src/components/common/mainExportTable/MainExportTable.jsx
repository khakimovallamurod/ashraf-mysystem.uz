import React from "react";

function MainExportTable({children}) {
  return (
    <table className={"main__table"}>
      <tbody>
        {children}
      </tbody>
    </table>
  );
}

export default MainExportTable;
