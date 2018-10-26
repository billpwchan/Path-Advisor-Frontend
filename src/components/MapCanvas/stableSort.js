function stableSort(array, cmp) {
  const arrayWithIndex = array.map((value, index) => [value, index]);

  arrayWithIndex.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  /* eslint-disable-next-line */
  for (let i = 0; i < array.length; i++) {
    /* eslint-disable-next-line */
    array[i] = arrayWithIndex[i][0];
  }
  return array;
}

export default stableSort;
