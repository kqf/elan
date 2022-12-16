import { useState } from "react";

function Counter(props: { value: number }) {
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

  return (
    <div>
      {counters.map((c) => (
        <Counter key={c.id} value={c.value} />
      ))}
    </div>
  );
}

export default Counters;