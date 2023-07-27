interface ListEntry {
  name: String;
  id: String;
}

function ListGroup(props: {
  items: Array<ListEntry>;
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
      {props.items.map((item, i) => (
        <li
          key={i}
          className={
            item.name === props.selectedItem
              ? "list-group-item active"
              : "list-group-item"
          }
          onClick={props.onClick(item.name)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export default ListGroup;
