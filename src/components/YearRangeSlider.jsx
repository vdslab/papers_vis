import { useSelect } from '@mui/base';
import {Box,Card} from '@mui/material';
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
      <Card sx={{ p: 3, height: "100%" }}>
        <p>年代の選択</p>
        <Box sx={{ margin: 3.5 }}>
          <Box sx={{ width: 280, height:180,marginTop:3, margin: -2 }}>
            <Slider
              sx={{ml:0.5, mt:15, height:5}}
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
          
          <Box sx={{ display: 'flex',height:150, margin: 1 }}>
            <form>
              <label>
                From  <input type="number" value={ startYear } 
                onChange={ (event)=>{         
                  dispatch(changeStartYear(Number(event.target.value)));
                  setValue([event.target.value,value[1]])
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
                  setValue([value[0],event.target.value])
                 }} 
                size="3"  min="1955" max="2021"/>
              </label>
            </form>
          </Box>
        </Box>
      </Card>
    );
  }

  export default YearRangeSlider;