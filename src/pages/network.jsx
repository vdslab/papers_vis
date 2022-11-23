import { TabScrollButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import  NetworkGraph  from '../components/NetworkGraph';
import NodeDetail from '../components/NodeDetail';
import SelectLabel from '../components/SelectLabel';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import SelectPartOrWholeLabel from "../components/SelectPartOrWholeLabel";
import { positions } from '@mui/system';
import SideBar from '../components/SideBar';


const Network = () => {
    const [detail, setDetail] = useState({});
    const [isOpenMenu, setIsOpenMenu] = useState(true);
    const [nodeLabel, setNodeLabel] = useState("title");
    const search = useLocation().search;
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(true);
    const query = new URLSearchParams(search);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [nodeLabelsPart, setNodeLabelsPart] = useState("whole");
    const [LabelPart, setLabelPart] = useState("part");
    const [labelStringNum, setLabelStringNum] = useState(20);
    const toggleOpen=() => {
        setSideBarOpen(!sideBarOpen);
    }
    
    return(
        
        <div style={loading?{margin: '550px auto'}:{display:'flex'}}>

            <SideBar 
            sideBarOpen = {sideBarOpen} setSideBarOpen = {setSideBarOpen} 
            nodeLabel = {nodeLabel}  setNodeLabel = {setNodeLabel}
            LabelPart = {LabelPart} setLabelPart = {setLabelPart}
            labelStringNum = {labelStringNum} setLabelStringNum = {setLabelStringNum}
            />
        

            
            
          <div style = {{width:"65%"}}>
                <NetworkGraph 
                detail = {detail} setDetail = {setDetail}
                sideBarOpen = {sideBarOpen} setSideBarOpen = {setSideBarOpen} 
                nodeLabel = {nodeLabel} 
                setLoading = {setLoading} loading = {loading}
                reloading = {reloading}
                isOpenMenu = {isOpenMenu} setIsOpenMenu = {setIsOpenMenu}
                LabelPart = {LabelPart} setLabelPart = {setLabelPart}
                labelStringNum = {labelStringNum} setLabelStringNum = {setLabelStringNum}
                />
            </div>
                
               
            {loading || <NodeDetail detail = {detail} isOpenMenu = {isOpenMenu} setIsOpenMenu = {setIsOpenMenu}
                reloading = {reloading}  setReloading = {setReloading}/>}
                
         

            {/*loading || <button className='button is-white' style={{margin : '0 0 0 5px'}} onClick = { () => setIsOpenMenu(!isOpenMenu)}>
                {
                !isOpenMenu ? 
                <KeyboardArrowDownIcon/> :
                <KeyboardArrowUpIcon />
                }
            </button>
            */}
            
            

        </div>
    );
}

export default Network;