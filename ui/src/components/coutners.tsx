import { useState } from "react";

function Counter(props: { value: number; onDelete: () => void }) {
  const [counts, updateCounts] = useState(props.value);

  const increment = () => {
    updateCounts(counts + 1);
  };

  const decrement = () => {
    updateCounts(counts - 1);
  };

  return (
    <div>
      <span>{counts}</span>
      <button className="btn btn-secondary btn-sm m-2" onClick={increment}>
        Increment
      </button>

      <button className="btn btn-secondary btn-sm m-2" onClick={decrement}>
        Decrement
      </button>

      <button className="btn btn-danger btn-sm m-2" onClick={props.onDelete}>
        Delete
      </button>
    </div>
  );
}

function Counters() {
  const [counters, updateCounters] = useState([
    {
      id: 1,
      value: 0,
    },
    {
      id: 2,
      value: 0,
    },
    {
      id: 3,
      value: 0,
    },
  ] as Array<{ id: number; value: number }>);

  const onDelete = (id: number) => () => {
    updateCounters(counters.filter((counter) => counter.id !== id));
  };

  const onReset = () => {};

  return (
    <div>
      <button className="btn btn-danger btn-sm m-2" onClick={onReset}>
        Reset
      </button>
      {counters.map((c) => (
        <Counter key={c.id} value={c.value} onDelete={onDelete(c.id)} />
      ))}
    </div>
  );
}

export default Counters;
