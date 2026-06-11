import React from 'react';
import FormItem from "antd/es/form/FormItem";
import {NumericFormat} from "react-number-format";
import {Input} from "antd";
import removeComma from "../../../util/removeComma";

function MainInputPrice({status, name, label, showLabel, onChange = () => {},autoFocus, style={}}) {

    const handleChange = (val) => {
        onChange(removeComma(val.target?.value))
    }

    return (
        <FormItem
            label={showLabel?label:''}
            name={name}
            hasFeedback
            validateStatus={status}
            initialValue={0}
            rules={[
                {
                    required: true,
                    message: `${label} talab qilinadi!`,
                },
            ]}
            style={style}
        >
            <NumericFormat
                customInput={Input}
                thousandSeparator=","
                min={0}
                placeholder={`${label} kiritish`}
                onChange={handleChange}
                autoFocus={autoFocus}
                inputMode='numeric'
            />
        </FormItem>
    );
}

export default MainInputPrice;