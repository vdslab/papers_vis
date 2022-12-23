import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import React, { useLayoutEffect, useState } from 'react';
import useWindowSize from '../useWindowSize';
import {Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle, IconButton, Typography} from '@mui/material';

//評価用
import { useDispatch, useSelector } from "react-redux";
import { changePapersKeyword } from '../redux/papersKeywordSlice';
import { changeTableDataJudge } from '../redux/tableDataJudge';
import { changeNovisKeyword } from '../redux/noVisKeyword';
import { changeKeyword } from '../redux/keywordSlice';
import { changeSearchForm } from '../redux/searchFormSlice';
import { changePageActive } from '../redux/pageActiveSlice';

const Header = () => {
  const [width, height] = useWindowSize();
  const hatenaStyle = width >= 600?{position:'relative', bottom : "30px" }:{position:'relative', bottom : "30px", left:"400px" };
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const active = useSelector((state) => state.pageActive.active);
  //評価用
  const dispatch = useDispatch();
  const changeActive = (act) => {
    dispatch(changePageActive(act));
    dispatch(changePapersKeyword([]));
    dispatch(changeTableDataJudge(true));
    dispatch(changeNovisKeyword(''));
    dispatch(changeKeyword(''));
    dispatch(changeSearchForm(''));
  }
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
    return (
      <header>
        
        <div className="hero is-small is-info">
          <div className="hero-body">

           
            <h1 className='title' style= {{position:'relative', top : "20px"}} >paper vis</h1>

            <Grid container>

           
            <Grid item sm={11} >
            <Box display="flex" justifyContent="flex-end" sx = {hatenaStyle} >
            
            <HelpOutlineIcon onClick={handleClickOpen('paper')} style={{cursor:'pointer'}}/>
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
                    paper vizについて
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
                <Typography variant='h6' color='black'>paper vizについて</Typography>
                <Typography variant='p' color='black'>
                  paper vizはキーワードとネットワーク図を用いた論文探索サービスです。
                </Typography>
                <Typography sx={{pt:2}} variant='h6' color='black'>
                  年代について
                </Typography>
                <Typography variant='p' color='black'>
                  年代は検索する年代の範囲をスライダーで操作することができます。下に表記してあるFrom,Toの箱でも入力、調整が可能です。
                  <br/>年代の範囲は検索とキーワードの両方に影響します。
                </Typography>
                <Typography sx={{pt:2}} variant='h6' color='black'>
                  キーワードについて
                </Typography>
                <Typography variant='p' color='black'>
                  論文のabstractからtf-idfを用いて重要語句を抽出し、上位30個の語句をキーワードとして表示しています。
                  キーワードを選択することでそのキーワードを持つ論文を表示します。
                </Typography>
                <Typography sx={{pt:2}} variant='h6' color='black'>
                  論文の表示について
                </Typography>
                <Typography variant='p' color='black'>
                  論文は検索またはキーワードを選択することで、それらに見合った論文を表示します。
                  論文はソート可能で、通常は発行年でソートされています。
                  {/* 検索の場合、（タイトル、著者、発行年、ページ数、
                  被引用数、url）を表示します。キーワードの場合、（タイトル、発行年、ページ数、被引用数、キーワード重要度、url）を表示します。 */}
                </Typography>
                <Typography sx={{pt:2}} variant='h6' color='black'>
                  ネットワーク図について
                </Typography>
                <Typography variant='p' color='black'>
                  論文のabstractの類似度を計算し、選択した論文と類似論文を線で結びネットワークを形成して表示しています。
                </Typography>
                <Typography sx={{pt:2}} variant='h6' color='black'>
                  データについて
                </Typography>
                <Typography variant='p' color='black'>
                <a href='https://ieeexplore.ieee.org/Xplore/home.jsp' target='_blank'>
                  IEEE xplore
                  </a>
                  が保持している論文雑誌から
                  <a href='https://www.scimagojr.com/journalrank.php?' target='_blank'>
                    SJR
                  </a>
                  が定めたインパクトファクターの上位30個を抽出し使用しています。
                </Typography>
              </DialogContentText>
              </DialogContent>
            </Dialog>           
   
          </Box>
  
            </Grid>
            </Grid>
            </div>
            <div className="tabs is-boxed">
            <ul >
                <li className={active === 'home' && 'is-active'}>
                  <a onClick = {() => changeActive('home')}>
                    <Link to="/">
                      home
                    </Link>
                  </a>
                </li>
                <li className={active === 'nokeywords' && 'is-active'}>
                  <a onClick = {() => changeActive('nokeywords')}>
                    <Link to="nokeywords">
                      キーワードなし
                    </Link>
                  </a>
                </li>
                <li className={active === 'novis' && 'is-active'}>
                  <a onClick = {() => changeActive('novis')}>
                    <Link to="novis">
                      可視化なし
                    </Link>
                  </a>
                </li>
                
            </ul>

        </div>
      </header>
    );
  };
  export default Header;