import { lazy } from "react";

export const AdminDepartment = lazy(() =>
  import("./department/AdminDepartment")
);
export const AdminPolka = lazy(() => import("./polka/AdminPolka"));
export const AdminProduct = lazy(() => import("./product/AdminProduct"));
export const AdminWorker = lazy(() => import("./worker/AdminWorker"));
export const AdminCustomerCategory = lazy(() =>
  import("./customerCategory/AdminCustomerCategory")
);
export const AdminExpensesCategory = lazy(() =>
  import("./expensesCategory/AdminExpensesCategory")
);
export const AdminSupplierManagement = lazy(() =>
  import("./supplierManagement/AdminSupplierManagement")
);
export const AdminSupplierReport = lazy(() =>
  import("./supplierManagement/AdminSupplierReport")
);
export const AdminSupplierAllReport = lazy(() =>
  import("./supplierManagement/AdminSupplierAllReport")
);
export const AdminCustomerManagement = lazy(() =>
  import("./customerManagement/AdminCustomerManagement")
);
export const AdminCustomerTransactions = lazy(() =>
  import("./customerManagement/AdminCustomerTransactions")
);
export const AdminCustomerReport = lazy(() =>
  import("./customerManagement/AdminCustomerReport")
);
export const AdminWarehouseTransfer = lazy(() =>
  import("./warehouseManagement/AdminWarehouseTransfer")
);
export const AdminWarehouseMassReport = lazy(() =>
  import("./warehouseManagement/AdminWarehouseMassReport")
);
export const AdminFinanceDebts = lazy(() =>
  import("./financeManagement/AdminFinanceDebts")
);
export const AdminFinanceExpenses = lazy(() =>
  import("./financeManagement/AdminFinanceExpenses")
);
export const AdminFinanceSalary = lazy(() =>
  import("./financeManagement/AdminFinanceSalary")
);
