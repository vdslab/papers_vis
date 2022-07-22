import { TabScrollButton } from '@mui/material';
import  NetworkGraph  from '../components/NetworkGraph';
import NodeDetail from '../components/NodeDetail';
import { useEffect, useState } from 'react';

const Network = () => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            
            console.log("433")

            const nodeData = await(await fetch('../../data/sample_node.json')).json();
            const linkData = await(await fetch('../../data/sample_edge.json')).json();
            console.log(nodeData)
            setNodes(nodeData.slice());
            setLinks(linkData.slice());
        }

        fetchData();
    },[]);

    return(
        
        <section style={{display:'flex', margin: '20px'}}>

            <div style={{width:'55%'}}>
               
               
                { 
                nodes.lenght === 0?
                <div>loading...</div>:
                <NetworkGraph nodeData = {nodes} setNodes = {setNodes} links = {links} setLinks = {setLinks} />
                }
                
            </div>

            <NodeDetail/>
          
        </section>
    );
}

export default Network;