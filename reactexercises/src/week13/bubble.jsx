import "../App.css";
const Bubble = (props) => {
  return (
    <div className="userBubble" style={{ backgroundColor: props.color }}>
      <div style={{ fontWeight: "bold" }}>Name: {props.user.name}</div>
      <div>Age: {props.user.age}</div>
      <div>Email:{props.user.email}</div>
    </div>
  );
};
export default Bubble;
