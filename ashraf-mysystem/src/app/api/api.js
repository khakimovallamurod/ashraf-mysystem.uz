
// const MAIN_API = "/shohruh-system/shohruh-system/api";
const MAIN_API = "/ashraf-mysystem.uz/ashraf-backend/api";
// https://maestro-samarkand.uz/shohruh-system/api
/* AUTH */
const AUTH_API = {
    LOGIN: "/user/login.php",
    USER_DATA: "/user/get-user.php",
};

/* PATERIYA */
const PATERIYA_API = {
    PATERIYA_ADD: "/yuklovchi/add-paterya.php",
};

/* ADMIN */
const ADMIN_API = {
    /* BALANCE */
    BALANCE_GET: "/admin/get-balans.php",
    INDEX_DATA_GET: "/saqlash/get-index-data.php",
    /* DEPARTMENT */
    DEPARTMENT_GET: "/admin/get-bulim.php",
    DEPARTMENT_ADD: "/admin/add-bulim.php",
    /* POLKA */
    POLKA_GET: "/admin/get-polka.php",
    POLKA_GET_BY_DEPARTMENT: (id) => `/admin/get-polka.php?bulim_id=${id}`,
    POLKA_ADD: "/admin/add-polka.php",
    /* PRODUCTS */
    PRODUCT_GET: "/admin/get-products.php",
    PRODUCT_ADD: "/admin/add-products.php",
    PRODUCT_PRICE_ADD: "/admin/add-price-list.php",
    /* WORKER */
    WORKER_GET: "/admin/get-workers.php",
    WORKER_ADD: "/admin/add-workers.php",
    /* CUSTOMER CATEGORY */
    CUSTOMER_CATEGORY_GET: "/admin/get-client-category.php",
    CUSTOMER_CATEGORY_ADD: "/admin/add-client-category.php",
    /* USER */
    USER_GET: "/admin/get-user.php",
    USER_ADD: "/admin/add-user.php",
    USER_PUT: "/admin/get-user.php",
    USER_DELETE: (id) => `/admin/get-user.php?id=${id}`,
    /* EXPENSES */
    EXPENSES_GET: "/admin/get-harajatlar.php",
    EXPENSES_ADD: "/admin/add-harajat.php",
    EXPENSES_DELETE: (id) => `/admin/get-harajatlar.php?id=${id}`,

    /* DIVIDEND */
    DIVIDEND_GET: ({start, end, dividendCategory}) =>
    `/admin/get-dvidents.php?sana1=${start}&sana2=${end}&dvident_category_id=${dividendCategory}`,
    DIVIDEND_ADD: "/admin/add-dvident.php",
    DIVIDEND_DELETE: (id) => `/admin/get-dvidents.php?id=${id}`,

    /* DIVIDEND_ANCLOSE */
    DIVIDEND_ANCLOSE_GET: "/admin/get-madads.php",
    DIVIDEND_ANCLOSE_ADD: "/admin/add-dvident.php",

    // DIVIDEND CATEGORY 
    DIVIDEND_CATEGORY_GET: `/admin/get-dcategory.php`,
    DIVIDEND_CATEGORY_ADD: "/admin/add-dcategory.php",

    /* EXPENSES CATEGORY */
    EXPENSES_CATEGORY_GET: "/admin/get-hcategory.php",
    EXPENSES_CATEGORY_ADD: "/admin/add-hcategory.php",

    /* TA'MINOTCHI BOSHQARUVI */
    SUPPLIER_MGMT_GET: "/admin/get-taminotchi.php",
    SUPPLIER_MGMT_ADD: "/sklad/add-taminotchi.php",
    SUPPLIER_MGMT_EDIT: (id) => `/sklad/edit-taminotchi.php?id=${id}`,
    SUPPLIER_MGMT_DELETE: (id) => `/admin/get-taminotchi.php?id=${id}`,
    SUPPLIER_MGMT_PAYMENTS_GET: ({ supplierId, start, end }) =>
        `/admin/get-taminotchi-pay-history.php?sana1=${start}&sana2=${end}&id=${supplierId || ""}`,
    SUPPLIER_MGMT_REPORT_GET: ({ supplierId, start, end }) =>
        `/saqlash/get-mijoz-report.php?taminotchi_id=${supplierId}&sana1=${start}&sana2=${end}`,
    SUPPLIER_MGMT_ALL_REPORT_GET: ({ start, end }) =>
        `/saqlash/get-mijozlar-hisobot.php?taminotchi_id=0&sana1=${start}&sana2=${end}`,

    /* MIJOZ BOSHQARUVI */
    CUSTOMER_MGMT_GET: "/sotuv/get-clients.php",
    CUSTOMER_MGMT_ADD: "/sotuv/add-client.php",
    CUSTOMER_MGMT_EDIT: (id) => `/sotuv/edit-client.php?id=${id}`,
    CUSTOMER_MGMT_DELETE: (id) => `/sotuv/get-clients.php?id=${id}`,
    CUSTOMER_MGMT_TRANSACTIONS_GET: ({ customerId, start, end }) =>
        `/sotuv/get-mijoz-report.php?client_id=${customerId}&sana1=${start}&sana2=${end}`,
    CUSTOMER_MGMT_REPORT_GET: ({ customerId, start, end }) =>
        `/sotuv/get-mijoz-report.php?client_id=${customerId}&sana1=${start}&sana2=${end}`,

    /* OMBOR VA LOGISTIKA */
    WAREHOUSE_TRANSFER_GET: ({ start, end }) =>
        `/saqlash/get-moved-history.php?sana1=${start}&sana2=${end}`,
    WAREHOUSE_TRANSFER_ADD: "/saqlash/move-to-xolodelnik.php",
    WAREHOUSE_MASS_REPORT_GET: ({ start, end }) =>
        `/admin/get-massa-report.php?sana1=${start}&sana2=${end}`,

    /* MOLIYA */
    FINANCE_DEBTS_GET: ({ start, end }) =>
        `/kassir/get-dostavka-debit-history.php?dostavka_id=0&sana1=${start}&sana2=${end}`,
    FINANCE_EXPENSES_GET: ({ start, end, categoryId }) =>
        `/admin/get-harajatlar.php?sana1=${start}&sana2=${end}&harajat_category_id=${categoryId || ""}`,
    FINANCE_SALARY_GET: ({ start, end }) =>
        `/kassir/get-oylik-pay-history.php?worker_id=0&sana1=${start}&sana2=${end}`,
    FINANCE_SALARY_ADD: "/kassir/pay-worker.php",

    /* RESIDUE */
    RESIDUE_GET: "/admin/get-ostatka.php",
    RESIDUE_MORE_GET: (polkaId, productId) => `/admin/get-ostatka-by-partiya.php?polka_id=${polkaId}&product_id=${productId}`,

    /* REPORT GRIND */
    REPORT_GRIND_GET_BY_DATE: ({start, end}) =>  `/admin/get-maydalash-narx-hisobot.php?sana1=${start}&sana2=${end}`,
};

