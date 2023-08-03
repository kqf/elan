function ListGroup(props: {
  items: Array<String>;
  onClick: (arg0: String) => () => void;
  selectedItem: String;
  title?: String;
}) {
  console.log(props.selectedItem);
  return (
    <ul className="list-group">
      {props.title && (
        <li className="list-group-item list-group-item-primary">
          {props.title}
        </li>
      )}
      {props.items.map((entry, i) => (
        <li
          key={i}
          className={
            entry === props.selectedItem
              ? "list-group-item active"
              : "list-group-item"
          }
          onClick={props.onClick(entry)}
        >
          {entry}
        </li>
      ))}
    </ul>
  );
}

export default ListGroup;
