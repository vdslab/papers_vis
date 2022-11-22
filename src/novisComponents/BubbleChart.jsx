import * as d3 from 'd3';
import React ,{useState,useEffect ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import {changePapersCount} from "../redux/papersCountSlice"
import { changeKeyword } from '../redux/keywordSlice';
import { changePapersKeyword } from '../redux/papersKeywordSlice';
import { changeColumnsJudge } from "../redux/columnsSlice";
import { changeScrollJudge } from '../redux/scrollJudge';
import { changeTableDataJudge } from '../redux/tableDataJudge';
import { Card, Tooltip ,Box, Typography,Toolbar} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import LabelProgress from '../components/LabelProgress';
import Skeleton from '@mui/material/Skeleton';
import { ThreeDots } from 'react-loader-spinner';

const BubbleChart = () => {
    const dispatch = useDispatch();
    const startYear = useSelector((state) => state.startYear.year);
    const endYear = useSelector((state) => state.endYear.year);
    const keyword = useSelector((state) => state.keyword.keyword);
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
                let list = [];
                for (let i = startYear;i <= endYear;i++){
                    const request = await fetch(`/data/keyword_No5_year_alter/${i}.json`);
                    const data = await request.json();
                    list.forEach(element => {
                        for(let j = 0;j < data.length;j++){
                            if(element.name === data[j].name){
                                element.count += data[j].count;
                                data.splice(j,1);
                                break;
                            }
                        }
                    })
                    list = list.concat(data);
                }
                list.sort((a, b) => b.count - a.count);
                const result = {children:list.slice(0,30)}
                setData(result);
                setJudge(true);
            })();
    },[endYear,startYear]);
    console.log(data)
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
            console.log(papers)
        }
    },[keyword])
    
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
                    <select >
                        {data.children.map((item) => {
                            <option value={item.count}>{item.name}</option>
                        })}
                    </select>
                    
                </svg>
            </Card>
        );
    }
}

export default BubbleChart