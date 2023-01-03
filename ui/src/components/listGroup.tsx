function ListGroup(props: { items: Array<String> }) {
  return (
    <ul className="list-gorup">
      {props.items.map((item) => (
        <li className="list-group-item"> item </li>
      ))}
    </ul>
  );
}

export default ListGroup;
