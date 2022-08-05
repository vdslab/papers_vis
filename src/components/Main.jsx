
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import { InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';

import YearRangeSlider from './YearRangeSlider';
import BubbleChart from './BubbleChart';
import PapersView from './PapersView';

export default function Main() {
    return (
    <div style={{margin: '40px'}}>
      
      {/*  論文検索フォーム */}
      <Box sx={{ margin: '40px' }}>
          <Box sx={{ width: '100%', height: 30 }}>
            <TextField fullWidth id="fullWidth" label="論文検索" variant="outlined"
            InputProps={{startAdornment:<InputAdornment position="start"><SearchIcon/></InputAdornment>}}/>
          </Box>
      </Box>

    
      {/* キーワードビュー　*/}
      <div style={{ margin: '40px'}}>
          <p>キーワード検索</p> 
          <BubbleChart />
      </div>
      
      <YearRangeSlider />

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