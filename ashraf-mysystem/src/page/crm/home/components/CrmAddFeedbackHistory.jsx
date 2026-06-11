import React, { useMemo } from "react";
import Section from "../../../../components/common/section/Section";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";

const data = [
  {
    id: "1",
    name: "Toshmat",
    telefon: "+998(99)-123-45-67",
    tashkelot: "Toshmat holding",
    manzil: `numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
    nihil,`,
    vaqt: "12-12-2023",
  },
  {
    id: "2",
    name: "Eshmat",
    telefon: "+998(99)-123-45-67",
    tashkelot: "Eshmat holding",
    manzil: `eveniet aliquid culpa officia aut! Impedit sit sunt quaerat.  `,
    vaqt: "13-12-2023",
  },
  {
    id: "3",
    name: "Ahmat",
    telefon: "+998(99)-123-45-67",
    tashkelot: "Ahmat holding",
    manzil: `sapiente officiis modi at sunt excepturi expedita sint. `,
    vaqt: "14-12-2023",
  },
];

function CrmAddFeedbackHistory() {
  // Columns
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      sortType: "number",
      width: 50,
    },
    {
      title: "Mijoz nomi",
      dataIndex: "name",
      sortType: "string",
      width: 100,
    },
    {
      title: "Mijoz telefoni",
      dataIndex: "telefon",
      sortType: "string",
      width: 100,
    },
    {
      title: "Manzili",
      dataIndex: "manzil",
      sortType: "string",
      width: 250,
    },
    {
      title: "Sana",
      dataIndex: "vaqt",
      sortType: "string",
      width: 100,
    },
  ];

  // Data
  const tableData = useMemo(() => {
    return data;
  }, []);

  return (
    <div style={{ width: "50%" }}>
      <Section>
        <MainDataTable columns={columns} data={tableData} scroll={false} />
      </Section>
    </div>
  );
}

export default CrmAddFeedbackHistory;
