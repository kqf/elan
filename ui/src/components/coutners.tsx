import { useState } from "react";

interface CounterProps {
  counts: number;
  onDelete: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function Counter(props: CounterProps) {
  return (
    <div>
      <span>{props.counts}</span>
      <button
        className="btn btn-primary btn-sm m-2"
        onClick={props.onIncrement}
      >
        +
      </button>

      <button
        className="btn btn-primary btn-sm m-2"
        onClick={props.onDecrement}
        disabled={props.counts <= 0}
      >
        -
      </button>

      <button className="btn btn-danger btn-sm m-2" onClick={props.onDelete}>
        x
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

  const onDecrement = (counter: CounterState) => () => {
    const lcounters = [...counters];
    const idx = counters.indexOf(counter);
    lcounters[idx] = { ...counter, value: counter.value - 1 };
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
          counts={c.value}
          onDelete={onDelete(c.id)}
          onIncrement={onIncrement(c)}
          onDecrement={onDecrement(c)}
        />
      ))}
    </div>
  );
}

export default Counters;
