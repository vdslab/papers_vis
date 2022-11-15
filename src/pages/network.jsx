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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

const Network = () => {
    const [detail, setDetail] = useState({});
    const [isOpenMenu, setIsOpenMenu] = useState(true);
    const [nodeLabel, setNodeLabel] = useState("title");
    const search = useLocation().search;
    const query = new URLSearchParams(search);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const toggleOpen=() => {
        setSideBarOpen(!sideBarOpen);
    }
    
    return(
        
        <section style={{display:'flex', margin: '20px'}}>

            {/*サイドバー*/}
            <Drawer  variant="persistent" anchor='left' open={sideBarOpen} onClose={toggleOpen}> 
            <DrawerHeader>
                <IconButton aria-label="delete" onClick={() => setSideBarOpen(!sideBarOpen)}>
                    <ArrowBackIcon/>
                </IconButton>
                
            </DrawerHeader>
            <Divider />
            
                <Stack spacing={4}>
                    <SelectLabel nodeLabel = {nodeLabel} setNodeLabel = {setNodeLabel}/>
                    <SelectPartOrWholeLabel />
                </Stack>
            </Drawer>

            <div style={{width:'55%'}}>
                <NetworkGraph detail = {detail} setDetail = {setDetail}
                sideBarOpen = {sideBarOpen} setSideBarOpen = {setSideBarOpen} 
                nodeLabel = {nodeLabel}/>
            </div>



 
            
            <NodeDetail detail = {detail} isOpenMenu = {isOpenMenu} setIsOpenMenu = {setIsOpenMenu}/>

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