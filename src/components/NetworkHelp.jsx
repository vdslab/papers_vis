import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useEffect,useState ,useRef} from 'react';
import {Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle, Typography} from '@mui/material';
import Box from '@mui/material/Box';

const NetworkHelp = () =>{
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
               ネットワーク画面について
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
            ネットワーク図について
           </Typography>
           <Typography variant='p' color='black'>
             中心に表示されているグラフは選択した論文と類似している論文を表示しています。
             <br/>それぞれのノードを選択することで、論文の詳細を見ることができます。また、隣り合っている論文を強調して表示します。
             <br/>青色で表示されているノードは選択した論文で、紫色で表示されているものは類似論文となっています。
             類似論文は選択すると赤色で表示されます。
           </Typography>
           <Typography sx={{pt:2}} variant='h6' color='black'>
            ネットワーク図の操作
           </Typography>
           <Typography variant='p' color='black'>
             左クリックでネットワークの移動、スクロールでズームイン、ズームアウトが可能です。
           </Typography>
           <Typography sx={{pt:2}} variant='h6' color='black'>
             グラフ設定について
           </Typography>
           <Typography variant='p' color='black'>
             グラフ設定を選択することで、グラフに表示させるノードラベルとラベル表示量、ラベル文字量を変化させることができます。
             <br/>ノードラベルはタイトル、キーワード、著者、年代、なしに変更可能です。
             <br/>ラベル表示量は一部にすることで選択したノードとつながりを持つものが表示され、全体にすることですべてのノードで表示されます。
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

export default NetworkHelp;