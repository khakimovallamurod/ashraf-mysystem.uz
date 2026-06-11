import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import SelectDateTime from "../../../../components/ui/selectDateTime/SelectDateTime";

function DateAndCheckbox({ setValue, checked, value }) {
  // State
  const [dateValue, setDateValue] = useState({ time: null, date: null });
  const [checkbox, setCheckbox] = useState(false);
  const [mount, setMount] = useState(0);

  useEffect(() => {
    setValue({
      ...dateValue,
      checkbox,
      isChange: mount > 0,
    });
  }, [dateValue, checkbox, mount]);
  
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <SelectDateTime
        setValue={setDateValue}
        value={value}
        checked={checked || checkbox || value?.checkbox}
      />
      <Checkbox
        onChange={(val) => {
          setCheckbox(val.target.checked);
          setMount((prev) => prev + 1);
        }}
        checked={checkbox || checked}
      >
        <span className={"notSelect"}>Belgilash</span>
      </Checkbox>
    </div>
  );
}

export default DateAndCheckbox;
