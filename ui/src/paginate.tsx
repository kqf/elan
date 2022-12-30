import _ from "lodash";

function paginate<T>(items: Array<T>, pageNumber: number, pageSize: number) {
  const startIndex = (pageNumber - 1) * pageSize;
  return _(items).slice(startIndex).take(pageSize).value();
}

export default paginate;
