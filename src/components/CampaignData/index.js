import React, { Fragment, useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';

import { Grid, Typography, List, Card, CardContent, Container, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
const theme = createTheme({
  spacing: 4, // Change this value to modify the default spacing
});
const CampaignData = () => {
  const param = useParams()
  const [data, setData] = useState({});
  const [prepareData, setPreparedData] = useState({})
  const [audience, setAudience] = useState({})
  const [channelList, setChannelList] = useState([])
  const navigate = useNavigate();
  useEffect(() =>{
    const localData = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')): [];
    let value = localData.filter(curr => curr.campaignID == param.campaignID)
    debugger
    const {audience, productList, channel, ...rest} = value?.[0];
    console.log(value,localData)
    debugger
    setData(value?.[0])
    setChannelList(channel)
    setPreparedData(rest)
    setAudience(audience?.[0])
    

    console.log('')
  }, [])
  const keyMap = {
    name: 'Name',
    status: 'Status',
    campaignID : 'Campaign ID',
    startDate: 'Start Date',
    endDate : 'Start Date',
    imageUrl: 'Image src',
    videoUrl: 'Video src',
    gender: 'Gender',
    city: 'City',
    minAge: 'Minimum Age',
    maxAge: 'Maximum Age',
    src: 'Source',
    message: 'Message',
    productID : 'Product ID',
    productUrl: 'Product Link',
    productImg: 'Product Image src',
    discount: 'Discount(%)'
  }
  
  const goToHomePage = async (e, formObj, formik) => {
    e.preventDefault();
    navigate('/')
  }

    return(
      <Container maxWidth="md" style={{ marginTop: '10px' }}>
        <Button
          color="primary"
          variant="contained"
          style={{ margin: '10px 0', padding: '10px 15px', width: '200px', textTransform:'none' }}
          onClick={(e) => { goToHomePage(e) }}
        >                                      
          View All Campaign                                   
        </Button>
        <ThemeProvider theme={theme}>
          <Card style={{backgroundColor: "#f2f3f5"}} variant="outlined">
            <CardContent>
              <Typography variant="h5" align="left" style={{ marginTop: '10px' }}>
                Campaign Details
              </Typography>
              <Grid container spacing={2}>
                { Object.keys(prepareData).map((curr, ind) => {
                    return(
                      <Fragment key={ind}>
                        <Grid item xs={4}>
                          <Typography variant="h6" align="right">{keyMap[curr]}</Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography variant="h6" align="left">{['startDate', 'endDate'].includes(curr) ? prepareData?.[curr].substring(0,10) :prepareData?.[curr]}</Typography>
                        </Grid>
                      </Fragment>
                    )
                  })
                }
              </Grid>
              
              <Typography variant="h5" align="left" style={{ marginTop: '10px' }}>
                Audience
              </Typography>
              <Grid container spacing={2}>
                { Object.keys(audience).map((curr, ind) => {
                    return(
                      <Fragment key={ind}>
                        <Grid item xs={4}>
                          <Typography variant="h6" align="right">{keyMap[curr]}</Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography variant="h6" align="left">{audience?.[curr]}</Typography>
                        </Grid>
                      </Fragment>
                    )
                  })
                }
              </Grid>

              <Typography variant="h5" align="left" style={{ marginTop: '10px' }}>
                Channel 
              </Typography>
                { channelList.map((curr, ind) => {
                  return(
                    <Grid container spacing={2} key={ind}>
                    {
                      Object.keys(curr).map((val,i) => (
                        <Fragment key={i}>
                          <Grid item xs={4}>
                            <Typography variant="h6" align="right">{keyMap[val]}</Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <Typography variant="h6" align="left">{curr[val]}</Typography>
                          </Grid>
                        </Fragment>
                      ))
                    }
                    </Grid>)
                  })
                }

              <Typography variant="h5" align="left" style={{ marginTop: '20px' }}>
                Product List
              </Typography>
              <List>
                { 
                  data?.productList?.map((product, index) => {
                  return (
                    <Grid container spacing={2} key={index}>
                    {
                      Object.keys(product).map((val,i) => (
                        <Fragment key={i}>
                          <Grid item xs={4}>
                            <Typography variant="h6" align="right">{keyMap[val]}</Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <Typography variant="h6" align="left">{product[val]}</Typography>
                          </Grid>
                        </Fragment>
                      ))
                    }
                    </Grid>
                  )
                })}
              </List>
            </CardContent>
          </Card>
        </ThemeProvider>
      </Container>
    )
}
export default CampaignData