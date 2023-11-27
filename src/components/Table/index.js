import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'


export default function Tables(props) {
    const columns = props.columns
    const rowsPerPageOptions = [10, 20, 50]
    const pages = 'Campaign'
    const buttons = props.buttons
    const navigate = useNavigate();
    const [rows, setRows] = useState([])
    const [count, setCount] = useState(props?.rows?.length || 0)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = e => {
        setRowsPerPage(e.target.value);
        setPage(0);
    };



    const createOrder = (e) => {
        e.preventDefault()
        navigate("createCampaign")
    }
    useEffect(() => {
        debugger
        setRows(props?.rows)
        setCount(props?.rows?.length)
        setPage(0)
    }, [props?.rows])





    const deleteRow = async (e, id) => {
        e.preventDefault()
        debugger
        const localData = JSON.parse(localStorage.getItem('data'))
        const filterData = localData.filter(curr => curr.campaignID !== id)
        setRows(filterData);
        localStorage.setItem('data', JSON.stringify(filterData))
        navigate('/')
    }


    return (
        <>
            <Button style={{ margin: 10, textTransform: 'none' }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={false}
                onClick={createOrder}
            >
                Create {pages}
            </Button>

            <Paper>
                <TableContainer>
                    {rows && <TablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />}
                    <Table >
                        <TableHead >
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell
                                        key={column.id}
                                        align='center'
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.length > 0 ? (
                                rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, id) => {
                                    return (

                                        <TableRow key={id} hover >
                                            {['campaignID', 'name', 'status', 'startDate', 'endDate'].map((curr, index) =>{
                                                return <TableCell align='center' key={index}>{val[curr]}</TableCell>
                                               }
                                            )
                                            }
                                            {
                                                <TableCell style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    {
                                                        buttons?.map((button, index) => (
                                                            button?.id === 'edit' ?
                                                                <Link to={`./editCampaign/${val.campaignID}`} key={index}>
                                                                    <Tooltip title={button.label}>
                                                                        <EditIcon
                                                                            style={{ pointerEvents: 'cursor' }}
                                                                        />
                                                                    </Tooltip>

                                                                </Link>
                                                                :
                                                                button?.id === 'view' ?
                                                                    <Link to={`./viewCampaign/${val.campaignID}`} key={index}>
                                                                        <Tooltip title={button.label}>
                                                                            <RemoveRedEyeIcon
                                                                                style={{ pointerEvents: 'cursor' }}
                                                                            />
                                                                        </Tooltip>

                                                                    </Link>
                                                                    :
                                                                    <Tooltip title="Delete" key={index}>
                                                                        <DeleteOutlinedIcon
                                                                            style={{ pointerEvents: 'auto' }}
                                                                            onClick={(e) => deleteRow(e, val["campaignID"])}
                                                                        />
                                                                    </Tooltip>
                                                        ))
                                                    }
                                                </TableCell>


                                            }

                                        </TableRow>
                                    )
                                }))
                                :
                                <TableRow>
                                    <TableCell>No Data Found</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}

