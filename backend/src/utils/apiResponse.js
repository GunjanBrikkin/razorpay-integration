module.exports.GetApiResponse = (
  data,
  message = "",
  statuscode = 200,
  totalCount = 0
) => {
  const isEmpty = data.length === 0;

  const response = {
    success: statuscode === 200,
    message: message || (isEmpty ? "Data Not found" : "Data Get Successfully"),
    data: isEmpty ? [] : data,
  };

  if (totalCount > 0) {
    response.totalCount = isEmpty ? 0 : totalCount;
  }

  return response;
};
