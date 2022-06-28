async function pagination(total, currentPage, countPerPage) {
  const sorted = await total.sort((a, b) => b.updatedAt - a.updatedAt);
  const startIndex = (currentPage - 1) * countPerPage;
  const pageLimit = currentPage * countPerPage;
  const endIndex = sorted.length > pageLimit ? pageLimit : sorted.length;
  const posts = await sorted.slice(startIndex, endIndex);
  const totalPage = Math.ceil(total.length / countPerPage);
  return { totalPage, posts };
}

export { pagination };
