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

const dragged = (e, d) => {
    d.x = e.x;
    d.y = e.y
}

const dragended = (e, d) => {
    d.x = null;
    d.y = null;
}
const NetworkGraph = ({nodeData}) => {

    const [nodes, setNodes] = useState([
        {id:1, r:10, col:'rgb(100,100, 100)'},
        {id:2, r:10, col:'rgb(100,100, 100)'},
        {id:3, r :10, col:'rgb(100,100, 100)'},
        {id:4, r:10, col:'rgb(100,100, 100)'}
    ]);

    


    const [links, setLinks] = useState([
        {            
            "source":1,
            "target":2,
            "length":10
        },
        {            
            source:2,
            target:3,
            length:10
        },
        {            
            source:3,
            target:4,
            length:10
        }
        ,        {            
            source:1,
            target:4,
            length:10
        }
    ]);


    const ticked = () => {
        setNodes(nodes.slice());
        setLinks(links.slice());
    }

    useEffect(() => {
        console.log(nodeData);
        console.log("!!!")
        const simulation = d3
        .forceSimulation()
        .nodes(nodes)
        .force("link", d3.forceLink().strength(-0.009).distance((d) => {
            return 10;
          }).id((d) => d.id))
        .force("center", d3.forceCenter(100, 50))
        .force('charge', d3.forceManyBody().strength(1))
        .force('collision', d3.forceCollide()
              .radius(function (d) {
                return 10;
              })
              .iterations(1))
        .force('x', d3.forceX().x(50).strength())
        .force('y', d3.forceY().y(50).strength())
        ;
    
        simulation.nodes(nodes).on("tick", ticked);
        simulation.force('link').links(links);
    }, []);


    const node =  d3.selectAll('g.nodes')
    .call(d3.drag()
    .on("drag", (event, d) => (d.x = event.x, d.y = event.y))
    .on("end", (event, d) => (d.x = null, d.y = null))
    );



    return(
    <svg viewBox="0 0 350 1000" width = "350" height = "1000">
        <g className="links">
            {links.map((link) => {
                ///console.log("#################");
                //console.log(links.length);
                return(
                    <line
                    key={link.source.id + "-" + link.target.id}
                    stroke="black"
                    strokeWidth="0.5"
                    className="link"

                    x1={link.source.x}
                    y1={link.source.y}
                    x2={link.target.x}
                    y2={link.target.y}                    
                    >

                    </line>

                );
            })}
        </g>
        
        <g className="nodes">

            {nodes.map((node)=> {
                    //console.log(node.id);
                    //console.log(node.x);
                    //console.log(node.y);
                    //console.log("");
                return (
                    <circle
                        className="node"
                        key = {node.id}
                        r = {10}
                        style = {{fill : 'rgb(100,100, 100)'}}
                        cx = {node.x}
                        cy = {node.y}
                    />
                );
            })}
        </g>

        <g className="texts">
            
            {nodes.map((node)=> {
                //console.log(node.id);
                //console.log(node.x);
                //console.log(node.y);
                //console.log("");
            return (

                <text
                    className="text"
                    key={node.id}
                    textAnchor="middle"
                    fill="white"
                    fontSize={"10px"}
                    x={node.x}
                    y={node.y}
                >
                    {node.id}
                </text>
            );
        })}                
            

        </g>
    </svg>);
}

export default NetworkGraph;