import { Card, Tooltip ,Box, Typography,Toolbar, StyledEngineProvider,Button} from "@mui/material";
import { ThreeDots } from 'react-loader-spinner';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return(
        <Card sx={{ Width: "100%", height: "100%" }}>        
        <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:3 ,height: 60}}>
            <Typography sx={{ flex: '1 1 100%' }} variant='h4' align="center">
                404 Not Found
            </Typography>
        </Box> 
        <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:3 ,height: 60}}>
            <Typography sx={{ flex: '1 1 100%' }} variant='h6' align="center">
                申し訳ございません<br/>お探しの論文は見つかりませんでした
            </Typography>
        </Box> 
        <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:3 }}>
            <Link to='../..'>
                <Button variant="outlined" startIcon={<ArrowBackIcon/>}>
                    ホームに戻る
                </Button>             
            </Link>
        </Box> 

            
    </Card>
    );
}

export default NotFound;