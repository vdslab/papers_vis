import { useEffect, useState,useRef } from "react";
import * as d3 from 'd3';
import { forceRadial } from "d3";
import useWindowSize from '../useWindowSize';


const ZoomableSVG= ({ children, width, height }) => {
    //console.log("ZoomableSVG");
    const svgRef = useRef();
    const [k, setK] = useState(1);
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



const NetworkGraph = ({detail, setDetail}) => {
    //グラフの見た目の設定
    const [height, width] = useWindowSize();
    const [graphWidth, graphHeight] = [0.9*height, 0.9*width];
    const [normalNodeCol, hoverNodeCol, clickedNodeCol, 
    linkCol] 
    = ['rgb(100, 50, 255)', 'rgb(120, 70, 255)', 'rgb(200, 30, 50)', 'rgb(150, 150, 150)'];

    
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [clickedNode, setClickedNode] = useState(-1);

    const [nodesState, setNodesState] = useState(() => {

        let len;
        const getLength = async () => {
            len = await(await fetch('../../data/sample_node.json')).json().length;
        }

        getLength();
       
        //0は通常 1はホバー状態　2はクリック状態
        console.log(Array(len).fill(0));
        return Array(4).fill(0);
    });



    const changeNodeState = (key, state) => {
        console.log(key);
        const tmp = nodesState.slice();
        console.log(nodesState);
        tmp[key] = state;
        setNodesState(tmp.slice());
    }

    const toggleOnNodeHover = (key) => {
        if(nodesState[key] !== 2) {
            changeNodeState(key, 1);
        }
    }

    const toggleOffNodeHover = (key) => {
        if(nodesState[key] !== 2) {
            changeNodeState(key, 0);
        }
    }

    const toggleOnOffNodeClick = (node, key) => {
        if(nodesState[key] == 2) {
            //off
            changeNodeState(key, 0);
            setDetail({});
        } else {
            console.log("$$$");
          
            setDetail(node);
            console.log("prev:" + clickedNode);
            console.log("key:" + key);
            if(clickedNode !== -1 && clickedNode !== key && nodesState[clickedNode] === 2) {
                console.log("###")
                
                changeNodeState(clickedNode, 0);
            }
            
            setClickedNode(key);
        }
        

        console.log("prev:" + prevkey);
        console.log("key:" + key);
    }

    useEffect(() => {
    
        const fetchData = async () => {

            //モデルのチューニング
            const startSimulation = (nodes, links) => {
                console.log(nodes);
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

                const ticked = () => {
                    setNodes(nodes.slice());
                    setLinks(links.slice());
                }
                
                simulation.nodes(nodes).on("tick", ticked);
                simulation.force('link').links(links);
                
            }



            const nodeData = await(await fetch('../../data/sample_node.json')).json();
            const linkData = await(await fetch('../../data/sample_edge.json')).json();
            //console.log(Array(nodeData.length).fill(false));
        
            console.log(nodesState);
            startSimulation(nodeData, linkData);
        }

        fetchData();
    }, []);

 


    const node =  d3.selectAll('g.nodes')
    .call(d3.drag()
    .on("drag", (event, d) => (d.x = event.x, d.y = event.y))
    .on("end", (event, d) => (d.x = null, d.y = null))
    );

    useEffect(() => {
        changeNodeState(clickedNode, 2);
    }, [clickedNode]);

    return(
        <ZoomableSVG width={graphWidth} height={graphHeight}>
        <g className="links">
            {links.map((link) => {
                //console.log("#################");
                //console.log(link);
                //console.log(link.source.x);
                return(
                    <line
                    key={link.source.id + "-" + link.target.id}
                    stroke= {linkCol}
                    strokeWidth="0.7"
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

            {nodes.map((node, key)=> {
                    //console.log(node.id);
                    //console.log(node.x);
                    //console.log(node.y);
                    //console.log("");
                    //console.log(isNodesHover[key])
                    //console.log(nodesState);
                return (
                    <circle
                        className="node"
                        key = {node.id}
                        r = {10}
                        style = {{fill : nodesState[key] == 0?normalNodeCol:nodesState[key]==1?hoverNodeCol:clickedNodeCol}}
                        cx = {node.x}
                        cy = {node.y}
                        onClick = {() => toggleOnOffNodeClick(node, key)}
                        onMouseEnter = {() => toggleOnNodeHover(key)}
                        onMouseLeave = {() => toggleOffNodeHover(key)}
                    />
                );
            })}
        </g>

        <g className="texts">
            
            {nodes.map((node)=> {
                //console.log(node);
                //console.log(node.x);
                //console.log(node.y);
                //console.log("");
            return (

                <text
                    className="text"
                    key={node.id}
                    textAnchor="middle"
                    fill="black"
                    fontSize={"10px"}
                    x={node.x}
                    y={node.y}
                    style={{pointerEvents: "none"}}
                >
                    {node.title}
                </text>
            );
        })}                
            

        </g>
    </ZoomableSVG>);
}

export default NetworkGraph;