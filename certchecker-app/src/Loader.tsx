import React, { useState, useEffect, CSSProperties } from "react";

import { Spinner, Text } from "@blueprintjs/core";
const LoaderStyle = {
  textAlign: "center"
} as CSSProperties;
export default function Loader() {
  return (
    <div style={LoaderStyle}>
      <Spinner />
      <h1>Connecting to the Blockchain</h1>
      <p>Blockchain might take you to the new world if the usage is correct.</p>
      <p>
        If the home screen show up, the node you are connecting is down. Please
        consult connecting the another node.
      </p>
    </div>
  );
}
