// IDCard.jsx
const IDCard = ({ children }) => {
  return (
    <div
      style={{
        width: "1011px",
        height: "639px",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default IDCard;
