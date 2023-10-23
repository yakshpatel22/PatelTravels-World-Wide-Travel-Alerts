import React, { useState } from "react";
import "../App.css";
// An example of a React Functional Component using JSX syntax
const FunctionalStateHookComponent = () => {
 const [clicks, increment] = useState(0);
 return (
 <h3 style={{ "marginLeft": "3vw" }}>
 This is a functional component with a useState hook! The button was
 clicked
 <span className="bigred">{clicks}</span> times.
 <p />
 <input
 type="submit"
 value="Click me!"
 onClick={() => increment(clicks + 1)} // anonymous function
 />
 </h3>
 );
};
export default FunctionalStateHookComponent;
