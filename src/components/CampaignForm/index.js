import {
    CampaignPropertiesMap, validationCheck, CampaignPropertiesSet, FieldHeader, FlexContainer, FormGroup, FormLabel,
    FlexRowContainer, FormInput, SingleSelect,
} from './style'
import { Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutline';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import 'dayjs/locale/en-gb';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
    Formik,
    Form,
    FieldArray,
} from 'formik'
import Button from '@mui/material/Button';
import { useState, useEffect, useCallback } from 'react';

const getCampaignValue = () => {
    const storyVal = {}
    Object.keys(CampaignPropertiesSet).map((val) => {
        storyVal[val] = {}
        CampaignPropertiesSet[val].forEach(item => prepareData(item, val, storyVal))
    })
    return storyVal;
}
const prepareData = (item, val, offerVal) => {
    if (!offerVal[val]) offerVal[val] = {}
    else if (item.type === 'subChildren' && item.key == 'productList') return offerVal[val][item.key] = [
        {
            productID: '',
            productImg: '',
            productUrl: '',
            name: '',
            discount: ''
        }
    ];
    else if (item.type === 'subChildren' && item.key == 'audience') return offerVal[val][item.key] = [
        {
            gender: '',
            minAge: '',
            maxAge: '',
        }
    ];
    else if (item.type === 'subChildren' && item.key == 'channel') return offerVal[val][item.key] = [
        {
            src: '',
            message: '',
        }
    ];
    else if (item.type === 'number') return offerVal[val][item.key] = '';
    else if (item.type === 'Date') return offerVal[val][item.key] = null;
    else return offerVal[val][item.key] = ''
}

