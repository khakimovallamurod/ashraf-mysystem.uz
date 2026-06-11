import { Box, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import MainModal from "../../common/modal/MainModal";
import TabPanelForm from "./TabPanelForm";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function ProductBulkModal({ onClose, open, setValues, allBoxKg={largeBox: 0, smallBox: 0} }) {
  /* State */
  const [tabValue, setTabValue] = useState(0);
  const [bulk, setBulk] = useState({
    largeBox: {
      boxCount: 0,
      chickenCount: 0,
      boxAndChickenKg: 0,
      chickenKg: 0,
      data: [],
    },
    smallBox: {
      boxCount: 0,
      chickenCount: 0,
      boxAndChickenKg: 0,
      chickenKg: 0,
      data: [],
    },
    allBoxData: null,
  });

  useEffect(() => {
    const { largeBox, smallBox } = bulk;
    setValues({
      largeBox: {
        boxCount: largeBox.boxCount,
        chickenCount: largeBox.chickenCount,
        boxAndChickenKg: largeBox.boxAndChickenKg,
        chickenKg: largeBox.chickenKg,
      },
      smallBox: {
        boxCount: smallBox.boxCount,
        chickenCount: smallBox.chickenCount,
        boxAndChickenKg: smallBox.boxAndChickenKg,
        chickenKg: smallBox.chickenKg,
      },
      allBoxData: JSON.stringify({
        largeBox: largeBox.data,
        smallBox: smallBox.data,
      }),
    });
  }, [bulk]);

  /* Handle change tabs */
  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

  /* Handle change bulk */
  function handleChangeBulk(
    boxType,
    { boxCount, chickenCount, boxAndChickenKg, chickenKg, data }
  ) {
    const newBulk = { ...bulk };
    if (boxType === "large") {
      /* Large box */
      newBulk.largeBox.boxCount = boxCount;
      newBulk.largeBox.chickenCount = chickenCount;
      newBulk.largeBox.boxAndChickenKg = boxAndChickenKg;
      newBulk.largeBox.chickenKg = chickenKg;
      newBulk.largeBox.data = data;
    } else if (boxType === "small") {
      /* Small box */
      newBulk.smallBox.boxCount = boxCount;
      newBulk.smallBox.chickenCount = chickenCount;
      newBulk.smallBox.boxAndChickenKg = boxAndChickenKg;
      newBulk.smallBox.chickenKg = chickenKg;
      newBulk.smallBox.data = data;
    }
    setBulk(newBulk);
  }

  return (
    <MainModal
      onClose={onClose}
      open={open}
      style={{ width: "100%", maxWidth: "800px" }}
    >
      <Box sx={{ bgcolor: "background.paper" }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Katta yashik" />
          <Tab label="Kichik yashik" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <TabPanelForm
            onChangeBulk={handleChangeBulk}
            boxType={"large"}
            boxKg={allBoxKg.largeBox||0}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <TabPanelForm
            onChangeBulk={handleChangeBulk}
            boxType={"small"}
            boxKg={allBoxKg.smallBox||0}
          />
        </TabPanel>
      </Box>
    </MainModal>
  );
}

export default ProductBulkModal;