/* CASHIER */
const CASHIER_API = {
    /* SALE ORDER */
    SALE_ORDER_GET: "/kassir/get-sale-orders.php",
    SALE_ORDER_GET_BY_DATE: (date1, date2) =>
        `/kassir/get-sale-orders.php?sana1=${date1}&sana2=${date2}`,
    /* BALANCE */
    BALANCE_GET_BY_DATE: (date) =>
        `/kassir/get-balans.php?sana1=${date.start}&sana2=${date.end}`,
    BALANCE_CHANGE_ADD: "/kassir/change-hisob.php",
    BALANCE_CHANGE_HISTORY_GET: "/kassir/get-exchange-historys.php",

    /* EXPENSES */
    EXPENSES_GET_BY_DATE: ({start, end, expenseCategory}) =>
        `/kassir/get-harajatlar.php?sana1=${start}&sana2=${end}&harajat_category_id=${expenseCategory}`,
    EXPENSES_ADD: "/kassir/add-harajat.php",
    EXPENSES_DELETE: (id) => `/kassir/get-harajatlar.php?id=${id}`,
    EXPENSES_CATEGORY_GET: "/admin/get-hcategory.php",
    /* MONGTHLY SALARY */
    MONTHLY_BUTCHER_ADD: "/kassir/qassob-oylik.php",
    MONTHLY_WORKER_ADD: "/kassir/worker-oylik.php",

    /* SUPPLIER */
    SUPPLIER_GET: "/kassir/get-dostavka-balans.php",
    SUPPLIER_HISTORY_GET: (date) =>
        `/kassir/get-dostavka-pays-history.php?sana1=${date.start}&sana2=${date.end}&dostavka_id=${date.supplierId}`,
    SUPPLIER_ADD: "/kassir/krim.php",

    /* CUSTOMER REPORT */
    CUSTOMER_REPORT_GET: (date) =>
        `/kassir/get-dostavka-debit-history.php?sana1=${date.start}&sana2=${date.end}&dostavka_id=${date.supplierId}`,

    /* PRODUCTS */
    PRODUCTS_OF_COMPLE_DEPART_GET: "/kassir/get-products.php",

    /* PRODUCT PROVIDER FOR SKLAD */
    PROVIDER_GET: "/sklad/get-taminotchi.php",

    /* PRODUCT PROVIDER FOR CASHIER */
    PROVIDER_GET_OF_CASHIER: "/kassir/get-taminotchi.php",
    PROVIDER_PAY_HISTORY_GET: "/kassir/get-taminotchi-pay-history.php",
    PROVIDER_PAY_ADD: "/kassir/pay-taminotchi.php",

    /* SMS */
    SMS_CONFIRM_ADD: "/kassir/check-sms-code.php",

    /* SALARY */
    // worker
    WORKER_GET: "/kassir/get-workers.php",
    WORKER_SALARY_ADD: "/kassir/pay-worker.php",
    WORKER_SALARY_HISTORY_GET: (date) =>
        `/kassir/get-oylik-pay-history.php?worker_id=${date.workerId}&sana1=${date.start}&sana2=${date.end}`,
    // WORKER_SALARY_HISTORY_GET: (date) =>
    //   "/kassir/get-oylik-pay-history.php?worker_id=3&sana1=01.11.2023&sana2=13.11.2023",

    // butcher
    BUTCHER_GET: "/kassir/get-qassob.php",
    BUTCHER_SALARY_ADD: "/kassir/pay-qassob.php",
    BUTCHER_SALARY_HISTORY_GET: "",
};

