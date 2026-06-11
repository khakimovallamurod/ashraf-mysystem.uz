import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {Button, Input, Space, Table} from "antd";
import React, {useMemo, useRef, useState} from "react";
import Highlighter from "react-highlight-words";
import MainModal from "../../../../components/common/modal/MainModal";
import Section from "../../../../components/common/section/Section";
import CashierAddSalaryModalButcher from "./CashierAddSalaryModalButcher";
import {useGetCashierButcherQuery} from "../../../../features/cashier/salary/cashierSalaryApiSlice";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";

function CashierSalaryButcher() {
    /* State */
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [openAddSalaryModal, setOpenAddSalaryModal] = useState(false);

    /* TABLE ACTIONS */
    /* Hancle Search */
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0] || "");
        setSearchedColumn(dataIndex);
    };

    /* Handle reset */
    const handleReset = (clearFilters) => {
        clearFilters("");
        setSearchText("");
    };

    /* API */
    const butcherRes = useGetCashierButcherQuery();

    /* Memo */
    const butcherData = useMemo(() => {
        if (
            butcherRes?.data?.success === true &&
            butcherRes?.data?.data &&
            butcherRes?.data?.data?.length
        ) {
            return butcherRes?.data?.data;
        }
        return [];
    }, [butcherRes]);

    /* Get Column search */
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys,
                             selectedKeys,
                             confirm,
                             clearFilters,
                             close,
                         }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText("");
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            if (record[dataIndex])
                return record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
            ...getColumnSearchProps("id"),
        },
        {
            title: "FIO",
            dataIndex: "fio",
            key: "fio",
            width: 150,
            ...getColumnSearchProps("fio"),
        },
        {
            title: "Balans",
            dataIndex: "balans",
            key: "balans",
            width: 150,
            ...getColumnSearchProps("balans"),
            render: (_, {balans}) => <MainNumberFormat value={balans} />
        },
        {
            title: "Telefon",
            dataIndex: "telefon",
            key: "telefon",
            width: 150,
            ...getColumnSearchProps("telefon"),
        },
    ];

    /* MODAL */
    const handleOpenSalaryModal = () => setOpenAddSalaryModal(true);
    const handleCloseSalaryModal = () => setOpenAddSalaryModal(false);

    return (
        <>
            <MainModal open={openAddSalaryModal} onClose={handleCloseSalaryModal}>
                <CashierAddSalaryModalButcher onClose={handleCloseSalaryModal}/>
            </MainModal>

            <Section>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "end",
                        marginBottom: "1rem",
                    }}
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={handleOpenSalaryModal}
                    >
                        Qassobga oylik chiqarish
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={butcherData}
                    // loading={isLoading}
                    scroll={{
                        x: 400,
                        y: 700,
                    }}
                    // locale={{
                    //   emptyText: () => {
                    //     if (isError && !isLoading) {
                    //       return <MainRefetchBtn refetch={refetch} />;
                    //     } else {
                    //       return <Empty />;
                    //     }
                    //   },
                    // }}
                    rowKey={"id"}
                />
            </Section>
        </>
    );
}

export default CashierSalaryButcher;
