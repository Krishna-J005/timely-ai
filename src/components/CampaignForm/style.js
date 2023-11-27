import styled from "styled-components"
import * as Yup from 'yup'

export const Campaign_Properties = [{
    label: 'Campaign Name',
    type: 'text',
    html: 'input',
    placeholder: 'Enter name',
    key: 'name',
    validation: ['required']
}, {
    label: 'Status',
    type: 'select',
    html: 'input',
    key: 'status',
    validation: ['required']
}, {
    label: 'City',
    type: 'select',
    html: 'input',
    key: 'city',
    validation: ['required']
}, {
    label: 'Campaign Image URL',
    type: 'text',
    html: 'input',
    placeholder: 'Enter Campaign Image Url',
    key: 'imageUrl',
    validation: ['required']
}, {
    label: 'Campaign Video',
    type: 'text',
    html: 'input',
    placeholder: 'Enter Campaign Video Url',
    key: 'videoUrl',
    validation: ['']
}, {
    label: 'Start Date',
    type: 'Date',
    html: 'date',
    key: 'startDate',
    validation: ['required']
}, {
    label: 'End Date',
    type: 'Date',
    html: 'date',
    key: 'endDate',
    validation: ['required']
},{
    label: 'Target Audience',
    type: 'subChildren',
    html: 'input',
    key: 'audience',
    validation: ['required'],
    children: [{
        label: 'Gender',
        type: 'select',
        html: 'input',
        key: 'gender',
        validation: ['required']
    },{
        label: 'Minimum Age',
        type: 'number',
        html: 'input',
        key: 'minAge',
        validation: ['required']
    },{
        label: 'Max Age',
        type: 'number',
        html: 'input',
        key: 'maxAge',
        validation: ['required']
    }]
},{
    label: 'Channel',
    type: 'subChildren',
    html: 'input',
    key: 'channel',
    validation: ['required'],
    children: [{
        label: 'Source',
        type: 'select',
        html: 'input',
        key: 'src',
        validation: ['required']
    },{
        label: 'Message',
        type: 'text',
        html: 'input',
        key: 'message',
        validation: ['required']
    }]
},{
  label: 'Product List',
  type: 'subChildren',
  html: 'input',
  key: 'productList',
  validation: ['required'],
  children: [{
    label: 'Product ID',
    type: 'text',
    html: 'input',
    key: 'productID',
    validation: ['required']
  }, {
    label: 'Product Name',
    type: 'text',
    html: 'input',
    key: 'name',
    validation: ['required']
  }, {
    label: 'Product Image',
    type: 'text',
    html: 'input',
    key: 'productImg',
    validation: ['']
  }, {
    label: 'Product Url',
    type: 'text',
    html: 'input',
    key: 'productUrl',
    validation: ['']
  },{
    label: 'Discount %',
    type: 'number',
    html: 'input',
    key: 'discount',
    validation: ['required']
  }]
}]

export const FlexContainer = styled.div`
   display:flex;
   flex-wrap: wrap;
`
export const FieldHeader = styled.div`
   
    padding: 0px 10px;
    font-size: 20px;
    margin-top: 10px;
    font-weight: bold;
`


export const FormLabel = styled.label`
    width: 100%;
    margin-bottom: 5px;
    font-size: 0.8rem;
    color: #666;
    font-weight: bold;
    text-align: left;
    ${props => {
        if (props.required) return `
      ::after {
        content: "*";
        color: red;
        font-size: 12px;}
      `
    }}
`
export const SingleSelect =styled.select`
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 16px;
      width: 250px;
      height: 56px;
      &:invalid {
        color: #666666;
      }
      option:first-child{
        color: #cccccc;
      }
      option:not(:first-child){
        color: black;
        background: white;
      }
`   
export const FormGroup = styled.div`
  display:flex;
  flex-direction:column;
  margin:10px 16px;
`
export const FlexRowContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`
export const FormInput = styled.input.attrs(props => ({
    type: props.type,
    size: props.medium ? 8 : undefined,
    min: props.type === 'number' ? 0 : undefined
}))`
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    padding: 0px 8px;
    width: 250px;
    height: 56px;
    border: 1px solid rgb(204, 204, 204);
    display: block;
    ::placeholder {
      color: rgb(204, 204, 204);
    }
  `

export const validationSchema = () => {
    let validate = {};
    const validateAll = {}
    Object.keys(CampaignPropertiesSet).forEach((val) => {
        CampaignPropertiesSet[val].forEach(item => {
            if (item.type === 'number' && item.key === 'mobile' && item.validation.includes('required')) {
                validate[item.key] = Yup.string().matches(/^[6-9][0-9]{9}$/, 'Phone number is not valid').required('Required')
            }
            else if ((item.type === 'text' || item.type ==='select') && item.validation.includes('required')) {
                validate[item.key] = Yup.string().trim().nullable(true).required('Required')
            }
            else if (item.type === 'Date'  && item.validation.includes('required') && item.key ==='startDate') {
              validate[item.key] = Yup.date().nullable(true).required('Required')
            }
            else if (item.type === 'Date'  && item.validation.includes('required') && item.key !=='startDate') {
              validate[item.key] = Yup.date().nullable(true).required('Required').min(Yup.ref('startDate'), "End date can't be less than start Date")
            }
            else if(item.type === 'subChildren' && item.key == 'audience' && item.validation.includes('required')){
                validate[item.key] = Yup.lazy(val => Yup.array()
                          .of(
                            Yup.object().shape({
                              gender: Yup.string().trim().nullable(false).required('Required'),
                              minAge: Yup.number().required('Required').nullable(false),
                              maxAge: Yup.number().required('Required').nullable(false).min(Yup.ref('minAge'), 'Max Age must be greater than Min Age'),
                            }))
                )
            }
            else if(item.type === 'subChildren' && item.key == 'channel' && item.validation.includes('required')){
                validate[item.key] = Yup.lazy(val => Yup.array()
                          .of(
                            Yup.object().shape({
                              src: Yup.string().trim().nullable(false).required('Required'),
                              message: Yup.string().trim().nullable(false).required('Required'),
                              
                          })
                ))
            }
            else if(item.type === 'subChildren' && item.validation.includes('required')){
                validate[item.key] = Yup.lazy(val => Yup.array()
                          .of(
                            Yup.object().shape({
                              productID: Yup.string().trim().nullable(false).required('Required'),
                              name: Yup.string().trim().nullable(false).required('Required'),
                              discount:  Yup.number().required('Required').min(0, 'Must be a positive number'),
                              
                          })
                ))
            }
        })
        validateAll[val] = Yup.object(validate)
        validate = {}
    })
    return validateAll
}

export const CampaignPropertiesMap = {
    campaign: 'Campaign Details'
}

export const CampaignPropertiesSet = {
    campaign: Campaign_Properties
}

export const validationCheck = validationSchema();