/* SKLAD */
const SKLAD_API = {
    /* PROVIDER */
    PROVIDER_GET: "/sklad/get-taminotchi.php",
    PROVIDER_GET_BY_ID: (id) => `/sklad/get-taminotchi.php?id=${id}`,
    PROVIDER_ADD: "/sklad/add-taminotchi.php",
    PROVIDER_EDIT: (id) => `/sklad/edit-taminotchi.php?id=${id}`,
    /* BUTCHER */
    BUTCHER_GET: "/sklad/get-qassob.php",
    BUTCHER_GET_BY_ID: (id) => `/sklad/get-qassob.php?id=${id}`,
    BUTCHER_ADD: "/sklad/add-qassob.php",
    BUTCHER_EDIT: (id) => `/sklad/get-qassob.php?id=${id}`,
    /* SETTINGS */
    SETTINGS_GET: "/sklad/get-settings.php",
    /* PRODUCT RECEPTION */
    PRODUCT_RECEPTION_ADD: "/sklad/add-krim.php",
    PRODUCT_RECEPTION_GET: "/sklad/get-krim.php",
    PRODUCT_RECEPTION_GET_BY_DATE: (date) =>
        `/sklad/get-krim.php?sana1=${date.start}&sana2=${date.end}`,
    PRODUCT_RECEPTION_DEL: (id) => `/sklad/get-krim.php?id=${id}`,
    PRODUCT_RECEPTION_SMS_SEND: "/sklad/send-krim-sms.php",
};

