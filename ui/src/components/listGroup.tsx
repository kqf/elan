interface ListEntry {
  name: String;
  _id: String;
}

function ListGroup(props: { items: Array<ListEntry>; onClick: any }) {
  return (
    <ul className="list-group">
      {props.items.map((item, i) => (
        <li key={i} className="list-group-item">
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export default ListGroup;
