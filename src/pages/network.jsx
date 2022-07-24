import { TabScrollButton } from '@mui/material';
import  NetworkGraph  from '../components/NetworkGraph';
import NodeDetail from '../components/NodeDetail';
import { useState } from 'react';

const Network = () => {
    const [detail, setDetail] = useState({});


    return(
        
        <section style={{display:'flex', margin: '20px'}}>

            <div style={{width:'55%'}}>
            
                <NetworkGraph detail = {detail} setDetail = {setDetail}/>
                
                
            </div>

            <NodeDetail detail = {detail}/>
          
        </section>
    );
}

export default Network;