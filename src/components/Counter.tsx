import { useState } from "react";

type CounterProps = {
  onClicking: () => void;  // Function that takes no params, returns nothing
}

function Counter({onClicking} : CounterProps) {
    const [counter, setCount] = useState(0);
    return(
        <div>
            <button onClick={onClicking}>Count clicks</button>
            <button onClick={() => setCount(counter + 1)}>Counting</button>
            <p>Button clicked {counter} times</p>
        </div>
    );
}

export default Counter;
