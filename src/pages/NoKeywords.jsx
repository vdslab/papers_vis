
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import { InputAdornment } from '@mui/material';
import { Box, Grid } from "@mui/material";
import {useRef,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import SearchForm from '../components/SearchForm';
import PapersView from '../components/PapersView';

import { changeScrollJudge } from '../redux/scrollJudge';
import { changePapersKeyword } from '../redux/papersKeywordSlice';
import { changeKeyword } from '../redux/keywordSlice';

export default function Main() {
  const dispatch = useDispatch();
  const scrollJudge = useSelector((state) => state.scrollJudge.judge);
  const scrollRef = useRef(null);
  useEffect(() => {
    if(scrollJudge) {
      scrollRef.current.scrollIntoView({behavior: 'smooth' });
      dispatch(changeScrollJudge(false));
    }
    dispatch(changePapersKeyword([]));
    dispatch(changeKeyword(''));
  },[scrollJudge])
    return (
    <div style={{margin: '40px'}}>
      
      {/*  論文検索フォーム */}
      <SearchForm />

      {/*論文リスト */}
      <div  ref={scrollRef} className = "menu" >
      <Box>
        <Grid container sx={{ p: 3 ,margin:'30px' }} columnSpacing={2} rowSpacing={2} >   
          <Grid item xs={11}>
            <PapersView />
          </Grid>
        </Grid>
      </Box>
      </div>
    </div>
    );
  }