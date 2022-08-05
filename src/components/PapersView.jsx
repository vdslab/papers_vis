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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LaunchIcon from '@mui/icons-material/Launch';
import PropTypes from 'prop-types';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { Link, Outlet } from "react-router-dom";

const columns = [
    { id: 'title', label: 'タイトル', align: 'left', disablePadding: false,minWidth: 300 },
    { id: 'year', label: '発行年', align: 'right', disablePadding: true,minWidth: 100 },
    { id: 'page', label: 'ページ数', minWidth: 150, align: 'right', disablePadding: false, },
    { id: 'citing_paper_count', label: '被引用数', minWidth: 150, align: 'right', disablePadding: false, },
    { id: 'citing_patent_count', label: '被特許数', minWidth: 150, align: 'right', disablePadding: false, },
    { id: 'html_url', label: 'url', minWidth: 30}
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

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('year');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(200);
    const keyword = useSelector((state) => state.keyword.keyword);
    const papers = useSelector((state) => state.papersKeyword.papers);
    
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
              <Toolbar sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }}}>
                <Typography sx={{ flex: '1 1 100%' }} align="justify" variant="h5" id="tableTitle" component="div">
                  {keyword}
                </Typography>
              </Toolbar>
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
                                        if(column.id == 'page'){
                                          value = Math.abs(paper[column.id])
                                        }else{
                                          value = paper[column.id]
                                        }
                                      if(column.id === 'html_url'){
                                        return(
                                            <TableCell  key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                <a href={value} target='_blank'>
                                                    <LaunchIcon/>
                                                </a>           
                                            </TableCell>
                                        )
                                      }else if(column.id === 'title'){
                                        return(
                                          <TableCell  key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                <nav>
                                                  <Link to="/network">{value}</Link>
                                                </nav>
                                                <Outlet />
                                          </TableCell>
                                        )
                                    }else{
                                        return (
                                            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
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