/* GRIND PRODUCT */
const GRIND_PRODUCT_API = {
    /* POLKA */
    POLKA_GET: "/maydalash/get-polka.php",

    /* NOTIFICATIONS */
    // SALES
    NOTIF_FROM_SALES_GET: "/maydalash/sotuv-zayavka-count.php",
    NOTIF_LIST_FROM_SALES_GET: "/maydalash/get-zayavka-sotuv-list.php",
    // STORAGE
    NOTIF_FROM_STORAGE_GET: "/maydalash/saqlash-tayyor-count.php",
    NOTIF_LIST_FROM_STORAGE_GET: "/maydalash/get-saqlash-tayyor-list.php",

    /* SALES ORDER */
    SALES_IN_PROCESS_ORDER: "/maydalash/get-doing-zayavka-sotuv.php",
    SALES_ORDER_CONFIRM_ADD: (id) =>
        `/maydalash/confirm-zayavka-sotuv.php?id=${id}`,

    /* STORAGE ORDER */
    STORAGE_IN_PROCESS_ORDER: "/maydalash/get-doing-saqlash-tayyor.php",
    STORAGE_ORDER_CONFIRM_ADD: (id) =>
        `/maydalash/confirm-saqlash-tayyor.php?id=${id}`,
    STORAGE_ORDER_CLOSE_ADD: "/maydalash/end-maydalash.php",

    /* GRIND OUT */
    GRIND_OUT_PRODUCT: ({start, end}) =>
        `/maydalash/get-done-maydalash.php?sana1=${start}&sana2=${end}`,
    GRIND_OUT_PRODUCT_DELETE: (id) =>
        `/maydalash/get-done-maydalash.php?id=${id}`,
    GET_OUT_PRODUCT_ITEM_GET: ({partiyaId, productId}) =>
        `/maydalash/get-maydalash-by-pr.php?partiya_id=${partiyaId}&product_id=${productId}`,

    /* REGRIND */
    REGRIND_LIST: "/maydalash/get-qayta-maydalash-list.php",
    REGRIND_LIST_HISTORY_GET: ({start, end}) =>
        `/maydalash/get-done-qayta-maydalash.php?sana1=${start}&sana2=${end}`,
    REGRIND_CONFIRM: (id) => `/maydalash/confirm-qayta-maydalash.php?id=${id}`,
    REGRIND_IN_PROGRESS: "/maydalash/get-qayta-maydalash-doing-list.php",
    REGRIND_ADD: "/maydalash/qayta-maydalash.php",
    REGRIND_CLOSE_ORDER_ADD: "/maydalash/end-qayta-maydalash.php",

    PLACING_ORDER_TO_STORAGE: "/maydalash/add-zayavka-saqlash.php",
    GRIND_OUT: "/maydalash/send-tayyor.php",
    GET_WORKERS: "/maydalash/get-workers.php",
    GET_PRODUCTS: "/maydalash/get-products.php",

    /* SPARE */
    SPARE_GET: "/maydalash/get-mahsulotlar.php",
    SPARE_PRODUCT_GET: "/maydalash/get-mahsulotlar-pr.php",

    /* PARTIYANI BIRLASHTIRISH */
    PARTIYA_ADD: "/maydalash/combine-party.php",
};

/* PRODUCT STORAGE */
const PRODUCT_STORAGE = {
    /* NOTIFICATIONS */
    NOTIF_FROM_RECEPTION_GET: "/saqlash/get-krim-count.php",
    NOTIF_LIST_FROM_RECEPTION_GET: "/saqlash/get-must-krim-puts.php",
    NOTIF_FROM_GRIND_GET: "/saqlash/get-zayavkamay-count.php",
    NOTIF_LIST_FROM_GRIND_GET: "/saqlash/get-maydalash-orders.php",

    /* POLKA */
    POLKA_GET: "/saqlash/get-polka.php",
    POLKA_GET_BY_ID: (id) => `/saqlash/get-polka.php?bulim_id=${id}`,
    POLKA_HISTORY_GET_BY_DATE: (date) =>
        `/saqlash/get-old-polka.php?sana1=${date.start}&sana2=${date.end}`,

    /* PUT POLKA */
    POLKA_PUT: "/saqlash/put-polka.php",

    /* ORDER RECEPTION*/
    ORDER_CONFIRM_FROM_RECEPTION: (id) =>
        `/saqlash/confirm-krim-zayavka.php?id=${id}`,
    ORDER_UPLOADING_GET_FROM_RECEPTION: "/saqlash/get-my-krim-puts.php",
    ORDER_COMPLETED_GET_FROM_RECEPTION_BY_DATE: (date) =>
        `/saqlash/get-my-krim-puts-done.php?sana1=${date.start}&sana2=${date.end}`,
    ORDER_RECEPTION_GET_BY_POLKA: (id) =>
        `/saqlash/get-krim-by-polka.php?id=${id}`,

    /* ORDER GRIND */
    ORDER_CONFIRM_FROM_GRIND: (id) =>
        `/saqlash/confirm-maydalash-zayavka.php?id=${id}`,
    ORDER_UPLOADING_GET_FROM_GRIND: "/saqlash/get-my-maydalash-orders.php",
    ORDER_COMPLETED_GET_FROM_GRIND_BY_DATE: (date) =>
        `/saqlash/get-my-maydalash-orders-done.php?sana1=${date.start}&sana2=${date.end}`,
    ORDER_SEND_PRODUCT_TO_GRIND: "/saqlash/send-maydalash.php",

    /* REPORT */
    REPORT_GET: (date) =>
        `/saqlash/get-mijoz-report.php?taminotchi_id=${date.providerId}&sana1=${date.start}&sana2=${date.end}`,
    /* REPORT */
    REPORT_ALL_GET: (date) =>
        `/saqlash/get-mijozlar-hisobot.php?taminotchi_id=${date.providerId}&sana1=${date.start}&sana2=${date.end}`,
    REPORT_DETAIL_GET: ({id, status}) =>
        `/saqlash/get-data.php?id=${id}&status=${status}`,

    /* SPARE */
    SPARE_GET: "/saqlash/get-zahira.php",
};

