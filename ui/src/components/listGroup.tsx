interface ListEntry {
  name: String;
  _id: String;
}

function ListGroup(props: {
  items: Array<ListEntry>;
  onClick: (arg0: String) => () => void;
  selectedItem: String;
}) {
  console.log(props.selectedItem);
  return (
    <ul className="list-group">
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
