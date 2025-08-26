const StatusPuck = ({ message, type = "error" }) => {
const isError = type === "error";


const puckStyle = {
position: "fixed",
bottom: "1rem",
right: "1rem",
backgroundColor: isError ? "#ef4444" : "#22c55e", // red-500 or green-500
color: "white",
borderRadius: "9999px",
padding: "0.5rem 1rem",
display: "flex",
alignItems: "center",
boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
maxWidth: "80vw",
};


const textStyle = {
fontSize: "0.875rem",
marginLeft: "0.5rem",
whiteSpace: "nowrap",
overflow: "hidden",
textOverflow: "ellipsis",
};


return (
<div style={puckStyle}>

<p style={textStyle}>{message}</p>
</div>
);
};


export default StatusPuck;