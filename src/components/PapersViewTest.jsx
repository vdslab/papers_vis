import * as d3 from 'd3';
import React ,{useState,useEffect } from "react";

const PapersViewTest = (keyword) => {
    const [journalsData, setJournalsData] = useState([]);
    const [authorData,setAuthorData] = useState([]);
    console.log(keyword)
    useEffect(() => {
        (async () => {
            const response = await fetch("/.netlify/functions/api/journals");
            const data = await response.json();
            setJournalsData(data);
        })();
      }, [keyword]);
      console.log(journalsData)
    return (
        <div>
            論文リスト
        </div>
    );
}

export default PapersViewTest;