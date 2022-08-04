import * as d3 from 'd3';
import React ,{useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {changePapersSort} from "../redux/papersSortSlice"
import { changePapersKeyword } from '../redux/papersKeywordSlice';
import { changePapersDetail } from '../redux/papersDetailSlice'; 
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import LaunchIcon from '@mui/icons-material/Launch';
import PropTypes from 'prop-types';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

// async function papersFetch(doi) {
//     const encoded = encodeURIComponent(doi);
//     const response2 = await fetch(`/.netlify/functions/api/papers/${encoded}`);
//     const json_load2 = await response2.json();
//     return json_load2[0];
// } 

const columns = [
    { id: 'title', label: 'タイトル', numeric: false, disablePadding: true,minWidth: 200 },
    { id: 'authors', label: '著者', numeric: false, disablePadding: true,minWidth: 150 },
    { id: 'page', label: 'ページ数', minWidth: 150, numeric: true, disablePadding: false, format: (value) => value.toLocaleString('en-US')},
    { id: 'html_url', label: 'url', minWidth: 50}
  ];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.numeric ? 'right' : 'left'}
              padding={column.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function pageDescendingComparator(a, b, orderBy) {
    const a_page = a.end_page-a.start_page;
    const b_page = b.end_page-b.start_page;
    if (b_page < a_page) {
      return -1;
    }
    if (b_page > a_page) {
      return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    if(orderBy === 'page'){
        return order === 'desc'
            ? (a, b) => pageDescendingComparator(a, b, orderBy)
            : (a, b) => -pageDescendingComparator(a, b, orderBy);
    }else{
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const PapersView = () => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [papers,setPapers] = useState([])
    const papersSort = useSelector((state) => state.papersSort.element);
    const startYear = useSelector((state) => state.startYear.year);
    const endYear = useSelector((state) => state.endYear.year);
    const data = useSelector((state) => state.papersKeyword.papers);
    const papers2 = useSelector((state) => state.papersDetail.papers);
    useEffect(() => {
        (async () => {
            const response = await fetch("../../data/IEEE Communications Magazine/2021.json");
            const json_load = await response.json();
            setPapers(json_load.articles);
        })();
      }, []);
    //   useEffect(() => {
    //     let array = []
    //     data.map((item) => {
    //         const paper = papersFetch(item.doi);
    //         array.push(paper);
    //     }) ;
    //     dispatch(changePapersDetail(array))
    //   }, [data]);
    // console.log(papers2)
    
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        
      };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
      const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - papers.length) : 0;
    return (
        <div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                        {stableSort(papers, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((paper, index) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={paper.title}
                                    >
                                    {columns.map((column) => {
                                        let value;
                                        if(column.id === 'authors'){
                                            value = []
                                            for(let i = 0;i < paper[column.id][column.id].length;i++){
                                                if(i < 2){
                                                    value.push(paper[column.id][column.id][i].full_name+', ')
                                                }else{
                                                    value.push(paper[column.id][column.id][i].full_name)
                                                    break
                                                }
                                            }
                                    }else if(column.id === 'page'){
                                        value = paper.end_page-paper.start_page;
                                    }else{
                                        value = paper[column.id]
                                    }
                                    if(column.id === 'html_url'){
                                        return(
                                            <TableCell  key={column.id} align={column.align}>
                                                <a href={value} target='_blank'>
                                                    <LaunchIcon/>
                                                </a>
                                                
                                            </TableCell>
                                        )
                    
                                    }else {
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                            </TableCell>
                                            );
                                    }
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        <TablePagination
            rowsPerPageOptions={[50, 100,200]}
            component="div"
            count={papers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
    </div>
    );
}

export default PapersView;