const CampaignForm = (props) => {
    const cityList = ['New Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Noida', 'Gurugram', 'Kolkata', 'Bhubaneshwar'];
    const channelList = ['Email', 'Social Media' , 'Website']
    const param = useParams()
    const navigate = useNavigate()
    // console.log(param,props,"ppppppppppppp")
    const [formValues, setFormValues] = useState(null)
    const [validatedAll, setValidatedAll] = useState(null)
    // const [options, setOptions] = useState([])
    const [pending, setPending] = useState(true);
    const [data,setData] = useState([])
    const validationSchemaCheck = useCallback(() => {
        return (setValidatedAll({ ...validationCheck }))
    }, [])



    useEffect(() => {
        validationSchemaCheck()
    }, [])

    useEffect(() => {
        const localData = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')): [];
        console.log(localData)
        setData(localData)
        if (!formValues && !props.editData) {
            setFormValues(getCampaignValue())
            validationSchemaCheck()
        }
        else if (!formValues && props.editData) {
            
            const val = localData.filter((curr,ind) =>{
                return curr.campaignID === param.campaignID
             })
            const campaign = {...val[0]}

            setFormValues({ ...formValues, campaign })
            validationSchemaCheck()
        }
        setPending(false)
    }, [])

    

    const getDerivedHtml = (item, itemName, index, formObj) => {
        let name = '', values = '', error = '', showError = ''
        return (
            <div style={{ width: "100%" }} key={index}>
                <FieldHeader style={{ width: '100%' }}>{item.label}</FieldHeader>
                <FieldArray name='subComponent' render={arrayhelpers => (
                    formObj?.values?.[itemName]?.[item['key']] ?
                        formObj?.values?.[itemName]?.[item['key']].map((val, ind) => {
                            return (
                                <FlexRowContainer key={ind}>{
                                    item.children.map((child, i) => {
                                        name = `${itemName}.${item['key']}[${ind}][${child.key}]`
                                        error = formObj?.errors[itemName]?.[item.key]?.[ind]?.[child.key]
                                        values = formObj.values[itemName]?.[item.key]?.[ind]?.[child.key]
                                        showError = error?.length > 0 && formObj.touched?.[itemName]?.[item.key]?.[ind]?.[child.key]
                                        return (
                                            <Fragment key={i}>
                                                <FormGroup>
                                                    <FormLabel required={item.validation[0] === 'required'}>{child.label}{child.validation[0] === 'required' && ' *'}</FormLabel>
                                                        {
                                                            child.type !== 'select'?

                                                            <FormInput type={child.type} medium name={name}
                                                                value={values}
                                                                onBlur={(e) =>{
                                                                    if(item.type === 'text') formObj.setFieldValue(name, e.target.value.trim()) 
                                                                    formObj.handleBlur(e)}
                                                                }
                                                                onChange={(e) => {
                                                                    formObj.setFieldValue(e.target.name, e.target.value)
                                                                }}>
                                                            </FormInput>
                                                            :
                                                            <SingleSelect
                                                                name={name}
                                                                value={values}
                                                                onChange={e => {
                                                                    formObj.setFieldValue(e.target.name, e.target.value)
                                                                }
                                                                }
                                                                onBlur={(e) => { 
                                                                    formObj.handleBlur(e) }
                                                                }
                                                                key={i}
                                                                id={`select_${child.key}`}
                                                                required
                                                            >
                                                                <option value="" disabled >Select {child.label}</option>
                                                                {child.key === 'gender' ?
                                                                    <>
                                                                        <option value={'Male'}>Male</option>
                                                                        <option value={'Female'}>Female</option>
                                                                        <option value={'Others'}>Others</option>
                                                                    </>
                                                                    :
                                                                    <>
                                                                    {
                                                                        channelList.map((val,id) =>{
                                                                            return <option value={val} key={id}>{val}</option>
                                                                        })
                                                                    }
                                                                    </>

                                                                }
                                                            </SingleSelect>
                                                        }
                                                        {showError && (<div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>)}
                                                    </FormGroup>
                                                {item.children.length - 1 === i && formObj.values[itemName]?.[item.key].length > 1 && <DeleteOutlineIcon style={{ cursor: 'pointer', color: 'red', marginTop: '2.8rem' }} onClick={(e) => deleteListRow(e, item, itemName, formObj, ind)} />
                                            }
                                        </Fragment>)
                                    })

                                }
                            </FlexRowContainer>)
                            }) : null)
                    }
                    />
                    <Button variant="outlined" color="secondary" onClick={(e) => { addInfo(e, item, itemName, formObj) }}
                        style={{ margin: '10px', padding: '8px 12px', width: '200px', textTransform: 'none' }}>
                        Add {item.key === 'productList' ? 'Products' : item.key }
                    </Button>
                </div>
        )
    }



    const addInfo = (e, item, itemName, formObj) => {
        if(item.key == 'audience'){
            formObj.values?.[itemName]?.[item['key']]?.push({
                gender: '',
                minAge: 16,
                maxAge: 40,
            })
        }
        else if(item.key == 'channel'){
            formObj.values?.[itemName]?.[item['key']]?.push({
                src: '',
                message: '',  
            })
        } 
        else{
            formObj.values?.[itemName]?.[item['key']]?.push({
                productID: '',
                name: '',
                discount: 0,
                productImg: '',
                productUrl: '',
            })
        }
        setFormValues({ ...formObj?.values })
    }

    const deleteListRow = (e, item, itemName, formObj, ind) => {
        e.preventDefault();
        formObj?.values?.[itemName]?.[item.key].splice(ind, 1);
        setFormValues({ ...formObj?.values })

    }

    const getDerivedInputHtml = (item, itemName, index, formObj) => {
        let name = `${itemName}.${item.key}`
        let values = `${formObj.values?.[itemName]?.[item.key]}`
        let error = formObj.errors?.[itemName]?.[item['key']]
        let showError = error && (error === 'Required' || error.length > 0) && formObj.touched?.[itemName]?.[item['key']]

        return (
            <FormGroup key={index}>
                <FormLabel required={item.validation[0] === 'required'}>{item.label} {item.validation[0] === 'required' && ' *'}</FormLabel>
                <FormInput type={item.type} medium name={name}
                    value={values}
                    disabled={props.editData && item.key === 'CampaignId'}
                    onBlur={(e) =>{ 
                        if(item.type === 'text') formObj.setFieldValue(name, e.target.value.trim()) 
                        formObj.handleBlur(e)
                    }}
                    onChange={(e) => formObj.setFieldValue(name, e.target.value)}
                ></FormInput>
                {showError && (<div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>)}
            </FormGroup>
        )
    }

    const handleSubmit = async (e, formObj, formik) => {
        formik.validateForm().then(err => {
            if (Object.keys(err)?.length > 0 && Object.keys(err?.campaign)?.length > 0) {
                formik.setTouched({ ...formik.touched, ...err });
                return;
            } else {
                createCampaign(e, formObj, formik)
            }
        })
    }

    const handleCancel = async (e, formObj, formik) => {
        e.preventDefault();
        navigate('/')
    }
    const createCampaign = async (e, formObj, formik) => {
        e.preventDefault();
        setPending(true)
        let payload = { ...formObj.campaign }

        console.log(payload)
        if (props.editData) {
            try {
                const filterData = data.filter(curr => curr.CampaignId !== param.CampaignId)
                setData([...filterData,payload])
                localStorage.setItem('data',JSON.stringify([...filterData,payload]));
                setFormValues({ ...formObj })
                // setPending(false)
                navigate('/')
            }
            catch (err) {
                console.log("erroMessage", err)
                
            }
            finally{
               setPending(false);
            }
        }
        else {
            try {
                payload.campaignID = 'CMP_'+ (localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data'))?.length+1: 1);
                setData([...data,payload])
                localStorage.setItem('data',JSON.stringify([...data,payload]));
                console.log("HandleSubmit response")
                navigate('/')
                setPending(false);
            }
            catch (err) {
                console.log("erroMessage", err)
                setPending(false);
            }
        }
    }

    const getDerivedSelectHtml = (item, itemName, index, formObj) => {
        let name = `${itemName}.${item.key}`
        let values = formObj?.values?.[itemName]?.[item['key']]
        let error = formObj?.errors?.[itemName]?.[item.key]
        let showError = error && error.length > 0 && formObj.touched?.[itemName]?.[item['key']]

        return (
            <FormGroup key={index}>
                <FormLabel required={item.validation[0] === 'required'}>{item.label} {item.validation[0] === 'required' && ' *'}</FormLabel>
                <SingleSelect
                    name={name}
                    value={values}
                    onChange={(e, value) => {
                        formObj.setFieldValue(name, e.target.value)
                    }
                    }
                    onBlur={(e) => { formObj.handleBlur(e) }}
                    key={index}
                    id={`select_${item.key}`}
                    required
                >
                    <option value="" disabled >Select {item.label}</option>
                    {item.key === 'status' ?
                        <>
                            <option value={'Active'}>Active</option>
                            <option value={'Inactive'}>Inactive</option>
                        </>
                        :
                        <>
                        {
                            cityList.map((val,id) =>{
                                return <option value={val} key={id}>{val}</option>
                            })
                        }
                        </>

                    }
                </SingleSelect>
                {showError && (<div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>)}
            </FormGroup>
        )
    }

    const getDerivedDateHtml = (item, itemName, index, formObj) => {
        let name = `${itemName}.${item.key}`
        let values = formObj?.values?.[itemName]?.[item['key']]
        let error = formObj?.errors?.[itemName]?.[item.key]
        let showError = error && error.length > 0;
        return (
            <FormGroup key={index}>
                <FormLabel required={item.validation[0] === 'required'}>{item.label}{item.validation[0] === 'required' && ' *'}</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        width="250px"
                        value={values}
                        onChange={(e, value) => {
                            formObj.setFieldValue(name, e)
                        }
                        }
                        onBlur={(e) => { formObj.handleBlur(e) }}
                        key={index}
                        renderInput={(params) => (
                        <TextField {...params} />
                        )}
                        format="DD/MM/YYYY"
                        id={`date${item.key}`}
                    />
                        
                    
                </LocalizationProvider>
                {showError && (<div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>)}
            </FormGroup>
        )
    }

    const createFormHtml = (item, index, formik, itemName) => {
        if (item.type === 'text' || item.type === 'number')
            return getDerivedInputHtml(item, itemName, index, formik)
        else if (item.type === 'select')
            return getDerivedSelectHtml(item, itemName, index, formik)
        else if (item.type === 'Date')
            return getDerivedDateHtml(item, itemName, index, formik)
        else if (item.type === 'subChildren')
            return getDerivedHtml(item, itemName, index, formik)
    }
    return (
        <div style={{width: '96%', margin:'0 auto'}}>
            {
                !pending ?
                    <Formik
                        initialValues={formValues || getCampaignValue()}
                        validationSchema={Yup.object(validatedAll)}
                        enableReinitialize
                    >
                        {
                            formik => {
                                console.log("Formik", formik)
                                return (
                                    <Form>
                                        {Object.keys(CampaignPropertiesSet).map((item, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    <FieldHeader>{CampaignPropertiesMap[item]}</FieldHeader>
                                                    <FlexContainer key={`coupon${index}`}>
                                                        {
                                                            CampaignPropertiesSet[item].map((items, ind) => {
                                                                return createFormHtml(items, ind, formik, item)
                                                            })
                                                        }
                                                    </FlexContainer>
                                                </Fragment>
                                            )
                                        })
                                        }
                                        {(<>
                                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                {/* {(Object.keys(formik.errors).length > 0 && Object.keys(formik.touched).length > 0) && <div style={{ color: 'red', margin: '.5rem', fontWeight: 'bold' }}>Required field are Missing</div>} */}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                <Button
                                                
                                                    color="error"
                                                    variant="outlined"
                                                    style={{ margin: '10px', padding: '10px 15px', width: '15%', textTransform:'none' }}
                                                    onClick={(e) => { handleCancel(e, formik.values, formik) }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    variant="contained"
                                                    style={{ margin: '10px', padding: '10px 15px', width: '15%', textTransform:'none' }}
                                                    onClick={(e) => { handleSubmit(e, formik.values, formik) }}
                                                >
                                                    Submit
                                                </Button>
                                            </div> 
                                        </>)}
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                    : null
            }
        </div>
    )
}

export default CampaignForm;