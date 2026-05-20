import {useState} from 'react'

export default function Counter() {
    const [value, setValue] = useState(0)

    return (
        <>
            <p>Count: {value}</p>
            <div>
                <button
                    className="counter-buttons"
                    onClick={() => setValue(value - 1)}
                >
                    -
                </button>
                <button
                    className="counter-buttons"
                    onClick={() => setValue(value + 1)}
                >
                    +
                </button>
            </div>
        </>
    );
}