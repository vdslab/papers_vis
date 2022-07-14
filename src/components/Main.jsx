
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import { InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';

import YearRangeSlider from './YearRangeSlider';


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
          <svg viewBox="0 0 200 100" width = "100%" height = "300" className='card'>
              <circle cx="10" cy="10" r="10"/>
              <circle cx="30" cy="50" r="10"/>
              <circle cx="50" cy="70" r="10"/>
          </svg>
      </div>

      <YearRangeSlider />

      {/*論文リスト */}
      <div style={{ margin: '40px'}} className = "menu">
        <p className='menu-label'>
          論文リスト
        </p>

        <ul className='menu-list'>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
          <li><p>論文1</p></li>
        </ul>
      </div>

      
    </div>
    );
  }