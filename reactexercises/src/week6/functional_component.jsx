import React from 'react';
import '../App.css';
// An example of a React Functional Component using JSX syntax
const FunctionalJSX = ({ somedata }) => {
 // es6 way of doing props.somedata
 if (!somedata) {
 return <div />;
 }
 return <div className="bigred">{somedata}</div>;
};
export default FunctionalJSX;