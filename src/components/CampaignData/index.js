import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Card, CardContent, Container, Button } from '@mui/material';
const CampaignData = () => {
  const param = useParams()
  const [data, setData] = useState();
  const navigate = useNavigate();
  useEffect(() =>{
    const localData = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')): [];
    let value = localData.filter(curr => curr.campaignID == param.campaignID)
    debugger
    console.log(value,localData)
    setData(value?.[0])

  }, [])
  
  const goToHomePage = async (e, formObj, formik) => {
    e.preventDefault();
    navigate('/')
  }

    return(
      <Container maxWidth="md" style={{ marginTop: '10px' }}>
        <Button
          color="primary"
          variant="contained"
          style={{ margin: '10px 0', padding: '10px 15px', width: '20%', textTransform:'none' }}
          onClick={(e) => { goToHomePage(e) }}
        >                                      
          View All Campaign                                   
        </Button>
        <Card style={{backgroundColor: "#f2f3f8"}}>
          <CardContent>
            <Typography variant="h5" align="left" gutterBottom>
              Campaign Name: {data?.name}
            </Typography>
            <Typography align="left">Status: {data?.status}</Typography>
            <Typography align="left">City: {data?.city}</Typography>
            <Typography align="left">Start Date: {new Date(data?.startDate).toLocaleDateString()}</Typography>
            <Typography align="left">End Date: {new Date(data?.endDate).toLocaleDateString()}</Typography>

            <Typography variant="h5" align="left" style={{ marginTop: '20px' }}>
              Audience
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={`Gender: ${data?.audience?.[0]?.gender}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Min Age: ${data?.audience?.[0]?.minAge}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Max Age: ${data?.audience?.[0]?.maxAge}`} />
              </ListItem>
            </List>

            <Typography variant="h5" align="left" style={{ marginTop: '20px' }}>
              Channel
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={`Source: ${data?.channel?.[0]?.src}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Message: ${data?.channel?.[0]?.message}`} />
              </ListItem>
            </List>

            <Typography variant="h5" align="left" style={{ marginTop: '20px' }}>
              Product List
            </Typography>
            <List>
              {data?.productList?.map((product, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Product ID: ${product?.productID}`} />
                  <ListItemText primary={`Product Image: ${product?.productImg}`} />
                  <ListItemText primary={`Product URL: ${product?.productUrl}`} />
                  <ListItemText primary={`Name: ${product?.name}`} />
                  <ListItemText primary={`Discount: ${product?.discount}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    )
}
export default CampaignData