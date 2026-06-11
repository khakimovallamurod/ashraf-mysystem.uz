import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useMemo } from "react";

dayjs.extend(customParseFormat);

/* Date format */
const dateFormat = "YYYY-M-D";

function MainDateRanger({ onChange, isDisabled }) {
  /* Memo */
  const currentDate = useMemo(() => {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    let year = dateObj.getUTCFullYear();

    return year + "-" + month + "-" + day;
  }, []);

  /* handle change */
  const handleDateChange = (key, val) => {
    // Note: this component's onChange expects an array [start, end]
    // Since we now have two pickers, we'd need local state or we can just pass an array with the same date if it's currently only used for a single date?
    // Looking at defaultValue, it passes [currentDate, currentDate].
    // Let's implement local state for start and end dates.
  };

  const [dates, setDates] = React.useState({
    start: currentDate,
    end: currentDate
  });

  const onDateUpdate = (key, val) => {
    const newDates = { ...dates, [key]: val || "" };
    setDates(newDates);
    onChange([newDates.start, newDates.end]);
  };

  return (
    <div style={{ marginBottom: "2rem", width: "100%", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <DatePicker
          format={dateFormat}
          value={dates.start ? dayjs(dates.start, dateFormat) : null}
          onChange={(_, val) => onDateUpdate("start", val)}
          disabled={isDisabled}
          style={{ flex: 1 }}
          allowClear={false}
        />
        <DatePicker
          format={dateFormat}
          value={dates.end ? dayjs(dates.end, dateFormat) : null}
          onChange={(_, val) => onDateUpdate("end", val)}
          disabled={isDisabled}
          style={{ flex: 1 }}
          allowClear={false}
        />
      </div>
    </div>
  );
}

export default MainDateRanger;
