import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";

export default function SelectPartOrWholeLabel({
  title,
  labelPart,
  setLabelPart,
}) {
  const handleChange = (event) => {
    setLabelPart(event.target.value);
  };

  return (
    <Container>
      <Box>
        <FormControl>
          <FormLabel>{title}</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={labelPart}
            onChange={handleChange}
          >
            <FormControlLabel value="part" control={<Radio />} label="一部" />
            <FormControlLabel value="whole" control={<Radio />} label="全体" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Container>
  );
}
