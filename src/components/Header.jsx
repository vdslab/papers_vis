import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import React, { useLayoutEffect, useState } from 'react';
import useWindowSize from '../useWindowSize';

const Header = () => {

  const [width, height] = useWindowSize();
  const hatenaStyle = width >= 600?{position:'relative', bottom : "30px" }:{position:'relative', bottom : "30px", left:"400px" };
  
    return (
      <header>
        
        <div className="hero is-small is-info">
          <div className="hero-body">

           
            <h1 className='title' style= {{position:'relative', top : "20px"}} >paper viz</h1>

            <Grid container>

           
            <Grid item sm={11} >
            <Box display="flex" justifyContent="flex-end" sx = {hatenaStyle} >
            
            <Link to = "help">
              <HelpOutlineIcon />
            </Link>
   
          </Box>
  
            </Grid>
          
        </Grid>
          </div>


          
        </div>
      </header>
    );
  };
  export default Header;