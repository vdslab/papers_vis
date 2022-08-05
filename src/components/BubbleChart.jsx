import * as d3 from 'd3';
import React ,{useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {changePapersCount} from "../redux/papersCountSlice"
import { changeKeyword } from '../redux/keywordSlice';
import { changePapersKeyword } from '../redux/papersKeywordSlice';

function Loading (){
    return(
        <div>
            <svg viewBox="0 0 250 250" width = "100%" height = "400" className='card'>
                <text x="200" y="100" >
                    Loading
                </text>
            </svg>
        </div>
    )
}

const BubbleChart = () => {
    const width = 250;
    const height = 270;
    const dispatch = useDispatch();
    const startYear = useSelector((state) => state.startYear.year);
    const endYear = useSelector((state) => state.endYear.year);
    const keyword = useSelector((state) => state.keyword.keyword);
    const [data,setData] = useState([]);
    const papers = useSelector((state) => state.papersKeyword.papers);
    const [judge ,setJudge] = useState(false);

    useEffect(() => {
        (async () => {
            let list = [];
            for (let i = startYear;i <= endYear;i++){
                const request = await fetch(`../../data/keyword_No5_year_alter/${i}.json`);
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
        (async () => {
            const response = await fetch(`/.netlify/functions/api/keywords/${keyword}/${startYear}/${endYear}`);
            const data = await response.json();
            dispatch(changePapersKeyword(data));
        })();
        console.log(papers)
    },[keyword])
    
    let packs = d3.pack()
                 .size([width, height])
                 .padding(0);
    let root = d3.hierarchy(data);
    root.sum(function(d) { return d.count; });
    let node = packs(root);

    const styles = {
        transition:"transform 1s"
    }

    const onClickhandle = (e,name)=> {
        dispatch(changeKeyword(name));
    }
    if(!judge){
        return <Loading />
    }
    return(
        <div>
            <svg viewBox="0 0 250 250" width = "100%" height = "400" className='card'>
                {node.leaves().map((item,i)=>{
                    return(
                    <g transform={`translate(${item.x},${item.y})`} style={styles}>
                        <circle data-tip data-for="sadFace" 
                            r={item.r} 
                            fill="#ff9500" 
                            opacity={(node.leaves().length-i)/node.leaves().length+0.1} 
                            onClick={(e) => onClickhandle(e,item.data.name)}
                            />
                        <text fontSize={item.r*0.4}  dominantBaseline="central" textAnchor="middle">
                            {item.data.name}
                        </text>
                    </g>
                )
            })}
            </svg>
        </div>
        
    );
    
}

export default BubbleChart