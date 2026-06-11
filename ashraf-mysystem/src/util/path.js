/* HOME */
export const HOME_ROUTE = "/";

/* REGISTER */
export const LOGIN_ROUTE = "/login";
export const PASSWORD_RESET_ROUTE = "/resetPassword";

/* ADMIN */
export const admin_routes = {
  home: "/admin",
  department: "/admin/department",
  polka: "/admin/polka",
  product: "/admin/product",
  workers: "/admin/worker",
  customerCategory: "/admin/customerCategory",
  user: "/admin/userList",
  expenses: "/admin/expenses",
  expensesCategory: "/admin/expensesCategory",
  devident: "/admin/divedent",
  devidentEnclose: "/admin/divedentEnclose",
  devidentCategory: "/admin/dividendCategory",
  residue: "/admin/residue",
  reportGrind: "/admin/reportGrind",
  // ta'minotchi boshqaruvi
  supplierManagement: "/admin/supplierManagement",
  supplierManagementAdd: "/admin/supplierManagement/add",
  supplierManagementPayments: "/admin/supplierManagement/payments",
  supplierManagementReport: "/admin/supplierManagement/report",
  supplierManagementAllReport: "/admin/supplierManagement/allReport",
  // mijoz boshqaruvi
  customerManagement: "/admin/customerManagement",
  customerManagementAdd: "/admin/customerManagement/add",
  customerManagementTransactions: "/admin/customerManagement/transactions",
  customerManagementReport: "/admin/customerManagement/report",
  // ombor va logistika
  warehouseTransfer: "/admin/warehouse/transfer",
  warehouseMassReport: "/admin/warehouse/massReport",
  // moliya
  financeDebts: "/admin/finance/debts",
  financeExpenses: "/admin/finance/expenses",
  financeSalary: "/admin/finance/salary",
  // storage depart
  storageDepart: "/admin/department/storage",
  storageSkladDepart: "/admin/department/storage/sklad",
  storageProviderDepart: "/admin/department/storage/provider",
  storageOrderFromGrindDepart: "/admin/department/storage/orderFromGrind",
  storagePolkaDepart: "/admin/department/storage/polka",
  storageCompltedOrderDepart: "/admin/department/storage/completedOrder",
  storageSpareDepart: "/admin/department/storage/spare",
  storageReportDepart: "/admin/department/storage/report",
  storageReportCustomerDepart: "/admin/department/storage/reportCustomer",
  /* grind depart */
  grindDepart: "/admin/department/grind",
  grindOrderFromSalesDepart: "/admin/department/grind/orderFromSales",
  grindOrderFromStorageDepart: "/admin/department/grind/orderFromStorage",
  grindOutFromGrindDepart: "/admin/department/grind/grindOutFromGrind",
  grindRegrindDepart: "/admin/department/grind/regrind",
  grindRegrindHistoryDepart: "/admin/department/grind/regrindHistory",
  grindSpareDepart: "/admin/department/grind/spare",
  grindSpareProductsDepart: "/admin/department/grind/spareProducts",
  /* sales depart */
  salesDepart: "/admin/department/sales",
  salesGrindDepart: "/admin/department/sales/grind",
  salesOrderToUploaderDepart: "/admin/department/sales/orderToUploader",
  salesCustomerDepart: "/admin/department/sales/customer",
  salesOrderHistoryDepart: "/admin/department/sales/orderHistory",
  salesOrderReturnedDepart: "/admin/department/sales/orderReturned",
  salesReportDepart: "/admin/department/sales/report",
  salesReportCustomerDepart: "/admin/department/sales/reportCustomer",
  salesReportAllDepart: "/admin/department/sales/reportAll",
  salesDailyReceiptsDepart: "/admin/department/sales/dailyReceipts",
  salesResolvedDebtHistory: "/admin/department/sales/resolvedDebtHistory",
  /* uploader depart */
  uploaderDepart: "/admin/department/uploader",
  uploaderOrderFromGrindDepart: "/admin/department/uploader/orderFromGrind",
  uploaderOrderFromGrindProcessDepart:
    "/admin/department/uploader/orderFromGrindProcess",
  uploaderOrderFromSalesDepart: "/admin/department/uploader/orderFromSales",
  uploaderOrderFromSalesProcessDepart:
    "/admin/department/uploader/orderFromSalesProcess",
  uploaderReplaceDepart: "/admin/department/uploader/replace",
  uploaderRegrindDepart: "/admin/department/uploader/regrind",
  uploaderRegrindProcessDepart: "/admin/department/uploader/regrindProcess",
  uploaderSparePartiyaDepart: "/admin/department/uploader/sparePartiya",
  uploaderReturnedProductsDepart: "/admin/department/uploader/returnedProducts",
  uploaderProductsDepart: "/admin/department/uploader/products",
  uploaderOrderToGrindDepart: "/admin/department/uploader/orderToGrind",
  uploaderOrderHistoryDepart: "/admin/department/uploader/orderHistory",
  uploaderReportDepart: "/admin/department/uploader/report",
  uploaderReportPateriyaDepart: "/admin/department/uploader/reportPateriya",
  uploaderReportReceptionDepart: "/admin/department/uploader/reportReception",
  uploaderReportOutputDepart: "/admin/department/uploader/reportExpenses",
  /* agent depart*/
  agentDepart: "/admin/department/agent",
  /* supplier depart*/
  supplierDepart: "/admin/department/supplier",
  supplierDebtDepart: "/admin/department/supplier/debt",
  supplierBalansDepart: "/admin/department/supplier/balans",
  supplierChangeOrderDepart: "/admin/department/supplier/changeOrder",
  supplierReturnProductDepart: "/admin/department/supplier/returnProduct",
  supplierReportDepart: "/admin/department/supplier/report",
  supplierReportCustomerDepart: "/admin/department/supplier/reportCustomer",
  supplierSubmittedOrdersDepart: "/admin/department/supplier/submittedOrders",
  /* cashier depart */
  cashierDepart: "/admin/department/cashier",
  cashierProviderMoneyGiven: "/admin/department/cashier/providerMoneyGiven",
  cashierProviderReport: "/admin/department/cashier/providerReport",
  cashierSupplierBalans: "/admin/department/cashier/supplierBalans",
  cashierSupplierGetMoney: "/admin/department/cashier/supplierGetMoney",
  cashierCustomerGetMoney: "/admin/department/cashier/customerGetMoney",
  cashierExpenses: "/admin/department/cashier/expenses",
  cashierSalary: "/admin/department/cashier/salary",
  cashierCompletedProductSection:
    "/admin/department/cashier/completedProductSection",
  cashierExchangeHistory: "/admin/department/cashier/exchangeHistory",
};

