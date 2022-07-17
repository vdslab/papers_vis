import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import * as React from 'react';



const YearRangeSlider = () => {
  const [value, setValue] = React.useState([1955, 2021]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function valuetext(value) {
    return `${value}°C`;
  }

    return (
        <Box sx={{ margin: 3.5 }}>
          <Box sx={{ width: 300, height: 30, margin: 2 }}>
            <Slider
              getAriaLabel={() => 'Temperature range'}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="on"
              getAriaValueText={valuetext}
              min={1955}
              max={2021}
            />
          </Box>
          
          <Box sx={{ display: 'flex', margin: 2 }}>
            <form>
              <label>
                From  <input type="text" value={ value[0] } onChange={ (event)=>{const newValue = [event.target.value, value[1]]; setValue(newValue) }} size="3" style={{ marginRight: '60px' }}/>
              </label>
            </form>
            <form>
              <label>
                To  <input type="text" value={ value[1] } onChange={ (event)=>{const newValue = [value[0], event.target.value]; setValue(newValue) }} size="3"/>
              </label>
            </form>
          </Box>
        </Box>
    );
  }

  export default YearRangeSlider;