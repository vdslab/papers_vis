import * as d3 from "d3";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePapersSort } from "../redux/papersSortSlice";
import { changePapersKeyword } from "../redux/papersKeywordSlice";
import { changePapersDetail } from "../redux/papersDetailSlice";
import { changeColumnsJudge } from "../redux/columnsSlice";
import { Card, Tooltip, Box, Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LaunchIcon from "@mui/icons-material/Launch";
import PropTypes from "prop-types";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { Link, Outlet } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const PapersView = () => {
  const dispatch = useDispatch();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("year");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(200);
  const [columns, setColumns] = useState([]);
  const keyword = useSelector((state) => state.novisKeyword.keyword);
  const papers = useSelector((state) => state.papersKeyword.papers);
  const columnsJudge = useSelector((state) => state.columnsJudge.judge);
  const search = useSelector((state) => state.searchForm.search);
  const tableDataJudge = useSelector((state) => state.tableDataJudge.judge);
  useEffect(() => {
    if (columnsJudge == "search") {
      const col = [
        {
          id: "title",
          label: "タイトル",
          numeric: false,
          align: "left",
          disablePadding: false,
          minWidth: 300,
        },
        {
          id: "authors",
          label: "著者",
          numeric: false,
          align: "left",
          disablePadding: false,
          minWidth: 150,
        },
        {
          id: "publication_year",
          label: "発行年",
          numeric: true,
          align: "right",
          disablePadding: true,
          minWidth: 100,
        },
        {
          id: "page",
          label: "ページ数",
          numeric: true,
          align: "right",
          disablePadding: true,
          minWidth: 120,
        },
        {
          id: "citing_paper_count",
          label: "被引用数",
          numeric: true,
          align: "right",
          disablePadding: true,
          minWidth: 120,
        },
        { id: "html_url", label: "url", minWidth: 30 },
      ];
      setColumns(col);
    } else {
      const col = [
        {
          id: "title",
          label: "タイトル",
          numeric: false,
          align: "left",
          disablePadding: false,
          minWidth: 300,
        },
        {
          id: "year",
          label: "発行年",
          numeric: true,
          align: "right",
          disablePadding: true,
          minWidth: 100,
        },
        {
          id: "page",
          label: "ページ数",
          numeric: true,
          align: "right",
          disablePadding: true,
          minWidth: 120,
        },
        {
          id: "citing_paper_count",
          label: "被引用数",
          numeric: true,
          align: "right",
          disablePadding: true,
          minWidth: 120,
        },
        {
          id: "value",
          label: "キーワード重要度",
          numeric: true,
          align: "right",
          disablePadding: true,
          minWidth: 150,
        },
        { id: "url", label: "url", minWidth: 30 },
      ];
      setColumns(col);
    }
  }, [columnsJudge]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - papers.length) : 0;
  useEffect(() => {
    console.log(columns);
  });
  const escapeDoi = (doi) => {
    return doi.replaceAll(".", "_").replaceAll("/", "-");
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
              align={column.numeric ? "right" : "left"}
              padding={column.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
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
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
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
    return order === "desc"
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
  return (
    <div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          {columnsJudge == "keyword" ? (
            keyword == "" ? (
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="justify"
                variant="subtitle1"
                component="div"
              >
                検索を行うかキーワードを選択すると論文が表示されます
              </Typography>
            ) : (
              <Typography
                sx={{ flex: "1 1 100%" }}
                align="justify"
                variant="h5"
                id="tableTitle"
                component="div"
              >
                選択されたキーワード：{keyword}
              </Typography>
            )
          ) : search == "" ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="justify"
              variant="subtitle1"
              component="div"
            >
              検索を行うかキーワードを選択すると論文が表示されます
            </Typography>
          ) : (
            <Typography
              sx={{ flex: "1 1 100%" }}
              align="justify"
              variant="h5"
              id="tableTitle"
              component="div"
            >
              入力されたキーワード：{search}
            </Typography>
          )}
        </Toolbar>

        <TableContainer sx={{ maxHeight: 600 }}>
          {!tableDataJudge ? (
            <div>
              <Table stickyHeader aria-label="sticky table">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
              </Table>
              <Card sx={{ Width: "100%", height: "100%" }}>
                {/* <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} sx={{my:5 }}> 
                          <Skeleton sx={{ width: "100%",height: 400 }} animation="wave" variant="rectangular" />
                        </Box>                   */}
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  sx={{ my: 3, height: 350.5 }}
                >
                  <ThreeDots
                    height="100"
                    width="100"
                    radius="30"
                    color="#4fa94d"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </Box>
              </Card>
            </div>
          ) : (
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
                      <TableRow hover tabIndex={-1} key={paper.title}>
                        {columns.map((column) => {
                          let value;
                          if (column.id == "page") {
                            value = Math.abs(paper[column.id]);
                          } else {
                            value = paper[column.id];
                            //console.log(paper.doi)
                            // console.log(column)
                          }
                          if (column.label === "url") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                <a href={value} target="_blank">
                                  <LaunchIcon />
                                </a>
                              </TableCell>
                            );
                          } else if (column.id === "title") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                <nav>
                                  <Link
                                    to={`/novis/network/${escapeDoi(
                                      paper.doi
                                    )}`}
                                  >
                                    {value}
                                  </Link>
                                </nav>
                                <Outlet />
                              </TableCell>
                            );
                          } else if (column.id == "authors") {
                            let authors;
                            if (value == null) {
                              authors = ["不明"];
                            } else {
                              authors = value.split(",");
                            }
                            let i = 0;

                            if (authors.length > 2) {
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {authors[0]}, {authors[1]} など
                                </TableCell>
                              );
                            } else {
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {authors[0]}
                                </TableCell>
                              );
                            }
                            // return(
                            //   <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth}}>
                            //       {authors[0]}
                            //   </TableCell>
                            // )
                          } else if (column.id == "value") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{
                                  minWidth: column.minWidth,
                                  textAlign: "right",
                                }}
                              >
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : Math.round(value * 10000) / 10000}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{
                                  minWidth: column.minWidth,
                                  textAlign: "center",
                                }}
                              >
                                {column.format && typeof value === "number"
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
          )}
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[50, 100, 200]}
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
};

export default PapersView;
