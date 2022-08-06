
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import { InputAdornment } from '@mui/material';
import { Box, Grid } from "@mui/material";

import YearRangeSlider from './YearRangeSlider';
import BubbleChart from './BubbleChart';
import PapersView from './PapersView';

export default function Main() {
    return (
    <div style={{margin: '40px'}}>
      
      {/*  論文検索フォーム */}
      <Box sx={{ margin: '70px' }}>
          <Box sx={{ width: '100%', height: 30 }}>
            <TextField fullWidth id="fullWidth" label="論文検索" variant="outlined"
            InputProps={{startAdornment:<InputAdornment position="start"><SearchIcon/></InputAdornment>}}/>
          </Box>
      </Box>

      <Box>
      <Grid container sx={{ p: 3 ,margin:'30px' }} columnSpacing={2} rowSpacing={2}>    
      {/* キーワードビュー　*/}
        <Grid item xs={4}>
          <YearRangeSlider/>
        </Grid>
        <Grid item xs={7}> 
          <BubbleChart />
        </Grid>
        
      </Grid>
      </Box>

      {/*論文リスト */}
      <div style={{ margin: '40px'}} className = "menu">
        <PapersView />
        {/* <p className='menu-label'>
          論文リスト
        </p>

        <ul className='menu-list'>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
        </ul> */}
      </div>

      
    </div>
    );
  }