/* PRODUCT STORAGE DEPARTMENT */
export const PRODUCT_STORAGE_HOME_ROUTE = "/productStorage";
export const PRODUCT_STORAGE_SKLAD_ROUTE = "/productStorage/receptionProducts";
export const PRODUCT_STORAGE_PROVIDER_ROUTE = "/productStorage/provider";
export const PRODUCT_STORAGE_ORDER_GRIND_ROUTE = "/productStorage/orderGrind";
export const PRODUCT_STORAGE_ORDER_RECEPTION_ROUTE =
  "/productStorage/orderReception";
export const PRODUCT_STORAGE_POLKA_ROUTE = "/productStorage/polka";
export const PRODUCT_STORAGE_COMPLETED_ORDER_ROUTE =
  "/productStorage/completedOrder";
export const PRODUCT_STORAGE_SPARE_ROUTE = "/productStorage/spare";
export const PRODUCT_STORAGE_REPORT_ROUTE = "/productStorage/report";
export const PRODUCT_STORAGE_REPORT_ALL_ROUTE = "/productStorage/reportAll";
export const PRODUCT_STORAGE_RESIDUE = "/productStorage/residue";

/* GRIND PRODUCT DEPARTMENT*/
export const GRIND_PRODUCT_HOME_ROUTE = "/grindProduct";
export const GRIND_PRODUCT_ORDER_SALES_ROUTE = "/grindProduct/orderSales";
export const GRIND_PRODUCT_ORDER_STORAGE_ROUTE = "/grindProduct/orderStorage";
export const GRIND_PRODUCT_OUT_PRODUCT_FROM_GRIND_ROUTE =
  "/grindProduct/outProductFromGrind";
export const GRIND_REGRIND_ROUTE = "/grindProduct/regrind";
export const GRIND_REGRIND_HISTORY_ROUTE = "/grindProduct/regrindHistory";
export const GRIND_SPARE_ROUTE = "/grindProduct/spare";
export const GRIND_SPARE_PRODUCT_ROUTE = "/grindProduct/spareProduct";
export const GRIND_REPORT_PATERIYA_ROUTE = "/grindProduct/reportPateriya";
export const GRIND_RESIDUE = "/grindProduct/residue";

