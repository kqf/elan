import { useState } from "react";

function Counter() {
  const [counts, updateCounts] = useState(0);
  const increment = () => {
    updateCounts(counts + 1);
  };
  return (
    <div onClick={increment}>
      <span>{counts}</span>
      <button className="btn btn-secondary btn-sm">Increment</button>
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
        <Counter key={c.id} />
      ))}
    </div>
  );
}

export default Counters;
