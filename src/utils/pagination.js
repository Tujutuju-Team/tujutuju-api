async function getData(limit, page, retriever) {
  const totalData = await retriever.count();
  const totalPage = Math.ceil(totalData / limit);
  const domain = process.env.DOMAIN;

  const data = await retriever.find({ limit, offset: (page - 1) * limit });

  const hasNextPage = page < totalPage;
  const hasPrevPage = page > 1 && page <= totalPage;

  const nextUrl = hasNextPage
    ? `${domain}/places?page=${page + 1}&limit=${limit}`
    : "";
  const prevUrl = hasPrevPage
    ? `${domain}/places?page=${page - 1}&limit=${limit}`
    : "";

  return {
    data,
    nextUrl,
    prevUrl,
    totalData,
    totalPage
  };
}

module.exports = { getData };
