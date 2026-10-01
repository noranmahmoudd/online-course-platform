const ProgressBar = ({ value = 0 }) => (
  <div className="progress" aria-label={`Progress ${value}%`}>
    <div className="progress-fill" style={{ width: `${value}%` }} />
    <span className="progress-text">{value}%</span>
  </div>
);

export default ProgressBar;
