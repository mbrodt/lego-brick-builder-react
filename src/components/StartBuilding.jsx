import { Link } from "react-router-dom";

function StartBuilding() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Link
        to="/builder-page"
        className="w-64 h-64 rounded-full bg-yellow text-lg text-black flex items-center justify-center font-black"
      >
        Start building
      </Link>
    </div>
  );
}

export default StartBuilding;