/* SALES */
const SALES_API = {
    /* NOTIFICATIONS */
    NOTIF_MESSAGE_FROM_UPLOADER_GET: "/sotuv/count-cancel-items.php",
    NOTIF_LIST_FROM_UPLOADER_GET: "/sotuv/list-cancel-items.php",

    /* CANCEL ORDER */
    CANCELED_ORDER_HISTORY_GET_BY_DATE: (date) =>
        `/sotuv/list-cancel-items-history.php?sana1=${date.start}&sana2=${date.end}`,

    /* ORDER */
    UPLOADER_ORDER_CONFIRM_PUT: (id) =>
        `/sotuv/confirm-cancel-items.php?id=${id}`,

    /* PRODUCT */
    PRODUCT_GET: "/sotuv/get-products.php",

    /* ADD ORDER GRIND */
    PLACING_ORDER_TO_GRIND: "/sotuv/add-zayavka-maydalash.php",

    /* ADD ORDER UPLOADER */
    PLACING_ORDER_TO_UPLOADER: "/sotuv/add-sale-order.php",

    /* LOCATION */
    REGION_GET: "/sotuv/get-viloyat.php",
    DISTRICT_GET: (regionId) => `/sotuv/get-tuman.php?viloyat_id=${regionId}`,
    /* CUSTOMER */
    CUSTOMER_ADD: "/sotuv/add-client.php",
    CUSTOMER_GET: "/sotuv/get-clients.php",
    CUSTOMER_PUT: (id) => `/sotuv/edit-client.php?id=${id}`,
    CUSTOMER_CASH_IN_ADD: "/sotuv/client-pul-olish.php",
    CUSTOMER_CASH_IN_SEND_MESSAGE: "/sotuv/send-client-pay-notify.php",

    // Customer category
    CUSTOMER_CATEGORY_GET: "/sotuv/get-client-category.php",

    /* Supplier */
    SUPPLIER_GET: "/sotuv/get-dostavka.php",

    /* SALE ORDERS */
    ORDER_HISTORY_GET: "/sotuv/get-sale-orders.php",
    ORDER_HISTORY_GET_BY_DATE: (date) =>
        `/sotuv/get-sale-orders.php?client_id=${date.customerId}&sana1=${date.start}&sana2=${date.end}`,

    /* RETURN PRODUCT */
    RETURN_PRODUCT_HISTORY_GET: "/sotuv/get-vozvrat-history.php",
    RETURN_PRODUCT_HISTORY_GET_BY_DATE: (date) =>
        `/sotuv/get-vozvrat-history.php?sana1=${date.start}&sana2=${date.end}`,
    RETURN_PRODUCT_CONFIRM_PUT: (id) => `/sotuv/get-vozvrat.php?id=${id}`,

    /* REPORT */
    REPORT_GET: (date) =>
        `/sotuv/get-mijoz-report.php?client_id=${date.customerId}&sana1=${date.start}&sana2=${date.end}`,
    /* REPORT */
    REPORT_ALL_GET: (date) =>
        `/sotuv/get-mijozlar-hisobot.php?dostavka_id=${date.supplier}&sana1=${date.start}&sana2=${date.end}`,
    REPORT_DETAIL_GET: ({id, status}) =>
        `/sotuv/get-data.php?id=${id}&status=${status}`,
    REPORT_CUSTOMER_GET: (date) =>
        `/sotuv/get-mijozlar-hisobot-qarzdorlik.php?sana1=${date.start}&sana2=${date.end}&dostvka_id=${date.supplier}`,

    /* RAZILKA */
    RAZILKA_PRODUCTS_GET: "/sotuv/get-razilka-products.php",
    RAZILKA_GET: ({ sana1, sana2, status } = {}) =>
        `/sotuv/get-razilka.php?sana1=${sana1 || ""}&sana2=${sana2 || ""}&status=${status || ""}`,
    RAZILKA_ADD: "/sotuv/add-razilka.php",
    RAZILKA_OUTPUT: "/sotuv/razilka-output.php",

    /* TA'MINOTCHI TO'LOVLARI */
    TAMINOTCHI_GET: "/admin/get-taminotchi.php",
    TAMINOTCHI_PAY_HISTORY_GET: ({ taminotchiId, start, end }) =>
        `/sotuv/get-taminotchi-pay-history.php?taminotchi_id=${taminotchiId || 0}&sana1=${start || ""}&sana2=${end || ""}`,
    TAMINOTCHI_PAY_ADD: "/kassir/pay-taminotchi.php",
    TAMINOTCHI_CASH_IN_ADD: "/sotuv/taminotchi-pul-olish.php",
    TAMINOTCHI_SMS_CONFIRM_ADD: "/kassir/check-sms-code.php",

    /* MIJOZ TO'LOVLARI */
    CUSTOMER_PAY_HISTORY_GET: ({ clientId, start, end }) =>
        `/sotuv/get-client-pay-history.php?client_id=${clientId || 0}&sana1=${start || ""}&sana2=${end || ""}`,

    /* DELETE ORDER */
    ORDER_DELETE_POST: "/sotuv/delete-order-item.php",

    /* CONFIRM PRINT */
    PRINT_CHEK_CONFIRM: (orderId) => `/sotuv/set-chek.php?order_id=${orderId}`,
};

