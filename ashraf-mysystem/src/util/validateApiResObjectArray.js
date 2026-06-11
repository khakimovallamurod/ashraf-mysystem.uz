function validateApiResObjectArray(resApi, key) {
  if (
    resApi?.data?.success === true &&
    resApi?.data?.data &&
    resApi?.data?.data[key] &&
    Array.isArray(resApi?.data?.data[key])
  ) {
    return resApi?.data?.data[key];
  }
  return [];
}

export default validateApiResObjectArray;
