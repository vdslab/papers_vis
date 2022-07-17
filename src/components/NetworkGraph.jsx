import { useEffect, useState,useRef } from "react";
import * as d3 from 'd3';
import { forceRadial } from "d3";

const ZoomableSVG= ({ children, width, height }) => {
    //console.log("ZoomableSVG");
    const svgRef = useRef();
    const [k, setK] = useState(0.1);
    const [x, setX] = useState(width/4);
    const [y, setY] = useState(height/8);
    useEffect(() => {
      const zoom = d3.zoom().on("zoom", (event) => {
        const { x, y, k } = event.transform;
        setK(k);
        setX(x);
        setY(y);
      });
      d3.select(svgRef.current).call(zoom);
    }, []);
    return (
      <svg ref={svgRef} width={width} height={height}
      className="graph has-background-white"
      style={{marginLeft: "auto", marginRight: "auto" }}
      viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
      </svg>
    );
  }
  
const NetworkGraph = () => {
    return(
    <svg viewBox="0 0 350 200" width = "350" height = "200">
        <g>
            <circle cx="0" cy="0" r="10"/>
        </g>
    </svg>);
}

export default NetworkGraph;