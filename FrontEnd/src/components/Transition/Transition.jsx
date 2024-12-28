import './Transition.css'
const Transition = () => {
    return (
      <div className="transition">
        <div className="transition-row row-1">
          {[...Array(5)].map((_, i) => (
            <div key={`row1-${i}`} className="block"></div>
          ))}
        </div>
        <div className="transition-row row-2">
          {[...Array(5)].map((_, i) => (
            <div key={`row2-${i}`} className="block"></div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Transition;
  