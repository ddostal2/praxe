/*
  UKOL: Counter komponenta (React docs – Quick Start / Adding Interactivity)
  https://react.dev/learn/state-a-components-memory

  Pravidlo: pis rucne, nepouzivej Cursor Tab / autocomplete.

  Co musis umet vysvetlit:
  - useState(0) – stav komponenty
  - setCount – jak zmenit stav po kliknuti
  - onClick na tlacitku
*/

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    function handlePlus() {
        setCount(count + 1);
    }

    function handleMinus() {
        setCount(count - 1);
    }

    return (
        <div className="counter">
            <p className="counter-label">
                Pocet: <strong>{count}</strong>
            </p>
            <div className="counter-buttons">
                <button type="button" onClick={handleMinus} aria-label="Odebrat jedna">
                    −
                </button>
                <button type="button" onClick={handlePlus} aria-label="Pridat jedna">
                    +
                </button>
            </div>
        </div>
    );
}
