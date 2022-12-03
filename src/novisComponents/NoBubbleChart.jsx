import * as d3 from 'd3';
import React ,{useState,useEffect ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import {changePapersCount} from "../redux/papersCountSlice"
import { changeNovisKeyword } from '../redux/noVisKeyword';
import { changePapersKeyword } from '../redux/papersKeywordSlice';
import { changeColumnsJudge } from "../redux/columnsSlice";
import { changeScrollJudge } from '../redux/scrollJudge';
import { changeTableDataJudge } from '../redux/tableDataJudge';
import { Card, Tooltip ,Box, Typography,Toolbar,Select} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { ThreeDots } from 'react-loader-spinner';
import YearRangeSlider from './YearRangeSlider';

const NoBubbleChart = () => {
    const dispatch = useDispatch();
    const startYear = useSelector((state) => state.startYear.year);
    const endYear = useSelector((state) => state.endYear.year);
    const novisKeyword = useSelector((state) => state.novisKeyword.keyword);
    const [data,setData] = useState([]);
    const papers = useSelector((state) => state.papersKeyword.papers);
    const [judge ,setJudge] = useState(false);
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
                const request = await fetch(`/data/bubble_chart/${startYear}.json`);
                const data = await request.json();
                // let list = [];
                // for (let i = startYear;i <= endYear;i++){
                //     const request = await fetch(`/data/bubble_chart/${}.json`);
                //     const data = await request.json();
                //     list.forEach(element => {
                //         for(let j = 0;j < data.length;j++){
                //             if(element.name === data[j].name){
                //                 element.count += data[j].count;
                //                 data.splice(j,1);
                //                 break;
                //             }
                //         }
                //     })
                //     list = list.concat(data);
                // }
                // list.sort((a, b) => b.count - a.count);
                // const result = {children:list.slice(0,30)}
                setData({children:data[endYear]});
                setJudge(true);
            })();
    },[endYear,startYear]);
    const tableDataJudge = useSelector((state) => state.tableDataJudge.judge);
    useEffect(() => {
        // if(isFirstRender.current) { // 初回レンダー判定
        //     isFirstRender.current = false // もう初回レンダーじゃないよ代入
        // } else {
            (async () => {
                const response = await fetch(`/.netlify/functions/api/keywords/${novisKeyword}/${startYear}/${endYear}`);
                const data = await response.json();
                dispatch(changePapersKeyword(data));
                dispatch(changeTableDataJudge(true));
                
                
            })();
        // }
        console.log(tableDataJudge)
    },[novisKeyword,startYear,endYear])
    
    const styles = {
        transition:"transform 1s"
    }
    const [child,setChild] = useState('')
    const onClickhandle = (e) => {
        const name = e.target.value;
        dispatch(changeNovisKeyword(name));
        setChild(name);
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
                
                <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:3 ,height: 100}}>
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
                <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:3 ,height: 100}}>
                    <FormControl sx={{ m: 1, width: 500 }} >
                        <InputLabel id="demo-simple-select-autowidth-label">キーワードを選択</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={child}
                                onChange={(e) => onClickhandle(e)}
                                label="キーワードを選択"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {data.children.map((item) => {
                                    return(
                                        <MenuItem value={item.name}>{item.name}</MenuItem>
                                    )                     
                                })}
                            </Select>
                    </FormControl>
                </Box>        
            </Card>
        );
    }
}

export default NoBubbleChart