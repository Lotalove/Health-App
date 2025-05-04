
const LoadingSpinner = ({ size = 40, color = '#3498db' }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `${size * 0.1}px solid ${color}`,
    borderTop: `${size * 0.1}px solid transparent`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    alignSelf:"Center"
  };

  return (
    <>
      <div style={spinnerStyle}></div>
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default LoadingSpinner;
