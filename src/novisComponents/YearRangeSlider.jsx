import { useSelect } from "@mui/base";
import { Box, Card, Typography, Toolbar } from "@mui/material";
import Slider from "@mui/material/Slider";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeStartYear } from "../redux/startYearSlice";
import { changeEndYear } from "../redux/endYearSlice";

const YearRangeSlider = () => {
  const dispatch = useDispatch();
  const startYear = useSelector((state) => state.startYear.year);
  const endYear = useSelector((state) => state.endYear.year);
  const [value, setValue] = React.useState([1955, 2021]);
  const margin = {
    left: 80,
    right: 20,
    top: 20,
    bottom: 30,
  };
  const contentWidth = 300;
  const contentHeight = 200;

  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  function valuetext() {
    return `${value}°C`;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        <Typography sx={{ flex: "1 1 100%" }} variant="p">
          年代の選択
        </Typography>
      </Toolbar>
      <Box sx={{ margin: 3.5 }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Slider
            sx={{ ml: 3, mt: 5, mr: 3, height: 5 }}
            getAriaLabel={() => "Temperature range"}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            onChangeCommitted={(event) => {
              dispatch(changeStartYear(value[0]));
              dispatch(changeEndYear(value[1]));
            }}
            valueLabelDisplay="on"
            getAriaValueText={valuetext}
            min={1955}
            max={2021}
          />
        </Box>

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form>
            <label>
              <p>From</p>{" "}
              <input
                type="number"
                value={startYear}
                onChange={(event) => {
                  dispatch(changeStartYear(Number(event.target.value)));
                  setValue([event.target.value, value[1]]);
                }}
                size="3"
                style={{ marginRight: "100px" }}
                min="1955"
                max="2021"
              />
            </label>
          </form>
          <form>
            <label>
              <p>To</p>{" "}
              <input
                type="number"
                value={endYear}
                onChange={(event) => {
                  dispatch(changeEndYear(Number(event.target.value)));
                  setValue([value[0], event.target.value]);
                }}
                size="3"
                min="1955"
                max="2021"
              />
            </label>
          </form>
        </Box>
      </Box>
    </Card>
  );
};

export default YearRangeSlider;
