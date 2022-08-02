import { useSelect } from '@mui/base';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {changeStartYear} from '../redux/startYearSlice';
import {changeEndYear} from '../redux/endYearSlice';

const YearRangeSlider = () => {
  const dispatch = useDispatch();
  const startYear = useSelector((state) => state.startYear.year);
  const endYear = useSelector((state) => state.endYear.year);
  const [value,setValue] = React.useState([1955,2021])

  function valuetext() {
    return `${value}°C`;
  }

    return (
        <Box sx={{ margin: 3.5 }}>
          <Box sx={{ width: 300, height: 30, margin: 2 }}>
            <Slider
              getAriaLabel={() => 'Temperature range'}
              value={value}
              onChange = {(event) => {
                setValue(event.target.value);
              }}
              onChangeCommitted = {(event) => {
                dispatch(changeStartYear(value[0]));
                dispatch(changeEndYear(value[1]));
              }}
              valueLabelDisplay="on"
              getAriaValueText={valuetext}
              min={1955}
              max={2021}
            />
          </Box>
          
          <Box sx={{ display: 'flex', margin: 2 }}>
            <form>
              <label>
                From  <input type="number" value={ startYear } 
                onChange={ (event)=>{         
                  dispatch(changeStartYear(Number(event.target.value)));
                }} 
                size="3" style={{ marginRight: '60px' }}
                min="1955" max="2021"
                />
              </label>
            </form>
            <form>
              <label>
                To  <input type="number" value={ endYear } 
                onChange={ (event)=>{
                  dispatch(changeEndYear(Number(event.target.value)));
                 }} 
                size="3"  min="1955" max="2021"/>
              </label>
            </form>
          </Box>
        </Box>
    );
  }

  export default YearRangeSlider;