/* UPLOADER */
const UPLOADER_API = {
    /* SPARE PRODUCTS */
    UPLOADER_SPARE_PRODUCTS_GET: "/yuklovchi/get-mahsulotlar.php",

    /* GRIND */
    NOTIF_MESSAGE_FROM_GRIND_GET: "/yuklovchi/get-maydalash-count-products.php",
    NOTIF_LIST_FROM_GRIND_GET: "/yuklovchi/get-maydalash-products-list.php",
    /* SALES */
    NOTIF_MESSAGE_FROM_SALES_GET: "/yuklovchi/get-sotuv-count-orders.php",
    NOTIF_LIST_FROM_SALES_GET: "/yuklovchi/get-sotuv-orders-list.php",

    /* GRIND ORDER */
    GRIND_ORDER_IN_PROCESS_GET: "/yuklovchi/get-putting-products-list.php",
    GRIND_ORDER_CONFIRM_ADD: (id) =>
        `/yuklovchi/confirm-maydalash-product.php?id=${id}`,
    SET_POLKA_ADD: "/yuklovchi/product-maydalash-put-polka.php",
    QR_CODE_DATA_GET: (qrVal) => `/yuklovchi/get-qr-data.php?id=${qrVal}`,

    /* SALES ORDER */
    SALES_ORDER_IN_PROCESS_GET: `/yuklovchi/get-doing-orders.php?dostavka_id=0`,
    SALES_ORDER_CONFIRM_ADD: (id) =>
        `/yuklovchi/confirm-sotuv-order.php?id=${id}`,
    SALES_GIVE_ORDER: "/yuklovchi/give-polka-product.php",
    SALES_END_ORDER_ADD: "/yuklovchi/end-order.php",
    SALES_CHANGE_ORDER_SUPPLIER_PUT: (orderId) =>
        `/yuklovchi/change-dostavka.php?order_id=${orderId}`,

    /* POLKA */
    PART_GET: "/yuklovchi/get-bulim.php",
    POLKA_DATA_GET_BY_PART: (id) =>
        `/yuklovchi/get-polka-data.php?bulim_id=${id}`,
    POLKA_GET_BY_PART: (id) => `/yuklovchi/get-polka.php?bulim_id=${id}`,
    PARTIYA_GET_BY_POLKA: (id) =>
        `/yuklovchi/get-product-by-polka.php?polka_id=${id}`,
    POLKA_GET: "/yuklovchi/get-polka.php",
    POLKA_REPLACE_PUT: "/yuklovchi/change-polka.php",

    /* Regrind */
    REGRIND_GET: "/yuklovchi/get-qayta-products-list.php",
    REGRIND_IN_PROCESS_GET: "/yuklovchi/get-qayta-putting-list.php",
    REGRINT_ADD: "/yuklovchi/add-qayta-maydalash.php",
    REGIRIND_CONFIRM_ADD: (id) => `/yuklovchi/confirm-qayta-product.php?id=${id}`,
    REGRIND_SET_POLKA_ADD: "/yuklovchi/qayta-maydalash-put-polka.php",

    /* RETURN PRODUCTS */
    RETURN_PRODUCT_GET: "/yuklovchi/get-vozvrat.php",
    RETURN_PRODUCT_SET_POLKA_ADD: "/yuklovchi/put-vozvrat.php",

    /* ORDER CLOSE */
    ORDER_CLOSE_ADD: "/yuklovchi/delete-order-item.php",

    /* PRODUCTS */
    PRODUCTS_GET: "/yuklovchi/get-products.php",

    /* REPORT */
    REPORT_GET: "/yuklovchi/get-hisobot-by-product.php",
    REPORT_ALL_GET: (date) =>
        `/yuklovchi/get-hisobot-by-product.php?sana1=${date.start}&sana2=${date.end}`,
    REPORT_PATERIYA_GET_BY_DATE: (date) =>
        `/yuklovchi/get-paterya-history.php?sana1=${date.start}&sana2=${date.end}`,
    REPORT_RECEPTION_GET_BY_DATE: (date) =>
        `/yuklovchi/get-krim-hisobot.php?sana1=${date.start}&sana2=${date.end}`,
    REPORT_OUTPUTS_GET_BY_DATE: (date) =>
        `/yuklovchi/get-chiqim-hisobot.php?sana1=${date.start}&sana2=${date.end}`,
    REPORT_OUTPUTS_ITEM_MORE_GET: (date) =>
        `/yuklovchi/get-chiqim-hisobot-more.php?sana1=${date.start}&sana2=${date.end}&item_id=${date.itemId}`,
};

