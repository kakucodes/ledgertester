import React from "react";
import { grantDemo } from "./utils/grantDemo";

function App() {
  return (
    <button onClick={grantDemo} style={{ margin: 15 }}>
      Grant Permission
    </button>
  );
}

export default App;
