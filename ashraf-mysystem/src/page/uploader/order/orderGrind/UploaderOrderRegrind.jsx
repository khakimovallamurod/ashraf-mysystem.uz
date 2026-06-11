import { Divider, Typography } from "antd";
import React, { useMemo, useRef } from "react";
import { useGetUploaderRegrindInProccessQuery } from "../../../../features/uploader/regrind/uploaderRegrindApiSlice";
import UploaderOrderGrindItem from "./UploaderOrderGrindItem";
import UploaderOrderPutPolkaModal from "./UploaderOrderPutPolkaModal";
import MainRow from "../../../../components/ui/row/MainRow";

function UploaderOrderRegrind() {
  /* Ref */
  const polkaModalRef = useRef(null);

  /* API */
  const { data, isLoading } = useGetUploaderRegrindInProccessQuery();

  /* Regrind in proccess */
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
      <UploaderOrderPutPolkaModal ref={polkaModalRef} from={"regrind"} />

      <div style={{ padding: "1.2rem 0" }}>
        <Typography.Title level={5}>
          Qayta maydalashdan tushgan <br /> buyurtmalar{" "}
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

export default UploaderOrderRegrind;
