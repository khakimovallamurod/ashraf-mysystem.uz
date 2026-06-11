import { Close, RestartAlt, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { GridAddIcon } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./productBulkModal.module.css";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function TabPanelForm({ boxType, onChangeBulk, boxKg }) {
    /* State */
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState([
        {
            id: uuidv4(),
            inputs: ["", "", ""],
        },
    ]);
    const [count, setCount] = useState({
        box: 0,
        chicken: 0,
        boxAndChickenKg: 0,
        chickenKg: 0
    });

    /* Calculate */
    useEffect(() => {
        let boxCount = 0;
        let chickenCount = 0;
        let boxAndChickenKg = 0;

        inputs.forEach((item) => {
            boxCount += item.inputs[0] ? parseInt(item.inputs[0]) : 0;
            chickenCount += item.inputs[1] ? parseInt(item.inputs[1]) : 0;
            boxAndChickenKg += item.inputs[2] ? parseFloat(item.inputs[2]) : 0.0;
        });;
        setCount({
            box: boxCount,
            chicken: chickenCount,
            boxAndChickenKg: boxAndChickenKg,
            chickenKg: boxAndChickenKg-(boxCount*boxKg)
        });
    }, [boxKg, inputs]);
    /* Handle Change */
    function handleChange({ value, subIndex, index }) {
        const newInputs = [...inputs];
        newInputs[subIndex].inputs[index] = value;
        setInputs(newInputs);
    }

    /* Handle Add */
    function handleAddInputs() {
        setInputs([
            ...inputs,
            {
                id: uuidv4(),
                inputs: ["", "", ""],
            },
        ]);
    }

    /* Handle Remove */
    function handleRemoveInputs(id) {
        if (!id) return;
        const newInputs = [...inputs];
        const filteredInputs = newInputs.filter((item) => item.id !== id);
        setInputs(filteredInputs);
    }

    /* Handle Restart */
    function handleRestartInputs() {
        setInputs([
            {
                id: uuidv4(),
                inputs: ["", "", ""],
            },
        ]);
    }

    /* Handle Submit */
    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        
        /* Data for json data */
        const data = [];
        inputs.forEach(item => {
            data.push({
                boxCount: item.inputs[0],
                chickenCount: item.inputs[1],
                boxAndChickenKg: item.inputs[2]
            })
        })
        
        setTimeout(() => {
            onChangeBulk(boxType, {
                boxCount: count.box,
                chickenCount: count.chicken,
                boxAndChickenKg: formatFloatNumber(count.boxAndChickenKg),
                chickenKg: formatFloatNumber(count.chickenKg),
                data
            });
            setLoading(false);
        }, 500);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ pt: 2 }}>
                <Stack
                    spacing={2}
                    justifyContent={"space-between"}
                    direction={"row"}
                >
                    <Stack spacing={2} direction={"row"} alignItems={"center"}>
                        <Typography variant="caption">
                            Yashik soni: <b>{count.box}</b>
                        </Typography>
                        <Typography variant="caption">
                            Tovuq soni: <b>{count.chicken}</b>
                        </Typography>
                        <Typography variant="caption">
                            kg: <b>{formatFloatNumber(count.boxAndChickenKg)}</b>
                        </Typography>
                    </Stack>

                    <LoadingButton
                        variant="contained"
                        startIcon={<GridAddIcon />}
                        onClick={handleAddInputs}
                    >
                        Qo'shish
                    </LoadingButton>
                </Stack>
                <Stack spacing={2} className={styles.formInner}>
                    {inputs.map((item, i) => (
                        <Stack
                            direction={"row"}
                            spacing={2}
                            role="presentation"
                            key={item.id}
                        >
                            <TextField
                                type="number"
                                label="Yashik soni  "
                                size="small"
                                placeholder="0"
                                fullWidth
                                value={item.inputs[0]}
                                onChange={(e) =>
                                    handleChange({
                                        value: e.target.value,
                                        subIndex: i,
                                        index: 0,
                                    })
                                }
                            />
                            <TextField
                                type="number"
                                label="Tovuq soni"
                                size="small"
                                placeholder="0"
                                fullWidth
                                value={item.inputs[1]}
                                onChange={(e) =>
                                    handleChange({
                                        value: e.target.value,
                                        subIndex: i,
                                        index: 1,
                                    })
                                }
                            />
                            <TextField
                                type="number"
                                label="kg"
                                size="small"
                                placeholder="0.00"
                                fullWidth
                                value={item.inputs[2]}
                                onChange={(e) =>
                                    handleChange({
                                        value: e.target.value,
                                        subIndex: i,
                                        index: 2,
                                    })
                                }
                            />
                            <IconButton
                                color="error"
                                onClick={() => handleRemoveInputs(item.id)}
                                sx={{ visibility: i === 0 ? "hidden" : null }}
                            >
                                <Close sx={{ color: pink[500] }} />
                            </IconButton>
                        </Stack>
                    ))}
                </Stack>
                <Stack spacing={2} direction={"row"} pt={2}>
                    <LoadingButton
                        color="error"
                        variant="contained"
                        startIcon={<RestartAlt />}
                        onClick={handleRestartInputs}
                    >
                        Tozalash
                    </LoadingButton>
                    <LoadingButton
                        variant="contained"
                        startIcon={<Save />}
                        type="submit"
                        loading={loading}
                    >
                        Saqlash
                    </LoadingButton>
                </Stack>
            </Stack>
        </form>
    );
}

export default TabPanelForm;
