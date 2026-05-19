import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="counter">
      <h1>Counter</h1>
      <p className="counter-value" aria-live="polite">
          {count}
      </p>
      <div className="counter-actions">
        <button type="button" onClick={() => setCount((c) => c - 1)}>
          −
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Reset
        </button>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          +
        </button>
      </div>
    </main>
  );
}

export default App;