/* SALES DEPARTMENT */
export const SALES_HOME_ROUTE = "/sales";
export const SALES_ORDER_TO_GRIND_ROUTE = "/sales/orderGrind";
export const SALES_ORDER_TO_UPLOADER_ROUTE = "/sales/orderUploader";
export const SALES_PRODUCT_SALE_ROUTE = "/sales/productSale";
export const SALES_CUSTOMERS_ROUTE = "/sales/customers";
export const SALES_ORDER_HISTORY_ROUTE = "/sales/orderHistory";
export const SALES_RETURN_PRODUCT_ROUTE = "/sales/returnProduct";
export const SALES_REPORT_ROUTE = "/sales/report";
export const SALES_REPORT_CUSTOMER_ROUTE = "/sales/reportCustomer";
export const SALES_REPORT_ALL_ROUTE = "/sales/reportAll";
export const SALES_DAILY_RECEIPTS_ROUTE = "/sales/dailyReceipts";
export const SALES_CANCEL_HISTORY_ROUTE = "/sales/cancelHistory";
export const SALES_CUSTOMER_DATA_ROUTE = "/sales/customerData";
export const SALES_RESOLVED_DEBT_HISTORY_ROUTE = "/sales/resolvedDebtHistory";
export const SALES_DASHBOARD_ROUTE = "/sales/dashboard";
export const SALES_KASSA_ROUTE = "/sales/kassa";
export const SALES_RAZILKA_ROUTE = "/sales/razilka";
export const sales_routes = {
  home: "/sales/home",
  dashboard: SALES_DASHBOARD_ROUTE,
  kassa: SALES_KASSA_ROUTE,
  razilka: SALES_RAZILKA_ROUTE,
  supplierManagement: "/sales/supplierManagement",
  customerManagement: SALES_CUSTOMERS_ROUTE,
  productReception: "/sales/productReception",
  warehouseTransfer: "/sales/warehouse/transfer",
  financeDebts: "/sales/finance/debts",
  customerCashIn: "/sales/supplierManagement/cashIn",
  supplierManagementPayments: "/sales/supplierManagement/payments",
  supplierManagementAllReport: "/sales/supplierManagement/allReport",
  supplierManagementReport: "/sales/supplierManagement/report",
  warehouseMassReport: "/sales/warehouse/massReport",
  customerManagementReport: "/sales/customerManagement/report",
  customerManagementTransactions: "/sales/customerManagement/transactions",
  financeExpenses: "/sales/finance/expenses",
  financeSalary: "/sales/finance/salary",
  products: SALES_ORDER_TO_GRIND_ROUTE,
  orderToUploader: SALES_ORDER_TO_UPLOADER_ROUTE,
  customers: SALES_CUSTOMERS_ROUTE,
  orderHistory: SALES_ORDER_HISTORY_ROUTE,
  report: SALES_REPORT_ROUTE,
  reportCustomer: SALES_REPORT_CUSTOMER_ROUTE,
  dailyReceipts: SALES_DAILY_RECEIPTS_ROUTE,
  cancelHistory: SALES_CANCEL_HISTORY_ROUTE,
  resolvedDebtHistory: SALES_RESOLVED_DEBT_HISTORY_ROUTE,
  settingsDepartment: "/sales/settings/department",
  settingsPolka: "/sales/settings/polka",
  settingsProduct: "/sales/settings/product",
  settingsWorkers: "/sales/settings/worker",
  settingsExpensesCategory: "/sales/settings/expensesCategory",
  settingsCustomerCategory: "/sales/settings/customerCategory",
};

/* UPLOADER DEPARTMENT */
// Home
export const UPLOADER_HOME_ROUTE = "/uploader";
// export const UPLOADER_GRIND_ORDER_PROCESS_ROUTE = "/uploader/grindOrderProcess";
// export const UPLOADER_REGRIND_ORDER_PROCESS_ROUTE =
//   "/uploader/regrindOrderProcess";
export const UPLOADER_SALES_ORDER_PROCESS_ROUTE = "/uploader/salesOrderProcess";

