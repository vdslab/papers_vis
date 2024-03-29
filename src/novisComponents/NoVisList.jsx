import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { forceRadial } from "d3";
import useWindowSize from "../useWindowSize";
import objectArray2ArrayByKey from "../objectArray2ArraybyKey";
import { noData } from "pg-protocol/dist/messages";
import LabelProgress from "../components/LabelProgress";
import { useParams } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import CircularProgressWithLabel from "../components/CircularProgressWithLabel";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import Stack from "@mui/material/Stack";
import NovisNetworkHelp from "./NovisNetworkHelp";

/*
todo
グラフの調整
・ノードをドラッグできるようにする
・ノードテキストを[タイトル、キーワード、作者、なし]で切り替えられるようにする
・ZoomableSVGを使いやすいように調整する
*/

const ZoomableSVG = ({
  children,
  width,
  height,
  sideBarOpen,
  setSideBarOpen,
  isOpenMenu,
  setIsOpenMenu,
}) => {
  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(width / 5);
  const [y, setY] = useState(height / 4);
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
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="graph has-background-white"
      style={{ marginLeft: "auto", marginRight: "auto" }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>

      {/*ハンバーガーメニュー*/}
      <foreignObject x={10} y={10} width="110" height="50">
        <Link to="../..">
          <Tooltip title="戻る" placement="right">
            <IconButton aria-label="delete" style={{ margin: "5px" }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </foreignObject>

      <foreignObject x={10} y={60} width="110" height="50">
        <Tooltip title="ネットワーク設定" placement="right">
          <IconButton
            aria-label="delete"
            onClick={() => setSideBarOpen(!sideBarOpen)}
            style={{ margin: "5px" }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </foreignObject>

      <foreignObject x={10} y={110} width="110" height="50">
        <Link to="../../help">
          <Tooltip title="ヘルプ" placement="right">
            <IconButton aria-label="delete" style={{ margin: "5px" }}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </foreignObject>

      <foreignObject x={width - 60 - 10} y={10} width="200" height="200">
        {isOpenMenu || (
          <Tooltip title="論文詳細を開く" placement="left">
            <IconButton
              aria-label="delete"
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Tooltip>
        )}
      </foreignObject>
    </svg>
  );
};

function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

const NetworkGraph = ({
  detail,
  setDetail,
  nodeLabel,
  sideBarOpen,
  setSideBarOpen,
  loading,
  setLoading,
  reloading,
  isOpenMenu,
  setIsOpenMenu,
  labelPart,
  setLabelPart,
  labelStringNum,
  setLabelStringNum,
  labelString,
}) => {
  //グラフの見た目の設定
  const [width, height] = useWindowSize();
  const [graphWidth, graphHeight] = [width, height];
  console.log(width);
  const [
    normalNodeCol,
    hoverNodeCol,
    clickedNodeCol,
    linkCol,
    nearestLinkCol,
    firseSelectedNodeCol,
  ] = [
    "rgb(100, 50, 255)",
    "rgb(140, 90, 255)",
    "rgb(200, 30, 50)",
    "rgb(200, 200, 200)",
    "rgb(0, 0, 0)",
    "rgb(255, 0, 255)",
  ];
  const nodeCols = [
    "rgb(100, 50, 255)",
    "rgb(120, 70, 255)",
    "rgb(200, 30, 50)",
    "rgb(150, 150, 150)",
    "rgb(255, 0, 255)",
  ];
  const firstSelectedNodeKey = 0;
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [clickedNodeKey, setClickedNodeKey] = useState(-1);
  const [progress, setProgress] = useState(0);
  const ref = useRef(true);

  const thre = 0.8;
  const nodeNum = 20;
  const maxNodeNum = 50;
  const maxStringNum = 1000;

  const [nodesState, setNodesState] = useState(() => {
    //0は通常 1はホバー状態　2はクリック状態
    return Array(maxNodeNum).fill(0);
  });

  const [nodeLabels, setNodeLabels] = useState(() => {
    //trueはラベルあり、falseはラベルなし
    return Array(maxNodeNum).fill(false);
  });
  //const [loadingString, setLoadingString] = useState('読み込み中');
  const params = useParams();

  const deescapeDoi = (doi) => {
    return doi.replaceAll("_", ".").replaceAll("-", "/");
  };

  const compressLabel = (str, num) => {
    num = Math.min(maxStringNum, num);
    if (typeof str !== "string") {
      return str;
    }
    const res = str.slice().substring(0, num);
    if (num <= 0 || num >= str.length) {
      return res;
    }
    return res.concat("...");
  };

  const changeNodeState = (key, state) => {
    //console.log(key);
    const tmp = [...nodesState];
    //console.log(nodesState);
    tmp[key] = state;
    setNodesState(tmp);
  };

  const changeNodeLabels = (labels, isLabel) => {
    const tmp = [...nodeLabels];
    clearNodeLabels(tmp);
    console.log(labels);
    labels.map((label) => {
      tmp[label] = isLabel;
    });

    console.log(tmp);
    setNodeLabels(tmp);
  };

  const clearNodeLabels = (labels) => {
    return labels.fill(false);
  };

  const toggleOnNodeHover = (key) => {
    if (nodesState[key] !== 2) {
      changeNodeState(key, 1);
    }
  };

  const toggleOffNodeHover = (key) => {
    if (nodesState[key] !== 2) {
      changeNodeState(key, 0);
    }
  };

  const toggleOnOffNodeClick = (node, key) => {
    setDetail(node);

    const labels = new Array();
    labels.push(key);
    links.map((link) => {
      if (link["source"]["index"] === key) {
        labels.push(link["target"]["index"]);
      }

      if (link["target"]["index"] === key) {
        labels.push(link["source"]["index"]);
      }
    });

    changeNodeLabels(labels, true);

    if (
      clickedNodeKey !== -1 &&
      clickedNodeKey !== key &&
      nodesState[clickedNodeKey] === 2
    ) {
      changeNodeState(clickedNodeKey, 0);
    }
    setClickedNodeKey(key);
  };

  useEffect(() => {
    const fetchData = async () => {
      //モデルのチューニング
      const startSimulation = (nodes, links) => {
        const simulation = d3
          .forceSimulation()
          .nodes(nodes)
          .force(
            "link",
            d3
              .forceLink()
              .strength(0.5)
              .distance(100)
              .id((d) => d["id"])
          )
          .force("center", d3.forceCenter(100, 100))
          .force("charge", d3.forceManyBody().strength(-100))
          .force(
            "collision",
            d3
              .forceCollide()
              .radius(function (d) {
                return 15;
              })
              .iterations(1.0)
          );
        //.force('x', d3.forceX().x(100).strength(0.3))
        //.force('y', d3.forceY().y(100).strength(0.3))

        console.log(height);

        const ticked = () => {
          setNodes(nodes.slice());
          setLinks(links.slice());
        };

        simulation.nodes(nodes).on("tick", ticked);
        simulation.force("link").links(links);

        setLoading(false);
      };

      const bfs = async (doi) => {
        console.error("start");
        let stack = [];
        const doiset = new Set();
        stack.push({ doi: doi, prev: -1 });
        let top;

        while (stack.length !== 0) {
          top = stack.shift();
          console.log("$$$$$$$$$$");
          console.log(top);

          setProgress((100 * nodeData.length) / nodeNum);
          console.error(nodeData.length);
          console.error(nodeNum);
          console.error(nodeData.length / nodeNum);

          if (nodeData.length >= nodeNum) {
            return;
          }
          const encoded = encodeURIComponent(top.doi);

          //doiがnot foundになる可能性がある
          const tmp = await (
            await fetch(`/.netlify/functions/api/papers/doi/${encoded}`)
          ).json();
          const data = tmp[0];

          data["id"] = top["doi"];
          data["author"] = await (
            await fetch(`/.netlify/functions/api/authors/${encoded}`)
          ).json();
          try {
            const response = await fetch(
              `/.netlify/functions/api/keywords/${encoded}`
            );

            if (response.status === 404) {
              throw "keyword not found";
            }

            data["keyword"] = await response.json();
          } catch (err) {
            data["keyword"] = [];
          }

          console.log(`push!!!!!!!!!!!${nodeData.length}`);
          console.log(data);

          if (top.prev !== -1 && doiset.has(top.doi) === false) {
            console.log(top);
            linkData.push({ source: top.prev, target: top.doi });
          }

          if (doiset.has(top.doi) === false) {
            nodeData.push(data);
            doiset.add(top.doi);
          } else {
            console.log("UEUEUE");
            continue;
          }

          const similarities = await (
            await fetch(
              `/.netlify/functions/api/similarity/${encodeURIComponent(
                top.doi
              )}`
            )
          ).json();
          similarities.sort((a, b) => {
            return b.similarity - a.similarity;
          });

          similarities.length = 3;
          console.log(similarities);

          for (const sim of similarities) {
            /*
                        console.log("$$$$$$$$$$");
                        console.log(prev);
                        
                        console.log("$$$$$$$$$$\n");
                        */

            console.log(sim["doi"]);
            console.log(doiset);
            if (doiset.has(sim["target_doi"]) === false) {
              console.log("Yay");
              //linkData.push({source:top, target:sim['target_doi']});
              //console.log(sim['target_doi'])
              stack.push({ doi: sim["target_doi"], prev: sim["doi"] });
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
      };

      //dfsでノードを伸ばす
      setLoading(true);
      const doi = deescapeDoi(params.doi);
      let nodeData = [];
      let linkData = [];

      //キャッシュ関係
      if (localStorage.getItem(doi)) {
        const networkCache = JSON.parse(localStorage.getItem(doi));
        nodeData = networkCache["nodeData"];
        linkData = networkCache["linkData"];
        console.log(nodeData);
        console.log(linkData);
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&");
      } else {
        await bfs(doi);
      }

      if (!(nodeData && linkData)) {
        console.log("yay");
        nodeData = [];
        linkData = [];
        setLoading(true);
        await bfs(doi);
      } else {
        console.log("non");
      }

      //最初に選択した論文ノードを強調する
      toggleOnOffNodeClick(
        nodeData[firstSelectedNodeKey],
        firstSelectedNodeKey
      );

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
      console.log("final");
      console.log(nodeData);
      console.log(linkData);

      //キャッシュ保存
      localStorage.setItem(doi, JSON.stringify({ nodeData, linkData }));
      //console.log("################")
      //console.log(localStorage.getItem(doi))

      console.log(linkData);
      startSimulation(nodeData, linkData);
    };

    fetchData();
  }, [reloading]);

  useEffect(() => {
    changeNodeState(clickedNodeKey, 2);
  }, [clickedNodeKey]);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }

    if (labelStringNum >= maxStringNum) {
      setLabelStringNum(20);
    } else {
      setLabelStringNum(maxStringNum);
    }
  }, [labelString]);

  return (
    <div>
      {loading ? (
        <div
          style={{
            position: "absolute",
            top: `${height / 2.2}px`,
            left: `${width / 2.05}px`,
          }}
        >
          <CircularProgressWithLabel value={progress} />
          <br /> <br />{" "}
          <p style={{ position: "relative", right: "20px" }}>読み込み中...</p>
        </div>
      ) : (
        <div style={{ margin: "10px" }}>
          <foreignObject x={10} y={10} width="110" height="50">
            <Link to="../novis">
              <Tooltip title="戻る" placement="left">
                <IconButton aria-label="delete" style={{ margin: "5px" }}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </foreignObject>
          <NovisNetworkHelp />
          <h1>
            <strong>関連論文</strong>
          </h1>
          <br />

          {/*<Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Word of the Day
                    </Typography>
                </CardContent>
                
            </Card>
            */}

          <Card sx={{ maxWidth: 450 }}>
            <Stack divider={<Divider />}>
              {links.map((link, key) => {
                //console.log(nodes);
                //console.log(clickedNodeKey);
                if (link["target"]["doi"] === nodes[clickedNodeKey]["doi"]) {
                  return (
                    <CardContent
                      onClick={() =>
                        toggleOnOffNodeClick(
                          nodes[link["source"]["index"]],
                          link["source"]["index"]
                        )
                      }
                    >
                      <a>{link["source"]["title"]} </a>
                    </CardContent>
                  );
                }

                if (link["source"]["doi"] === nodes[clickedNodeKey]["doi"]) {
                  return (
                    <CardContent
                      onClick={() =>
                        toggleOnOffNodeClick(
                          nodes[link["target"]["index"]],
                          link["target"]["index"]
                        )
                      }
                    >
                      <a>{link["target"]["title"]}</a>{" "}
                    </CardContent>
                  );
                }
              })}
            </Stack>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
