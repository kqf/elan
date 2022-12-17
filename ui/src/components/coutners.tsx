import { useState } from "react";

interface CounterProps {
  value: number;
  onDelete: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function Counter(props: CounterProps) {
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
      <button className="btn btn-primary btn-sm m-2" onClick={increment}>
        Increment
      </button>

      <button className="btn btn-primary btn-sm m-2" onClick={decrement}>
        Decrement
      </button>

      <button className="btn btn-danger btn-sm m-2" onClick={props.onDelete}>
        Delete
      </button>
    </div>
  );
}

interface CounterState {
  id: number;
  value: number;
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
  ] as Array<CounterState>);

  const onDelete = (id: number) => () => {
    updateCounters(counters.filter((counter) => counter.id !== id));
  };

  const onReset = () => {
    updateCounters(
      counters.map((counter: CounterState) => {
        return { id: counter.id, value: 0 };
      })
    );
  };

  const onIncrement = (counter: CounterState) => () => {
    const lcounters = [...counters];
    const idx = counters.indexOf(counter);
    lcounters[idx] = { ...counter, value: counter.value + 1 };
    updateCounters(lcounters);
  };

  return (
    <div>
      <button className="btn btn-success btn-sm m-2" onClick={onReset}>
        Reset
      </button>
      {counters.map((c) => (
        <Counter
          key={c.id}
          value={c.value}
          onDelete={onDelete(c.id)}
          onIncrement={onIncrement(c)}
          onDecrement={onIncrement(c)}
        />
      ))}
    </div>
  );
}

export default Counters;
