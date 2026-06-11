import { Row, Col, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./mainRangeDatePicker.module.css";

function MainRangeDatePicker({ setValue = () => {}, value }) {
  /* State */
  const [date, setDate] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    if (value && value.start && value.end) {
      setDate({ ...value });
    } else {
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      // Format the dates as "YYYY-MM-DD" for input[type=date]
      let todayFormatted = today.toISOString().split("T")[0];
      let tomorrowFormatted = tomorrow.toISOString().split("T")[0];

      // const d = new Date();
      // const month = d.getMonth() + 1;
      // const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
      // const nextDay =
      //   d.getDate() < 10 ? `0${d.getDate() + 1}` : d.getDate() + 1;
      // const year = d.getFullYear();

      const newDate = {
        start: todayFormatted,
        end: tomorrowFormatted,
      };
      setDate({ ...newDate });
      setValue({ ...newDate });
    }
  }, [setValue, value]);

  const handleChangeData = (name, val) => {
    const newDate = { ...date };
    newDate[name] = val;

    setValue({ ...newDate });
    setDate({ ...newDate });
  };

  return (
    <Row gutter={[8, 8]} style={{ width: "100%", margin: 0 }}>
      <Col xs={12} sm={12}>
        <DatePicker
          format="YYYY-MM-DD"
          value={date.start ? dayjs(date.start, "YYYY-MM-DD") : null}
          onChange={(_, dateStr) => handleChangeData("start", dateStr)}
          style={{ width: "100%" }}
          placeholder="Boshlanish"
          allowClear={false}
        />
      </Col>
      <Col xs={12} sm={12}>
        <DatePicker
          format="YYYY-MM-DD"
          value={date.end ? dayjs(date.end, "YYYY-MM-DD") : null}
          onChange={(_, dateStr) => handleChangeData("end", dateStr)}
          style={{ width: "100%" }}
          placeholder="Tugash"
          allowClear={false}
        />
      </Col>
    </Row>
  );
}

export default MainRangeDatePicker;
