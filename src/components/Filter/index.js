import React, { useEffect, useState } from 'react';
// import { withStyles } from '@mui/material/styles';
import styles from './style.js';
import { Formik, Form } from 'formik';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material';
const theme = createTheme({
    palette: {
        secondary: {
            light: "#F5B041",
            main: "#F39C12",
        }
    }
});

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 42,
      width: 250,
    },
  },
};

const Filter = (props) => {
    // const { classes } = props
    const [filter, setFilter] = useState({
        name: '',
        routeId: '',
        status: [],
    })
    const [timer, setTimer] = useState(false)
    const initialValues = {
        name: '',
        campaignID: '',
        status: 'all',
    }
    const handleFilterChange = (fieldName, fieldValue, values) => {
        let updatedValues = {
            ...values,
            [fieldName]: fieldValue
        }
        props.handleFilterChange(updatedValues)
    }

    const handleResetChange = (e, formik) => {
        setTimer(true)
        formik.handleReset(e)
        setTimeout(() => setTimer(false), 1000)
        props.handleResetChange();
    }

    useEffect(() => {
        try {
            setFilter({
                ...filter,
                status : ['Active','Inactive'],
            })

        } catch (err) {
            console.log(err)
        }
    }, [])

    return (
        <Formik
            initialValues={initialValues}
        >
            {formik => {
                console.log('Formik props', formik)

                return (
                    <Form>
                        <fieldset style={{ width: '100%',display: 'flex',flexDirection: 'row',flexWrap: 'wrap',marginBottom: '1.0rem', paddingBottom: '1.0rem', border: "0px none", borderTop: "1px solid #b7ede0" ,borderBottom: "1px solid #b7ede0", }}>
                            <legend style={{color: '#72C29B',fontWeight:'bold',fontSize:20}}>Campaign Filter</legend>
                        <div className="fieldContainer">
                            <div className="filterContainer">
                                <FilterListIcon className="filterIcon" />
                            </div>
                            <div className={"filterContainer"}>
                                <div className="filterHeader">Campaign ID</div>
                                <Input
                                    className="inputField"
                                    type="text"
                                    onChange={(e) => {
                                        formik.setFieldValue('campaignID', e.target.value)
                                        handleFilterChange('campaignID', e.target.value, formik.values)
                                    }}
                                    value={formik.values.routeId}
                                    placeholder="Campaign ID"
                                />

                            </div>
                            <div className="filterContainer">
                                <div className="filterHeader">Campaign Name</div>
                                <Input
                                    className="inputField"
                                    type="text"
                                    onChange={(e) => {
                                        formik.setFieldValue('name', e.target.value)
                                        handleFilterChange('name', e.target.value, formik.values)
                                    }}
                                    value={formik.values.name}
                                    placeholder="Enter Campaign Name"
                                />
                            </div>
                            
                            <div className="filterContainer">
                                <InputLabel id="demo-select-small-label">Status</InputLabel>
                                <Select className="inputSelect"
                                    variant="standard"
                                    value={formik.values.status}
                                    style={{ width: '200px' }}
                                    onChange={(e) => {
                                        formik.setFieldValue('status', e.target.value)
                                        handleFilterChange('status', e.target.value , formik.values)
                                    }}
                                >
                                    <MenuItem value={"all"}>All</MenuItem>
                                    {filter?.status.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </div>
                        
                            <div className="filterContainer">
                                <ThemeProvider theme={theme}>
                                    <Button variant="contained"
                                        color="secondary"
                                        className="resetButton"
                                        disabled={timer}
                                        style={{textTransform:'none', marginTop: '8px'}}
                                        onClick={(e) => {
                                            handleResetChange(e, formik)
                                        }}>Reset</Button>
                                </ThemeProvider>
                            </div>
                        </div>
                        </fieldset>
                    </Form>)
            }}
        </Formik>
    )

}

export default Filter;