/* AGENT */
const AGENT_API = {
    /* PRODUCT */
    PRODUCT_GET: "/agent/get-products.php",

    /* LOCATION */
    REGION_GET: "/agent/get-viloyat.php",
    DISTRICT_GET: (regionId) => `/agent/get-tuman.php?viloyat_id=${regionId}`,

    /* CUSTOMER */
    CUSTOMER_ADD: "/agent/add-client.php",
    CUSTOMER_GET: "/agent/get-clients.php",
    // Customer category
    CUSTOMER_CATEGORY_GET: "/agent/get-client-category.php",

    /* ADD ORDER SALES */
    PLACING_ORDER_TO_SALES: "/agent/add-sale-order.php",
};

/* SUPPLIER */
const SUPPLIER_API = {
    /* NOTIFICATIONS */
    NOTIF_MESSAGE_FROM_ME_GET: "",
    NOTIF_LIST_FROM_ME_GET: "",
    NOTIF_MESSAGE_FROM_SALES_GET: "/dostavka/get-ready-count.php",
    NOTIF_LIST_FROM_SALES_GET: "/dostavka/get-sotuv-orders-list.php",

    /* DEBT */
    DEBT_GET: "/dostavka/get-qarz-yechish-history.php",
    DEBT_GET_BY_DATE: ({start, end}) =>
        `/dostavka/get-qarz-yechish-history.php?sana1=${start}&sana2=${end}`,
    DEBT_ADD: "/dostavka/qarz-olish.php",

    /* RETURN PRODUCT */
    RETURN_PRODUCT_GET: "/dostavka/get-vozvrat.php",
    RETURN_PRODUCT_HISTORY_GET: "/dostavka/get-vozvrat-history.php",
    RETURN_PRODUCT_ADD: "/dostavka/add-vozvrat.php",
    RETURN_PRODUCT_DELETE: (id) => `/dostavka/get-vozvrat.php?id=${id}`,

    /* ORDER */
    SALES_ORDER_IN_PROCESS_GET: "/dostavka/get-dostavka-orders.php",
    SALES_ORDER_CONFIRM_ADD: (id) => `/dostavka/confirm-order-sotuv.php?id=${id}`,
    SALES_GIVE_ORDER: (id) => `/dostavka/done-order-client.php?id=${id}`,
    /* BALANCE */
    BALANCE_GET: "/dostavka/get-my-balans.php",

    /* CUSTOMER */
    CUSTOMER_GET: "/dostavka/get-clients.php",

    /* CUSTOMER */
    GET_PRODUCTS: "/dostavka/get-products.php",

    /* CONFIRM */
    SMS_CONFIRM_ADD: (orderId) => `/dostavka/check-sms-code.php?id=${orderId}`,

    /* CHANGE ORDER */
    CHANGED_ORDER_LIST_GET: "/dostavka/change-zayavka-list.php",
    CHANGE_ORDER_SENDED_LIST_GET: "/dostavka/my-sent-list.php",
    CHANGE_ORDER_ADD: "/dostavka/change-order.php",
    CHANGE_CONFIRM_ORDER_PUT: (orderId) =>
        `/dostavka/confirm-change-orders.php?id=${orderId}`,

    /* SUPPLIER */
    SUPPLIER_LIST: "/dostavka/get-dostavka.php",

    /* SUBMITTED ORDER */
    SUBMITTED_ORDER_GET: "/dostavka/get-dostavka-orders-all.php",

    /* MY ACCOUNT */
    MY_ACCOUNT_GET_BY_DATE: ({start, end}) =>
        `/dostavka/my-hisob.php?sana1=${start}&sana2=${end}`,

    /* MY TERRITORY */
    MY_TERRITORY_GIVEN_PRODUCT_GET_BY_DATE: ({start, end}) =>
        `/dostavka/my-territoriy-orders.php?sana1=${start}&sana2=${end}`,
    MY_TERRITORY_RECEIVED_PRODUCT_GET_BY_DATE: ({start, end}) =>
        `/dostavka/my-territoriy-debits.php?sana1=${start}&sana2=${end}`,

    // MY INDICATOR
    MY_INDICATOR_GET: ({start, end}) => `/dostavka/get-kpi-day.php?sana1=${start}&sana2=${end}`,
    // MY_INDICATOR_GET: ({start, end}) => `/dostavka/get-kpi-day.php?sana1=${start}&sana2=${end}`,
    MY_INDICATOR_FRIENDS_GET: ({start, end}) => `/dostavka/get-hisobot-kpi-day.php?sana1=${start}&sana2=${end}`,

    // DEADLINE
    DEADLINE_GET: "/dostavka/muddat-list.php",
    DEADLINE_CLOSE_ADD: "/dostavka/muddat-close-by-pul.php",
    DEADLINE_UP_GET: (deadlineId, date) => `/dostavka/muddat-extend.php?id=${deadlineId}&sana=${date}`,
    SMS_CODE_CONFIRM_GET: (smsCode, deadlineId) =>  `/dostavka/muddat-extend-check.php?code=${smsCode}&id=${deadlineId}`
};

/* EXPORTS */
export {
    ADMIN_API,
    AGENT_API,
    AUTH_API,
    CASHIER_API,
    GRIND_PRODUCT_API,
    MAIN_API,
    PATERIYA_API,
    PRODUCT_STORAGE,
    SALES_API,
    SKLAD_API,
    SUPPLIER_API,
    UPLOADER_API,
};
