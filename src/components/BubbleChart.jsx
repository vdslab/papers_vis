import * as d3 from "d3";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePapersCount } from "../redux/papersCountSlice";
import { changeKeyword } from "../redux/keywordSlice";
import { changePapersKeyword } from "../redux/papersKeywordSlice";
import { changeColumnsJudge } from "../redux/columnsSlice";
import { changeScrollJudge } from "../redux/scrollJudge";
import tableDataJudge, { changeTableDataJudge } from "../redux/tableDataJudge";
import {
  Card,
  Tooltip,
  Box,
  Typography,
  Toolbar,
  StyledEngineProvider,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import LabelProgress from "../components/LabelProgress";
import Skeleton from "@mui/material/Skeleton";
import { ThreeDots } from "react-loader-spinner";
import SelectInput from "@mui/material/Select/SelectInput";

const BubbleChart = () => {
  const dispatch = useDispatch();
  const startYear = useSelector((state) => state.startYear.year);
  const endYear = useSelector((state) => state.endYear.year);
  const keyword = useSelector((state) => state.keyword.keyword);
  const [data, setData] = useState([]);
  const papers = useSelector((state) => state.papersKeyword.papers);
  const [judge, setJudge] = useState(false);
  const isFirstRender = useRef(true);
  const margin = {
    left: 80,
    right: 20,
    top: 0,
    bottom: 30,
  };
  const contentWidth = 300;
  const contentHeight = 210;

  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  const width = 250;
  const height = 240;
  useEffect(() => {
    setJudge(false);
    (async () => {
      //let list = [];
      //for (let i = startYear;i <= endYear;i++){
      const request = await fetch(`/data/bubble_chart/${startYear}.json`);
      const data = await request.json();
      console.log(data);
      console.log(startYear, endYear);
      //let j = 0;
      // while(j < list.length){
      //     let k = 0;
      //     while(k < data.length){
      //         if(list[j].name === data[k].name){
      //             list[j].count += data[k].count;
      //             data.splice(k,1);
      //             break;
      //         }
      //         k += 1;
      //     }
      //     j += 1;
      // }


                    // list.forEach(element => {
                    //     for(let j = 0;j < data.length;j++){
                    //         if(element.name === data[j].name){
                    //             element.count += data[j].count;
                    //             data.splice(j,1);
                    //             break;
                    //         }
                    //     }
                    // })
                    
                    //list = list.concat(data);
                //}
                // list.sort((a, b) => b.count - a.count);
                // const result = {children:list.slice(0,30)}
                setData({children:data[endYear]});               
            })();
            setJudge(true);
            
    },[endYear,startYear]);
    
    useEffect(() => {
        if(isFirstRender.current) { // 初回レンダー判定
            isFirstRender.current = false // もう初回レンダーじゃないよ代入
        } else {
            (async () => {
                const response = await fetch(`/.netlify/functions/api/keywords/${keyword}/${startYear}/${endYear}`);
                const data = await response.json();
                dispatch(changePapersKeyword(data));
                dispatch(changeTableDataJudge(true));
            })();
        }
    },[keyword,startYear,endYear])
    console.log(papers)
    let packs = d3.pack()
                 .size([width, height])
                 .padding(0);
    let root = d3.hierarchy(data);
    root.sum(function(d) { return d.count; });
    let node = packs(root);
    const id = 'rect'
    const url = "url('#" + id + "')";
    const colorHandle = (value) => {
        const color =  d3.interpolateOranges(value);
        return color;
    };
    
    const styles = {
        transition:"transform 1s"
    }

    const onClickhandle = (e,name)=> {
        dispatch(changeKeyword(name));
        dispatch(changeTableDataJudge(false));
        dispatch(changeScrollJudge(true));
        dispatch(changeColumnsJudge('keyword'));
    }
    if(!judge){
        return(
            // <Card sx={{p:3, Width: "100%", height: "100%" }}>
            //     <p>キーワードの選択</p>
            //     {/*<Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:5 }}> */}
            //         <Skeleton sx={{ width: "100%",height: "100%" }} animation="wave" variant="rectangular" />
            //     {/* </Box>                   */}
            // </Card>
            <Card sx={{ Width: "100%", height: "100%" }}>
                <Toolbar sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }}}>
                    <Typography sx={{ flex: '1 1 100%' }} variant='p'>
                        キーワードの選択
                    </Typography>
                </Toolbar>
                
                <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:3 ,height: 350.5}}>
                    {/* <Skeleton sx={{ mt:0.5,width: "100%",height: 394.5 }} animation="wave" variant="rectangular" /> */}
                    <ThreeDots height="100" width="100" radius="30" color="#4fa94d" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>                  
            </Card>
        );
    }else{
        return(
            <Card sx={{height: "100%" }}>
                <Toolbar sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }}}>
                    <Typography sx={{ flex: '1 1 100%' }} variant='p'>
                        キーワードの選択
                    </Typography>
                </Toolbar>
                <svg viewBox={`${-margin.left} ${margin.top} ${svgWidth} ${svgHeight}`} >
                    {node.leaves().map((item,i)=>{
                        return(
                        <g transform={`translate(${item.x},${item.y})`} style={styles}>
                            <circle className='key'
                                r={item.r}
                                fill='#ff9500' 
                                opacity={(node.leaves().length-i)/node.leaves().length+0.1}
                                
                                onClick={(e) => onClickhandle(e,item.data.name)}
                                style={{cursor:'pointer'}}
                            />
                            <text fontSize={item.r*0.45}  dominantBaseline="central" textAnchor="middle" style={{pointerEvents: "none"}}>
                                {item.data.name}
                            </text>
                        </g>
                        )
                    })}
                    {/* <defs>
                        <linearGradient id={id} x1={0} y1={1} x2={0} y2={0}>
                            <stop offset="0%" stopColor={colorHandle(0)} />
                            <stop offset="5%" stopColor={colorHandle(0.05)} />
                            <stop offset="10%" stopColor={colorHandle(0.1)} />
                            <stop offset="15%" stopColor={colorHandle(0.15)} />
                            <stop offset="20%" stopColor={colorHandle(0.2)} />
                            <stop offset="25%" stopColor={colorHandle(0.25)} />
                            <stop offset="30%" stopColor={colorHandle(0.3)} />
                            <stop offset="35%" stopColor={colorHandle(0.35)} />
                            <stop offset="40%" stopColor={colorHandle(0.4)} />
                            <stop offset="45%" stopColor={colorHandle(0.45)} />
                            <stop offset="50%" stopColor={colorHandle(0.5)} />
                            <stop offset="55%" stopColor={colorHandle(0.55)} />
                            <stop offset="60%" stopColor={colorHandle(0.6)} />
                            <stop offset="65%" stopColor={colorHandle(0.65)} />
                            <stop offset="70%" stopColor={colorHandle(0.7)} />
                            <stop offset="75%" stopColor={colorHandle(0.75)} />
                            <stop offset="80%" stopColor={colorHandle(0.8)} />
                            <stop offset="85%" stopColor={colorHandle(0.85)} />
                            <stop offset="90%" stopColor={colorHandle(0.9)} />
                            <stop offset="95%" stopColor={colorHandle(0.95)} />
                            <stop offset="100%" stopColor={colorHandle(1)} />
                        </linearGradient>
                    </defs>
                    <rect id={id} x='270' y='100' width="10" height="100" fill={url}/>
                    <line x1='280' y1='100.5' x2='285' y2='100.5' stroke='black'/>
                    <text x='286' y='102.5' font-size='5'>
                        
                    </text>
                    <line x1='280' y1='199.5' x2='285' y2='199.5' stroke='black'/>
                    <text x='286' y='197.5' font-size='5'>
                        
                    </text> */}
                </svg>
            </Card>
        );
        const data = await response.json();
        dispatch(changePapersKeyword(data));
        dispatch(changeTableDataJudge(true));
      })();
    }
  }, [keyword, startYear, endYear]);
  console.log(papers);
  let packs = d3.pack().size([width, height]).padding(0);
  let root = d3.hierarchy(data);
  root.sum(function (d) {
    return d.count;
  });
  let node = packs(root);

  const styles = {
    transition: "transform 1s",
  };

  const onClickhandle = (e, name) => {
    dispatch(changeKeyword(name));
    dispatch(changeTableDataJudge(false));
    dispatch(changeScrollJudge(true));
    dispatch(changeColumnsJudge("keyword"));
  };
  if (!judge) {
    return (
      // <Card sx={{p:3, Width: "100%", height: "100%" }}>
      //     <p>キーワードの選択</p>
      //     {/*<Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:5 }}> */}
      //         <Skeleton sx={{ width: "100%",height: "100%" }} animation="wave" variant="rectangular" />
      //     {/* </Box>                   */}
      // </Card>
      <Card sx={{ Width: "100%", height: "100%" }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography sx={{ flex: "1 1 100%" }} variant="p">
            キーワードの選択
          </Typography>
        </Toolbar>

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          sx={{ my: 3, height: 350.5 }}
        >
          {/* <Skeleton sx={{ mt:0.5,width: "100%",height: 394.5 }} animation="wave" variant="rectangular" /> */}
          <ThreeDots
            height="100"
            width="100"
            radius="30"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </Box>
      </Card>
    );
  } else {
    return (
      <Card sx={{ height: "100%" }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography sx={{ flex: "1 1 100%" }} variant="p">
            キーワードの選択
          </Typography>
        </Toolbar>
        <svg viewBox={`${-margin.left} ${margin.top} ${svgWidth} ${svgHeight}`}>
          {node.leaves().map((item, i) => {
            return (
              <g transform={`translate(${item.x},${item.y})`} style={styles}>
                <circle
                  className="key"
                  r={item.r}
                  fill="#ff9500"
                  opacity={
                    (node.leaves().length - i) / node.leaves().length + 0.1
                  }
                  onClick={(e) => onClickhandle(e, item.data.name)}
                  style={{ cursor: "pointer" }}
                />
                <text
                  fontSize={item.r * 0.4}
                  dominantBaseline="central"
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {item.data.name}
                </text>
              </g>
            );
          })}
        </svg>
      </Card>
    );
  }
};

export default BubbleChart;
