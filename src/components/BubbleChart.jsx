import keywords from "../keyword_No5/all_keywords.json"
import * as d3 from 'd3';
import { height } from "@mui/system";
import React ,{useState,useEffect } from "react";
import PapersViewTest from "./PapersViewTest";

const BubbleChart = () => {
    const width = 250;
    const height = 270;
    const [papersValue,setPapersValue] = useState([5000]);
    const [bubble_list,setData] = useState([{children:keywords.filter((item) =>{return item.count > papersValue})}]);
    const [keyword,setKeyword] = useState([])

    useEffect(() => {
        const bubble_list = {children:keywords.filter((item) =>{return item.count > papersValue})};
        setData(bubble_list)
    },[papersValue])
    //let color = d3.scaleOrdinal(d3.schemeCategory20c);
    let packs = d3.pack()
                 .size([width, height])
                 .padding(0);
    let root = d3.hierarchy(bubble_list);
    root.sum(function(d) { return d.count; });
    let node = packs(root);

    const handleTypeChange = (e) => {
        setValue(e.target.value);
    }

    const styles = {
        transition:"transform 1s"
    }

    const handleMouseClick = (e,item) => {
        setKeyword(item.data.name);
    }

    return(
        <div>
            <select name="type" value={papersValue} onChange={(e) => handleTypeChange(e)}>
                <option value={3000}>3000</option>
                <option value={4000}>4000</option>
                <option value={5000}>5000</option>
            </select>
            <svg viewBox="0 0 250 250" width = "100%" height = "400" className='card'>
                {node.leaves().map((item,i)=>{
                    return(
                    <g transform={`translate(${item.x},${item.y})`} style={styles}>
                        <circle data-tip data-for="sadFace" r={item.r} fill="#ff9500" 
                        opacity={(node.leaves().length-i)/node.leaves().length+0.1}  onClick={(e) => handleMouseClick(e,item)}/>
                        <text fontSize={item.r*0.4}  dominantBaseline="central" textAnchor="middle">
                            {item.data.name}
                        </text>
                    </g>
                )
            })}
            </svg>
            <PapersViewTest keyword={keyword}/>
        </div>
        
        
    );
    
}

export default BubbleChart