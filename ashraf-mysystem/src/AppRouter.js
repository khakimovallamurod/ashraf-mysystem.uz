import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthRequired from "./components/common/authRequired/AuthRequired";
import PageNotFound from "./page/error/PageNotFound";
import RegisterLayout from "./layout/register/RegisterLayout";
import SignIn from "./page/register/SignIn";
import SalesLayout from "./layout/sales/SalesLayout";
import SalesDashboard from "./page/sales/dashboard/SalesDashboard";
import SalesHome from "./page/sales/home/SalesHome";
import SalesKassa from "./page/sales/kassa/SalesKassa";
import SalesCustomer from "./page/sales/customer/SalesCustomer";
import SalesSupplierPayments from "./page/sales/taminotchi/SalesSupplierPayments";
import SalesCustomerCashIn from "./page/sales/taminotchi/SalesCustomerCashIn";
import SalesRazilka from "./page/sales/razilka/SalesRazilka";
import SalesProductReception from "./page/sales/productReception/SalesProductReception";
import SalesReportCustomer from "./page/sales/reportAll copy/SalesReportCustomer";
import AdminSupplierManagement from "./page/admin/supplierManagement/AdminSupplierManagement";
import AdminSupplierAllReport from "./page/admin/supplierManagement/AdminSupplierAllReport";
import AdminCustomerTransactions from "./page/admin/customerManagement/AdminCustomerTransactions";
import AdminWarehouseTransfer from "./page/admin/warehouseManagement/AdminWarehouseTransfer";
import AdminWarehouseMassReport from "./page/admin/warehouseManagement/AdminWarehouseMassReport";
import AdminFinanceExpenses from "./page/admin/financeManagement/AdminFinanceExpenses";
import AdminFinanceSalary from "./page/admin/financeManagement/AdminFinanceSalary";
import AdminDepartment from "./page/admin/department/AdminDepartment";
import AdminPolka from "./page/admin/polka/AdminPolka";
import AdminProduct from "./page/admin/product/AdminProduct";
import AdminWorker from "./page/admin/worker/AdminWorker";
import AdminCustomerCategory from "./page/admin/customerCategory/AdminCustomerCategory";
import AdminExpensesCategory from "./page/admin/expensesCategory/AdminExpensesCategory";
import { ROLE_LIST } from "./util/const";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  SALES_DASHBOARD_ROUTE,
  SALES_HOME_ROUTE,
  sales_routes,
} from "./util/path";

function AppRouter() {
  return (
    <Routes>
      <Route
        path={HOME_ROUTE}
        element={<Navigate to={LOGIN_ROUTE} replace={true} />}
      />

      <Route element={<RegisterLayout />}>
        <Route path={LOGIN_ROUTE} element={<SignIn />} />
      </Route>

      <Route element={<AuthRequired allowRoles={[ROLE_LIST.sales]} />}>
        <Route path={SALES_HOME_ROUTE} element={<SalesLayout />}>
          <Route
            index
            element={<Navigate to={SALES_DASHBOARD_ROUTE} replace={true} />}
          />
          <Route path={SALES_DASHBOARD_ROUTE} element={<SalesDashboard />} />
          <Route path={sales_routes.home} element={<SalesHome />} />
          <Route path={sales_routes.kassa} element={<SalesKassa />} />
          <Route
            path={sales_routes.supplierManagement}
            element={<AdminSupplierManagement />}
          />
          <Route
            path={sales_routes.customerManagement}
            element={<SalesCustomer />}
          />
          <Route
            path={sales_routes.productReception}
            element={<SalesProductReception />}
          />
          <Route
            path={sales_routes.warehouseTransfer}
            element={<AdminWarehouseTransfer />}
          />
          <Route
            path={sales_routes.supplierManagementPayments}
            element={<SalesSupplierPayments />}
          />
          <Route
            path={sales_routes.customerCashIn}
            element={<SalesCustomerCashIn />}
          />
          <Route
            path={sales_routes.supplierManagementAllReport}
            element={<AdminSupplierAllReport />}
          />
          <Route
            path={sales_routes.supplierManagementReport}
            element={<AdminSupplierAllReport />}
          />
          <Route
            path={sales_routes.warehouseMassReport}
            element={<AdminWarehouseMassReport />}
          />
          <Route
            path={sales_routes.customerManagementReport}
            element={<SalesReportCustomer />}
          />
          <Route
            path={sales_routes.customerManagementTransactions}
            element={<AdminCustomerTransactions />}
          />
          <Route
            path={sales_routes.financeExpenses}
            element={<AdminFinanceExpenses />}
          />
          <Route path={sales_routes.financeSalary} element={<AdminFinanceSalary />} />
          <Route path={sales_routes.razilka} element={<SalesRazilka />} />
          <Route
            path={sales_routes.settingsDepartment}
            element={<AdminDepartment />}
          />
          <Route path={sales_routes.settingsPolka} element={<AdminPolka />} />
          <Route path={sales_routes.settingsProduct} element={<AdminProduct />} />
          <Route path={sales_routes.settingsWorkers} element={<AdminWorker />} />
          <Route
            path={sales_routes.settingsCustomerCategory}
            element={<AdminCustomerCategory />}
          />
          <Route
            path={sales_routes.settingsExpensesCategory}
            element={<AdminExpensesCategory />}
          />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRouter;
