import keywords from "../keyword_No5/all_keywords.json"
import * as d3 from 'd3';
import { height } from "@mui/system";
import React ,{useState,useEffect } from "react";

const BubbleChart = () => {
    const width = 250;
    const height = 260;
    const [value,setValue] = useState([5000]);
    const [bubble_list,setData] = useState([{children:keywords.filter((item) =>{return item.count > value})}]);
    useEffect(() => {
        const bubble_list = {children:keywords.filter((item) =>{return item.count > value})};
        setData(bubble_list)
    },[value])
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
    return(
        <div>
            <select name="type" value={value} onChange={handleTypeChange}>
                <option value={3000}>3000</option>
                <option value={4000}>4000</option>
                <option value={5000}>5000</option>
            </select>
            <svg viewBox="0 0 250 270" width = "100%" height = "400" className='card'>
                {node.leaves().map((item,i)=>{
                    return(
                    <g transform={`translate(${item.x},${item.y})`} style={styles}>
                        <circle data-tip data-for="sadFace" r={item.r} fill="#ff9500" opacity={(node.leaves().length-i)/node.leaves().length+0.1} />
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