export const UPLOADER_NOTIF_FROM_MAYDALASH_ROUTE = "/uploader/notifFromGrind";
export const UPLOADER_NOTIF_FROM_SALES_ROUTE = "/uploader/notifFromSales";
export const UPLOADER_POLKA_ROUTE = "/uploader/polka";
export const UPLOADER_REGRIND_ROUTE = "/uploader/regrind";
export const UPLOADER_SPARE_ROUTE = "/uploader/spare";
export const UPLOADER_RETURN_PRODUCT_ROUTE = "/uploader/returnProducts";
export const UPLOADER_PRODUCTS_ROUTE = "/uploader/products";
export const UPLOADER_ORDER_GRIND_ROUTE = "/uploader/orderGrind";
export const UPLOADER_REPORT_ROUTE = "/uploader/report";
export const UPLOADER_REPORT_ALL_ROUTE = "/uploader/reportAll";
export const UPLOADER_ORDER_HISTORY_ROUTE = "/uploader/orderHistory";
export const UPLOADER_REPORT_PATERIYA_ROUTE = "/uploader/reportPateriya";
export const UPLOADER_REPORT_RECEPTION_ROUTE = "/uploader/reportReception";
export const UPLOADER_REPORT_OUTPUTS_ROUTE = "/uploader/reportOutputs";
export const UPLOADER_RESIDUE_ROUTE = "/uploader/reportResidue";

/* AGENT DEPARTMENT */
export const AGENT_HOME_ROUTE = "/agent/";
export const AGENT_RECEPTION_ROUTE = "/agent/reception";

/* SUPPLIER DEPARTMENT */
export const SUPPLIER_HOME_ROUTE = "/supplier";
export const SUPPLIER_NOTIF_FROM_SALES_ROUTE = "/supplier/notifFromSales";
export const SUPPLIER_BALANCE_ROUTE = "/supplier/balance";
export const SUPPLIER_DEBT_ROUTE = "/supplier/debt";
export const SUPPLIER_CONFIRM_SMS_ROUTE = "/supplier/confirmSms";
export const SUPPLIER_CHANGE_ORDER_ROUTE = "/supplier/changeOrder";
export const SUPPLIER_RETURN_PRODUCT_ROUTE = "/supplier/returnProduct";
export const SUPPLIER_REPORT_ROUTE = "/supplier/report";
export const SUPPLIER_REPORT_ALL_ROUTE = "/supplier/reportAll";
export const SUPPLIER_SUBMITTED_ORDERS_ROUTE = "/supplier/submittedOrders";
export const SUPPLIER_MY_ACCOUNT_ROUTE = "/supplier/myAccount";
export const SUPPLIER_MY_TERRITORY_ROUTE = "/supplier/myTerritory";
export const SUPPLIER_MY_INDICATOR = "/supplier/myIndicator";
export const SUPPLIER_DEADLINE_ROUTE = "/supplier/deadline";

/* CASHIER DEPARTMENT */
export const CASHIER_HOME_ROUTE = "/cashier/";
export const CASHIER_SUPPLIER_ROUTE = "/cashier/supplier";
export const CASHIER_SUPPLIER_HISTORY_ROUTE = "/cashier/supplierHistory";
export const CASHIER_CUTOMER_REPORT_ROUTE = "/cashier/customerReport";
export const CASHIER_DAY_COST_ROUTE = "/cashier/dayCost";
export const CASHIER_COMPLETED_PRODUCT_DEPART_ROUTE =
  "/cashier/completedProductDepartment";
export const CASHIER_EXPENSES_ROUTE = "/cashier/expenses";
export const CASHIER_PRODUCT_PROVIDER_ROUTE = "/cashier/productProvider";
export const CASHIER_SALARY_ROUTE = "/cashier/salary";
export const CASHIER_REPORT_ALL_ROUTE = "/cashier/reportAll";
export const CASHIER_EXCHANGE_HISTORY_ROUTE = "/cashier/exchangeHistory";
export const CASHIER_ATTENDANCE_ROUTE = "/cashier/attendance";
export const CASHIER_ATTENDANCE_ALWAYS_LATE_ROUTE =
  "/cashier/attendance/alwaysLate";
// crm
export const CrmRoutes = {
  home: "/crm",
  orderHistory: "/crm/orderHistory",
  customerData: "/crm/customerData",
};

// inkasator
export const InkasatorRoutes = {
  home: "/inkasator",
  debt: "/inkasator/debt",
};
