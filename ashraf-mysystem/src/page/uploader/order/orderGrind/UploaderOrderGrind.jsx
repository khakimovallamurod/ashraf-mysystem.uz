import { Divider, Typography } from "antd";
import React, { useMemo, useRef } from "react";
import MainRow from "../../../../components/ui/row/MainRow";
import { useGetUploaderOrderGrindInProcessQuery } from "../../../../features/uploader/order/orderOfGrind/uploaderOrderOfGrindApiSlice";
import UploaderOrderGrindItem from "./UploaderOrderGrindItem";
import UploaderOrderPutPolkaModal from "./UploaderOrderPutPolkaModal";

function UploaderOrderGrind() {
  /* Ref */
  const polkaModalRef = useRef(null);

  /* API */
  const { data, isLoading } = useGetUploaderOrderGrindInProcessQuery();

  /* Grind in proccess */
  const list = useMemo(() => {
    if (data?.success === true && data?.data && data?.data?.length) {
      return data?.data;
    }
    return [];
  }, [data]);

  /* Modal */
  const handleOpenSetPolkaModal = (orderId) => {
    polkaModalRef.current?.onOpen(orderId);
  };

  return (
    <>
      {/* Modal */}
      <UploaderOrderPutPolkaModal ref={polkaModalRef} />

      <div style={{ padding: "1.2rem 0" }}>
        <Typography.Title level={5}>
          Maydalashdan tushgan <br /> buyurtmalar{" "}
          <b style={{ opacity: 0.5 }}>{list.length} ta</b>
        </Typography.Title>
        <Divider />
        <MainRow>
          {isLoading
            ? Array(5)
                .fill()
                .map((_, index) => (
                  <UploaderOrderGrindItem key={index} isLoading={true} />
                ))
            : list.map((item) => (
                <UploaderOrderGrindItem
                  key={item.id}
                  {...item}
                  handleOpenModal={handleOpenSetPolkaModal}
                />
              ))}
        </MainRow>
      </div>
    </>
  );
}

export default UploaderOrderGrind;
