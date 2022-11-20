import { useState } from "react";
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import SelectLabel from "./SelectLabel";
import SelectPartOrWholeLabel from "./SelectPartOrWholeLabel";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));


const SideBar = ({sideBarOpen, setSideBarOpen, nodeLabel, setNodeLabel, LabelPart ,setLabelPart,
    }) => {
    return(
        <div>
            <Drawer  variant="persistent" anchor='left' open={sideBarOpen} onClose={()=> setSideBarOpen(!sideBarOpen)}> 
                <DrawerHeader>
                <IconButton aria-label="delete" onClick={() => setSideBarOpen(!sideBarOpen)}>
                    <ArrowBackIcon/>
                </IconButton>
                
            </DrawerHeader>
            <Divider />
            
                <Stack spacing={4}>
                    <SelectLabel nodeLabel = {nodeLabel} setNodeLabel = {setNodeLabel}/>
                    <SelectPartOrWholeLabel title = {"ラベル表示量"} LabelPart = {LabelPart} setLabelPart = {setLabelPart}/>
                    
                </Stack>
            </Drawer>
        </div>
    );
}

export default SideBar;