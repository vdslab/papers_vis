import { TabScrollButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import  NetworkGraph  from '../components/NetworkGraph';
import NodeDetail from '../components/NodeDetail';
import SelectLabel from '../components/SelectLabel';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';


const Network = () => {
    const [detail, setDetail] = useState({});
    const [isOpenMenu, setIsOpenMenu] = useState(true);
    const [nodeLabel, setNodeLabel] = useState("title");
    const search = useLocation().search;
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(false);
    const query = new URLSearchParams(search);
    return(
        
        <section style={{display:'flex', margin: '20px'}}>

            

            <div style={{width:'55%'}}>
                <NetworkGraph detail = {detail} setDetail = {setDetail} nodeLabel = {nodeLabel} 
                loading = {loading} setLoading = {setLoading} reloading = {reloading}/>
                
            </div>

            <SelectLabel nodeLabel = {nodeLabel} setNodeLabel = {setNodeLabel}/>

            
            <NodeDetail detail = {detail} isOpenMenu = {isOpenMenu} setIsOpenMenu = {setIsOpenMenu}
           reloading = {reloading}  setReloading = {setReloading}/>

            <button className='button is-white' style={{margin : '0 0 0 5px'}} onClick = { () => setIsOpenMenu(!isOpenMenu)}>
                {
                !isOpenMenu ? 
                <KeyboardArrowDownIcon/> :
                <KeyboardArrowUpIcon />
                }
            </button>

            

        </section>
    );
}

export default Network;