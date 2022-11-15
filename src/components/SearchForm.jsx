import { Box, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { useEffect,useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSearchForm } from "../redux/searchFormSlice";
import { changePapersKeyword } from "../redux/papersKeywordSlice";
import PapersView from './PapersView';
import { changeColumnsJudge } from "../redux/columnsSlice";

const SearchForm = () => {
    const dispatch = useDispatch();
    const search = useSelector((state) => state.searchForm.search);
    const papers = useSelector((state) => state.papersKeyword.papers);
    const [data, setData] = useState([]);
    const [author, setAuthor] = useState([]);
    const isFirstRender = useRef(true);
    const isFirstRenderAuthor = useRef(true);
    const [enterJudge,setEnterJudge] = useState(false);
    
    useEffect(() => {
        if(isFirstRender.current) { // 初回レンダー判定
            isFirstRender.current = false // もう初回レンダーじゃないよ代入
          } else {      
            (async () => {
                const spl = search.split(' ');
                const abstract = encodeURIComponent('%' + search + '%');
                //const js = '';
                const response = await fetch(`/.netlify/functions/api/papers/${abstract}`);
                const data = await response.json();
                //dispatch(changePapersKeyword(data));
                // const name = encodeURIComponent(search);
                // const response2 = await fetch(`/.netlify/functions/api/authors/${name}`);
                // const authors = await response2.json();
                // let authors_array = [];
                // authors.map((author) => {
                //     (async () => {
                //         const doi = encodeURIComponent(author.doi);
                //         const response = await fetch(`/.netlify/functions/api/papers/${doi}`);
                //         const data2 = await response.json();
                //         authors_array.push(data2[0]);               
                //     })(); 
                // })        
                // setAuthor(authors_array) 
                // setData(data); 
                dispatch(changePapersKeyword(data));
                dispatch(changeColumnsJudge('search'));
            })();
        }
    }, [enterJudge]);
    // author.map((auth) => {
    //     data.push(auth);
    // })
    console.log(data);
    console.log(author);
    const changeHandle = (e) => {
        dispatch(changeSearchForm(e.target.value));
        if(enterJudge){
            setEnterJudge(false);
        }else{
            setEnterJudge(true);
        }
        
    }
    console.log(search)
    return(
    <div>
        <Box sx={{ margin: '70px' }}>
            <Box sx={{ width: '100%', height: 30 }}>
                <TextField fullWidth id="fullWidth" label="論文検索" variant="outlined"
                InputProps={{startAdornment:<InputAdornment position="start"><SearchIcon/></InputAdornment>}}
                onKeyDown={e => {
                    if (e.keyCode === 13) {
                        changeHandle(e)
                    }
                  }}
                />
            </Box>
        </Box>
    </div>
    )
}

export default SearchForm;

