import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MainModal from "../../../common/modal/MainModal";
import { Segmented, message } from "antd";
import WeightModalForm from "./WeightModalForm";

const options = [
  {
    value: "largeBox",
    label: "Katta yashik",
  },
  {
    value: "smallBox",
    label: "Kichik yashik",
  },
];
function WeightModal({
  open,
  onClose,
  onSave,
  settingsData,
  onClear,
  handleClearAllBox,
}) {
  /* Ref */
  const largeBoxRef = useRef(null);
  const smallBoxRef = useRef(null);

  /* State */
  const [activeTab, setActiveTab] = useState("largeBox");

  /* Handle clear all inputs */
  useEffect(() => {
    if (onClear > 0) {
      largeBoxRef.current?.onClear();
      smallBoxRef.current?.onClear();
      handleClearAllBox();
    }
  }, [onClear]);

  /* Segment handle */
  const handleSegmentChange = (e) => setActiveTab(e);

  /* Handle change bulk */
  const handleSaveWeight = (boxType, inputsData) => {
    /* Validate data */
    if (!boxType) {
      throw new Error("`boxType` required");
    }
    if (!Array.isArray(inputsData)) {
      throw new Error("`inputsData` is required to be an array");
    }

    if(!inputsData?.length) return
    
    onSave({ data: inputsData, boxType });
  };

  return (
    <MainModal open={open} onClose={onClose}>
      <Segmented
        block
        value={activeTab}
        options={options}
        onChange={handleSegmentChange}
      />

      {/* Form */}

      <WeightModalForm
        activeTab={activeTab}
        ref={largeBoxRef}
        onChange={handleSaveWeight}
        boxType={"largeBox"}
        initialValues={{
          boxCount: settingsData.largeBox.boxCount,
          chickenCount: settingsData.largeBox.chickenCount,
        }}
      />

      <WeightModalForm
        activeTab={activeTab}
        ref={smallBoxRef}
        onChange={handleSaveWeight}
        boxType={"smallBox"}
        initialValues={{
          boxCount: settingsData.smallBox.boxCount,
          chickenCount: settingsData.smallBox.chickenCount,
        }}
      />
    </MainModal>
  );
}

export default memo(WeightModal);
