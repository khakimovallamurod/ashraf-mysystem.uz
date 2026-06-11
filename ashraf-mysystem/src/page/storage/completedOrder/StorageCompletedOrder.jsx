import React from "react";
import StorageCompletedOrderGrind from "./StorageCompletedOrderGrind";
import StorageCompletedOrderReception from "./StorageCompletedOrderReception";
import StorageCompletedPolkaHistory from "./StorageCompletedPolkaHistory";

function StorageCompletedOrder() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <StorageCompletedOrderGrind />
      <StorageCompletedOrderReception />
      <StorageCompletedPolkaHistory />
    </div>
  );
}

export default StorageCompletedOrder;
