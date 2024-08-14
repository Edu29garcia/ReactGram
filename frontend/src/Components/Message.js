import "./Message.css";

const Message = ({ msg, type }) => {
  return (
    <div className={`messaage ${type}`}>
      <p>{msg}</p>
    </div>
  );
};

export default Message;
