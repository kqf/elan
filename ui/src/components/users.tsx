import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../schemes";

export default function UserList() {
  const [state, updateState] = useState([] as Array<User>);
  useEffect(() => {
    // Fetch the data
    (async () => {
      const users = (await axios.get("/users/")).data;
      updateState(users);
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ul className="list-group">
        {state.map((u) => {
          return <li className="list-group-item">{u.username}</li>;
        })}
      </ul>
    </div>
  );
}
