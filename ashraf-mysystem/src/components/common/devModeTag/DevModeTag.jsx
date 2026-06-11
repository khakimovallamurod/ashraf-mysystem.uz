import { Tag, Tooltip } from "antd";
import React from "react";

function DevModeTag() {
  return (
    <Tooltip title="Qurish jarayonida. Tez orada yuklanadi va ma'lumotlar ko'rinadi">
      <Tag color="warning">Jarayonda...</Tag>
    </Tooltip>
  );
}

export default DevModeTag;
