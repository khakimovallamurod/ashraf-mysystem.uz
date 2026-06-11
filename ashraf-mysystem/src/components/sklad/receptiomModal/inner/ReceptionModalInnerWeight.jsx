import { Button, Space, Typography } from "antd";
import React, { useMemo, useState } from "react";
import WeightModal from "../weightModal/WeightModal";
const { Text } = Typography;

function ReceptionModalInnerWeight({
  settingsData,
  setValues,
  onClear,
  error,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [weightValues, setWeightValues] = useState({
    largeBox: [],
    smallBox: [],
  });

  const openWeightModal = useMemo(() => {
    return openModal;
  }, [openModal]);

  const handleClearAllBox = () => {
    setWeightValues({
      largeBox: [],
      smallBox: [],
    });
    setValues({
      largeBox: [],
      smallBox: [],
    });
  };

  /* Weight Modal */
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  /* Handle change wight */
  const handleChangeWeight = ({ data, boxType }) => {
    if (boxType === "largeBox" || (boxType === "smallBox" && data.length)) {
      const weightData = { ...weightValues };
      weightData[boxType] = [...data];

      setValues({ ...weightData });
      setWeightValues(weightData);
    }
  };

  return (
    <>
      {/* Weight modal */}
      <WeightModal
        open={openWeightModal}
        onClose={handleCloseModal}
        settingsData={settingsData}
        onSave={handleChangeWeight}
        onClear={onClear}
        handleClearAllBox={handleClearAllBox}
      />

      <Space style={{ display: "block", width: "100%" }}>
        <Button
          value={"123"}
          type="dashed"
          style={{ width: "100%" }}
          onClick={handleOpenModal}
          danger={error.empty || error.calc}
        >
          Hajm
        </Button>
        <div style={{ height: "25px" }}>
          <Text type="danger">
            {error.empty
              ? "Hajmni kiriting!"
              : error.calc
              ? "Hajmni to'g'ri kiriting!"
              : null}
          </Text>
        </div>
      </Space>
    </>
  );
}

export default ReceptionModalInnerWeight;
