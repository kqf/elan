function ListGroup(props: { items: Array<{ name: String; _id: String }> }) {
  return (
    <ul className="list-gorup">
      {props.items.map((item, i) => (
        <li key={i} className="list-group-item">
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export default ListGroup;
