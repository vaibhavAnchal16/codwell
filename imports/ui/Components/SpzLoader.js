import React from "react";
import { PulseSharp } from "react-ionicons";
function SpzLoader() {
  return (
    <div className="spz-loader">
      <div className="text-center">
        <PulseSharp color={"#00000"} height="50px" width="50px" />
        <h2 className="text-center font-weight-bold"> Hold on a second...</h2>
      </div>
    </div>
  );
}
export default SpzLoader;
