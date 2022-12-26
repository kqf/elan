import _ from "lodash";

function Pagination(props: {
  itemCount: number;
  pageSize: number;
  onClick: any;
}) {
  const pagesCount = props.itemCount / props.pageSize;
  const pages = _.range(1, pagesCount + 1);

  return (
    <nav aria-label="Pagination">
      <ul className="pagination">
        {pages.map((page) => (
          <li key={page} className="page-item">
            <a className="page-link" href="">
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
