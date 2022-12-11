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
  return (
    <div>
      <Counter />
    </div>
  );
}

export default Counters;
