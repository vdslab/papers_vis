import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useEffect,useState ,useRef} from 'react';
import {Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle, Typography} from '@mui/material';
import Box from '@mui/material/Box';

const NovisNetworkHelp = () =>{
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const descriptionElementRef = useRef(null);
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
    return(
        <foreignObject
        x={10}
        y={110}
        width="110"
        height="50"
        >
        <Tooltip title="ヘルプ" placement="right">
         <IconButton aria-label="delete" 
         style = {{margin:"5px"}}>
             <HelpIcon onClick={handleClickOpen('paper')} style={{cursor:'pointer'}}/>
         </IconButton>
         </Tooltip>
         <Dialog
         open={open}
         onClose={handleClose}
         scroll={scroll}
         aria-labelledby="scroll-dialog-title"
         aria-describedby="scroll-dialog-description"
       >
         <DialogTitle id="scroll-dialog-title">
           <Box sx={{ display: "flex" }}>
             <Typography variant='h4' sx={{mt:1,flexGrow:1}}>
               論文表示画面について
             </Typography>
             <DialogActions>
               <IconButton sx={{ justifyContent: "right",  alignItems: "right"}}>
                 <CloseIcon onClick={handleClose}/>
               </IconButton>
             </DialogActions>
           </Box>
         </DialogTitle>
         <DialogContent dividers={scroll === 'paper'}>
         <DialogContentText
           id="scroll-dialog-description"
           ref={descriptionElementRef}
           tabIndex={1}
         >
           <Typography variant='h6' color='black'>
            論文表示画面について
           </Typography>
           <Typography variant='p' color='black'>
             可視化なしページの類似論文は画面右側に表示しています。類似論文を選択することで、さらにその論文と類似しているものを表示します。
           </Typography>
           <Typography sx={{pt:2}} variant='h6' color='black'>
             論文詳細について
           </Typography>
           <Typography variant='p' color='black'>
             論文詳細は選択したノードのタイトル、著者、キーワード、概要を表示します。
             また、「generate a network out of this paper」を選択することでその論文のネットワークを再構築します。
           </Typography>
         </DialogContentText>
         </DialogContent>
       </Dialog>
       </foreignObject>
    )
}

export default NovisNetworkHelp;