const Loading = ({ message = "Loading..." }) => (
  <div className="loading" role="status">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

export default Loading;
