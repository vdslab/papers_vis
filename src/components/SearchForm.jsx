import { Box, Grid,Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { useEffect,useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSearchForm } from "../redux/searchFormSlice";
import { changePapersKeyword } from "../redux/papersKeywordSlice";
import PapersView from './PapersView';
import { changeColumnsJudge } from "../redux/columnsSlice";
import { changeScrollJudge } from "../redux/scrollJudge";
import { changeTableDataJudge } from "../redux/tableDataJudge";

const SearchForm = () => {
    const dispatch = useDispatch();
    const search = useSelector((state) => state.searchForm.search);
    const papers = useSelector((state) => state.papersKeyword.papers);
    const startYear = useSelector((state) => state.startYear.year);
    const endYear = useSelector((state) => state.endYear.year);
    let [data, setData] = useState([]);
    const [author, setAuthor] = useState([]);
    const isFirstRender = useRef(true);
    const isFirstRenderAuthor = useRef(true);
    const [enterJudge,setEnterJudge] = useState(false);
    const [input,setInput] = useState();
    
    useEffect(() => {
        if(isFirstRender.current) { // 初回レンダー判定
            isFirstRender.current = false // もう初回レンダーじゃないよ代入
          } else {
            if(search !== '' && search !== undefined){
                (async () => {
                    const spl = search.split(' ');
                    while(spl.length <= 4){
                        spl.push(' ');
                    }
                    const sql = []
                    
                    //ローカル用
                    // spl.map ((item) => {
                    //         const abstract = encodeURIComponent('%'+item+'%');
                    //         sql.push(abstract)
                    //     })
                    // console.log(spl);
                    // const response = await fetch(`/.netlify/functions/api/papers/${sql[0]}/${sql[1]}/${sql[2]}/${startYear}/${endYear}`)
                    // const data = await response.json();

                    //本番用
                    spl.map ((item) => {
                        const abstract = '%'+item+'%';
                        sql.push(abstract)
                    })
                    const url = `/.netlify/functions/api/papers/${sql[0]}/${sql[1]}/${sql[2]}/${startYear}/${endYear}`
                    const response = await fetch(encodeURI(encodeURI(url)))
                    const data = await response.json();
                    
                    setData(data); 
                    dispatch(changePapersKeyword(data));
                    dispatch(changeTableDataJudge(true));
                })();     
            }else{
                (async () => {
                    //ローカル用
                    // const blank = encodeURIComponent('% %');
                    // const response = await fetch(`/.netlify/functions/api/papers/${blank}/${startYear}/${endYear}`)

                    //本番用
                    const blank = '% %';
                    const url = `/.netlify/functions/api/papers/${blank}/${startYear}/${endYear}`;
                    const response = await fetch(encodeURI(encodeURI(url)));

                    const data = await response.json();
                    setData(data); 
                    dispatch(changePapersKeyword(data));
                    dispatch(changeTableDataJudge(true));
                })();
            }
        }
    }, [enterJudge,startYear,endYear]);
    const array = [];
    // useEffect(() => {
    //     if(isFirstRenderAuthor.current) { // 初回レンダー判定
    //         isFirstRenderAuthor.current = false // もう初回レンダーじゃないよ代入
    //       } else {  
    //         data.map((item) => {
    //             (async () => {
    //                 let obj = item;
    //                 const doi = encodeURIComponent(item.doi);
    //                 const response2 = await fetch(`/.netlify/functions/api/authors/${doi}`)
    //                 const authors = await response2.json();
    //                 console.log(authors)
    //                 // obj.authors = authors;
    //                 // array.push(obj);
    //             })();
    //         })                   
    //     }
    // },[data])
    // author.map((auth) => {
    //     data.push(auth);
    // })
    console.log(data);
    const changeHandle = (e) => {
        dispatch(changeSearchForm(e.target.value));
        if(enterJudge){
            setEnterJudge(false);
            dispatch(changeColumnsJudge('search'));
            dispatch(changeScrollJudge(true));
            dispatch(changeTableDataJudge(false));
        }else{
            setEnterJudge(true);
            dispatch(changeColumnsJudge('search'));
            dispatch(changeScrollJudge(true));
            dispatch(changeTableDataJudge(false));
        }
        
    }

    const changeButtonHandle = (e) => {
        dispatch(changeSearchForm(input));
        console.log(input);
        if(enterJudge){
            setEnterJudge(false);
            dispatch(changeColumnsJudge('search'));
            dispatch(changeScrollJudge(true));
            dispatch(changeTableDataJudge(false));
        }else{
            setEnterJudge(true);
            dispatch(changeColumnsJudge('search'));
            dispatch(changeScrollJudge(true));
            dispatch(changeTableDataJudge(false));
        }
    }
    console.log(search)
    return(
    <div>
        <Box sx={{ ml: '67.5px',mt:'50px',mb:'50px' }}>
        <Grid container sx={{  width: '100%',height: 30 }} >
            <Grid item xs={10}>
                <TextField fullWidth id="fullWidth" label="論文検索" variant="outlined" placeholder="英語で入力をしてください"
                InputProps={{startAdornment:<InputAdornment position="start"><SearchIcon/></InputAdornment>}}
                onKeyDown={e => {
                    if (e.keyCode === 13) {
                        changeHandle(e)
                    }
                  }}
                onChange={(event) => setInput(event.target.value)}
                />
            </Grid>
            <Grid item xs={1}>
            <Button variant="contained" sx={{ width: '123.5%', height: 56 }} onClick={e => {changeButtonHandle(e)}}>検索</Button>
            </Grid>
        </Grid>  
        </Box>
    </div>
    )
}

export default SearchForm;

