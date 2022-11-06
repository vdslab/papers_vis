import { useEffect, useState,useRef } from "react";
import * as d3 from 'd3';
import { forceRadial } from "d3";
import useWindowSize from '../useWindowSize';
import objectArray2ArrayByKey from "../objectArray2ArraybyKey";
import { noData } from "pg-protocol/dist/messages";
import LabelProgress from '../components/LabelProgress';
import { useParams } from "react-router-dom";

/*
todo
グラフの調整
・ノードをドラッグできるようにする
・ノードテキストを[タイトル、キーワード、作者、なし]で切り替えられるようにする
・ZoomableSVGを使いやすいように調整する
*/

const ZoomableSVG= ({ children, width, height }) => {
   
    const svgRef = useRef();
    const [k, setK] = useState(2);
    const [x, setX] = useState(width/4);
    const [y, setY] = useState(height/4);
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



const NetworkGraph = ({detail, setDetail, nodeLabel}) => {
    //グラフの見た目の設定
    const [width, height] = useWindowSize();
    const [graphWidth, graphHeight] = [0.9*width, 0.9*height];
    const [normalNodeCol, hoverNodeCol, clickedNodeCol, linkCol, nearestLinkCol] 
    = ['rgb(100, 50, 255)', 'rgb(120, 70, 255)', 'rgb(200, 30, 50)', 'rgb(200, 200, 200)', 'rgb(0, 0, 0)'];

    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [clickedNodeKey, setClickedNodeKey] = useState(-1);
    const [loading, setLoading] = useState(true);
    const thre = 0.8;
    
    const [nodesState, setNodesState] = useState(() => {
        //0は通常 1はホバー状態　2はクリック状態
        return Array(50).fill(0);
    });

    const [nodeLabels, setNodeLabels] = useState(() => {
        //trueはラベルあり、falseはラベルなし
        return Array(50).fill(false);
    });

    const params = useParams();



    const deescapeDoi = (doi) => {
        return doi.replaceAll('_', '.').replaceAll('-', '/');
    }

    const changeNodeState = (key, state) => {
        //console.log(key);
        const tmp = [...nodesState];
        //console.log(nodesState);
        tmp[key] = state;
        setNodesState(tmp);
    }

    const changeNodeLabels = (labels, isLabel) => {
        const tmp = [...nodeLabels];
        clearNodeLabels(tmp);
        console.log(labels);
        labels.map((label) => {
            tmp[label] = isLabel;
        });

        console.log(tmp)
        setNodeLabels(tmp);
    }

    const clearNodeLabels = (labels) => {
        return labels.fill(false);
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
            setDetail(node);

            const labels = new Array();
            labels.push(key);
            links.map((link) => {
                if(link["source"]["index"] === key) {
                    labels.push(link["target"]["index"])
                }

                if(link["target"]["index"] === key) {
                    labels.push(link["source"]["index"])
                }
            });


            changeNodeLabels(labels, true);

            if(clickedNodeKey !== -1 && clickedNodeKey !== key && nodesState[clickedNodeKey] === 2) {          
                changeNodeState(clickedNodeKey, 0);
            }
            setClickedNodeKey(key);
        
    }



    useEffect(() => {
    
        const fetchData = async () => {

            //モデルのチューニング
            const startSimulation = (nodes, links) => {

                const simulation = d3
                .forceSimulation()
                .nodes(nodes)
                .force("link", d3.forceLink().strength(0).id((d) => d['id']))
                .force("center", d3.forceCenter(100, 100))
                .force('charge', d3.forceManyBody().strength(0.5))
                .force('collision', d3.forceCollide()
                      .radius(function (d) {
                        return 15;
                      })
                      .iterations(0.5))
                .force('x', d3.forceX().x(100).strength(0.3))
                .force('y', d3.forceY().y(100).strength(0.3))
                .force('r', d3.forceRadial()
                .radius(100)
                .x(100)
                .y(100)
                .strength(1))
                ;
                console.log(height);

                const ticked = () => {
                    setNodes(nodes.slice());
                    setLinks(links.slice());
                }
                
                
                simulation.nodes(nodes).on("tick", ticked);
                simulation.force('link').links(links);

                setLoading(false);
            }

            
            const bfs = async (doi) => {
                console.log("#######")
                let stack = [];
                const doiset = new Set();
                stack.push({doi:doi, prev:-1});
                let top;
              
                
                while(stack.length !== 0) {
                    top = stack.shift();
                    console.log("$$$$$$$$$$")
                    console.log(top);
                    if(nodeData.length >= 20) {
                        return;
                    }
                    const encoded = encodeURIComponent(top.doi);

                    //doiがnot foundになる可能性がある
                    const tmp = await(await fetch(`/.netlify/functions/api/papers/${encoded}`)).json();
                    const data = tmp[0];
                    
                    data['id'] = top['doi'];
                    data['author'] = await(await fetch(`/.netlify/functions/api/authors/${encoded}`)).json();
                    try {
                        const response = await fetch(`/.netlify/functions/api/keywords/${encoded}`);
    
                        if(response.status === 404) {
                            throw "keyword not found";
                        }
    
                        data['keyword'] = await response.json();
                    } catch (err) {
                        data['keyword'] = [];
                    }
    
                    console.log(`push!!!!!!!!!!!${nodeData.length}`);
                    console.log(data);

                    if(top.prev !== -1 && doiset.has(top.doi) === false) {
                    
                        console.log(top);
                        linkData.push({source:top.prev, target:top.doi});
                    }

                    if(doiset.has(top.doi) === false) {
                        nodeData.push(data);
                        doiset.add(top.doi);
                    } else {
                        console.log('UEUEUE')
                        continue;
                    }


                    
                    const similarities = await(await fetch(`/.netlify/functions/api/similarity/${encodeURIComponent(top.doi)}`)).json();
                    similarities.sort((a, b) => {
                        return b.similarity - a.similarity;
                    });

                    similarities.length =  3;
                    console.log(similarities);

                    for(const sim of similarities) {

                        /*
                        console.log("$$$$$$$$$$");
                        console.log(prev);
                        
                        console.log("$$$$$$$$$$\n");
                        */

                        console.log(sim["doi"]);
                       console.log(doiset)
                        if(doiset.has(sim['target_doi']) === false) {
                            console.log("Yay")
                            //linkData.push({source:top, target:sim['target_doi']});
                            //console.log(sim['target_doi'])
                            stack.push({doi:sim['target_doi'], prev:sim['doi']});
                            
                        }
                    }

                   
                }

                /*for(const sim of similarities) {
                    if(nodeData.length >= 40) {
                        return;
                    }
                    if(sim['similarity'] >= 0.7) {
                        linkData.push({source:doi, target:sim['target_doi']});
                        dfs(sim['target_doi']);
                    }
                }*/
            }

            //dfsでノードを伸ばす
            const doi = deescapeDoi(params.doi);
            const nodeData = [];
            const linkData = [];
            await bfs(doi);
            /*const encoded = encodeURIComponent(doi);
            const nodeData = await(await fetch(`/.netlify/functions/api/papers/${encoded}`)).json();
            const simirarities = await(await fetch(`/.netlify/functions/api/similarity/${encoded}`)).json();
            console.log(simirarities);

            nodeData[0]['id'] =  nodeData[0]['doi'] ;
            nodeData[0]['author'] = await(await fetch(`/.netlify/functions/api/authors/${encoded}`)).json();
            try {
                const response = await fetch(`/.netlify/functions/api/keywords/${encodeURIComponent(encoded)}`);
                
                if(response.status === 404) {
                    throw 'keyword not found';
                }

                nodeData[0]['keyword'] = await response.json();

            } catch (err) {
                nodeData[0]['keyword'] = [];
                console.error(err);
            }

            
            const filtered_simirarities = simirarities.filter(item =>   Number(item.similarity) >= 0.69 );

           
           // console.log(filtered_simirarities);
            for(const item of filtered_simirarities) {
                //console.log(item['doi'])
                const tmp = await(await fetch(`/.netlify/functions/api/papers/${encodeURIComponent(item['target_doi'])}`)).json();
                const node = tmp[0];
                //console.log(node);
                node['id'] = node['doi'];
                node['author'] = await(await fetch(`/.netlify/functions/api/authors/${encodeURIComponent(item['target_doi'])}`)).json();
                try {
                    const response = await fetch(`/.netlify/functions/api/keywords/${encodeURIComponent(item['target_doi'])}`);
                    console.log(response);
                    if(response.status === 404) {
                         throw 'keyword not found';
                    }

                    node['keyword'] = await response.json();
                } catch (err) {
                    node['keyword'] = [];
                    console.log("#####");
                    console.error(err);
                }
                //console.log(node['keyword']);
                nodeData.push(node);
            }; 

            //console.log("####")
            //console.log(nodeData);
            //console.log(simirarities);

            //nodeDataの必要オブジェクト
            //abstract
            //author
            //title
            //html_url
            

            //リンクデータを作る
            const linkData = []

            filtered_simirarities.map((item) => {
                linkData.push({source: item['doi'], target:item['target_doi']});
            })

            */
            console.log('final');
            console.log(nodeData);
            console.log(linkData);
            
            console.log(linkData)
           startSimulation(nodeData, linkData);
        }

        fetchData();
    }, []);


    useEffect(() => {
        changeNodeState(clickedNodeKey, 2);
    }, [clickedNodeKey]);

    return(
        <div>

        {loading?<div style = {{position:'absolute', top : `${height/2}px`, left:`${width/4}px` }}><LabelProgress/></div>:
        <ZoomableSVG width={graphWidth} height={graphHeight}>
        <g className="links">
            {links.map((link) => {
                return(
                    <line
                    key={link.source.id + "-" + link.target.id}
                    stroke= {( (nodesState[link.source.index] === 2 && nodeLabels[link.target.index] === true) || (nodesState[link.target.index] === 2 && nodeLabels[link.source.index] === true) ) ? nearestLinkCol :linkCol}
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
            
            {nodes.map((node, key)=> {

            return (

                <text
                    className="text"
                    key={node.id}
                    textAnchor="middle"
                    fill="black"
                    fontSize={"5px"}
                    x={node.x}
                    y={node.y}
                    style={{pointerEvents: "none"}}
                >
        
                    {nodeLabels[key] !== true || (nodeLabel !== "author" && nodeLabel !== "keyword"?node[nodeLabel]:nodeLabel === "author"?objectArray2ArrayByKey(node[nodeLabel], "name").join(','):objectArray2ArrayByKey(node[nodeLabel], "keyword").join(','))}
                   
                </text>
            );
        })}                
            

        </g>
    </ZoomableSVG>
}
    </div>);
}

export default NetworkGraph;