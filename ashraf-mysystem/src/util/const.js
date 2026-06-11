/*
  --------------------------------------
  APP
  --------------------------------------
*/
export const config = process.env.NODE_ENV === "development" ? "dev" : "prod";

/*
  --------------------------------------
  AUTO REFETCH API TIME
  --------------------------------------
*/
export const REFETCH_NOTIF_TIME = 15000;

/*
  --------------------------------------
  ROLE
  --------------------------------------
*/
export const ROLE_LIST = {
  admin: "admin",
  sklad: "sklad",
  supplier: "dostavka",
  storage: "saqlash",
  sales: "sotuv",
  grind: "maydalash",
  uploader: "yuklovchi",
  agent: "agent",
  cashier: "kassir",
  crm: "crm",
  inkasator: "inkassator",
};

/*
  --------------------------------------
  LOCAL STORAGE
  --------------------------------------
*/
export const ACCESS_TOKEN_NAME = "apiTokenLocal";
