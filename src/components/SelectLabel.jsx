import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function SelectLabel ({nodeLabel, setNodeLabel}) {

  console.log(nodeLabel);
  const handleChange = (event) => {
    setNodeLabel(event.target.value);
  }

    return (
        <Box sx={{ minWidth: 150 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">ノードラベル</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value = {nodeLabel}
              label= "nodeLabel"
              onChange={handleChange}
            >
              <MenuItem value="title">タイトル</MenuItem>
              <MenuItem value="keyword">キーワード</MenuItem>
              <MenuItem value="author">著者</MenuItem>
              <MenuItem value="year">年代</MenuItem>
              <MenuItem value="none">なし</MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
    
}