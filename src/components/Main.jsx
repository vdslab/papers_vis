import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

import { InputAdornment } from "@mui/material";
import { Box, Grid } from "@mui/material";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SearchForm from "./SearchForm";
import YearRangeSlider from "./YearRangeSlider";
import BubbleChart from "./BubbleChart";
import PapersView from "./PapersView";

import { changeScrollJudge } from "../redux/scrollJudge";

export default function Main() {
  const dispatch = useDispatch();
  const scrollJudge = useSelector((state) => state.scrollJudge.judge);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollJudge) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
      dispatch(changeScrollJudge(false));
    }
  }, [scrollJudge]);
  return (
    <div style={{ margin: "40px" }}>
      {/*  論文検索フォーム */}
      <SearchForm />

      <Box>
        <Grid
          container
          sx={{ p: 3, margin: "30px" }}
          columnSpacing={2}
          rowSpacing={2}
        >
          {/* キーワードビュー　*/}
          <Grid item xs={11} md={4}>
            <YearRangeSlider />
          </Grid>
          <Grid item xs={11} md={7}>
            <BubbleChart />
          </Grid>
          {/* <Grid item xs={11}>
        <PapersView />
        </Grid> */}
        </Grid>
      </Box>

      {/*論文リスト */}
      <div ref={scrollRef} className="menu">
        <Box>
          <Grid
            container
            sx={{ p: 3, margin: "30px" }}
            columnSpacing={2}
            rowSpacing={2}
          >
            <Grid item xs={11}>
              <PapersView />
            </Grid>
          </Grid>
        </Box>
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
