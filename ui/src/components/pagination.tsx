function Pagination(props: {
  itemCount: number;
  pageSize: number;
  onClick: any;
}) {
  return (
    <nav aria-label="Pagination">
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" href="">
            1
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
