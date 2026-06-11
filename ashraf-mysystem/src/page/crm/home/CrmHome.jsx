import React from "react";
import Section from "../../../components/common/section/Section";
import CrmAddFeedback from "./components/CrmAddFeedback";
import CrmAddFeedbackHistory from "./components/CrmAddFeedbackHistory";

export default function CrmHome() {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <CrmAddFeedback />
      <CrmAddFeedbackHistory />
    </div>
  );
}
