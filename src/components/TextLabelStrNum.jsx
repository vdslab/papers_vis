import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const TextLabelStrNum = ({labelStringNum ,setLabelStringNum}) => {
    const handleChange = (e) => {
        setLabelStringNum(e.target.value);
    }
    return(
        <Box sx = {{'& > :not(style)': { m: 1, width: '20ch' },}}>
            <TextField 
            id="standard-basic" 
            label="ラベル文字数" 
            variant="standard" 
            value = {labelStringNum}
            onChange = {handleChange}/>
        </Box>);
}

export default TextLabelStrNum;