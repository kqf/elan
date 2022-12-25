function Like(props: { liked: boolean; onClick: any }) {
  let classes = "fa fa-heart";
  if (!props.liked) {
    classes += "-o";
  }
  return (
    <i className={classes} areai-hidden="true" onClick={props.onClick}></i>
  );
}

export default Like;
