import React, { useEffect, useState } from "react";

const Data = () => {

  const [data, setData] = useState(null);

  return (
    data ?
      <div>
        This it eh data page.
      </div> :
      <div>
        Loading... 
      </div>
  );
};

export default Data;