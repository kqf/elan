import { useState } from "react";

function Counter() {
  const [counts, updateCounts] = useState(0);
  return (
    <div
      onClick={() => {
        updateCounts(counts + 1);
      }}
    >
      Counts: {counts}
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
