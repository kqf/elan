function Like(props: { liked: boolean }) {
  let classes = "fa fa-heart";
  if (!props.liked) {
    classes += "-o";
  }
  return <i className={classes} areai-hidden="true"></i>;
}

export default Like;
