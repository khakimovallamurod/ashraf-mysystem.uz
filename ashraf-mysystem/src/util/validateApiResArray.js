function validateApiResArray(resApi) {
  if (
    resApi?.data?.success === true &&
    resApi?.data?.data &&
    Array.isArray(resApi?.data?.data)
  ) {
    return resApi?.data?.data;
  }
  return [];
}

export default validateApiResArray;
