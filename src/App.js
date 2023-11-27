import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Filter from './components/Filter/index';
import Table from './components/Table/index';
import CampaignForm from './components/CampaignForm/index'
import CampaignData from './components/CampaignData/index'
import NotFound from './components/NotFound/index';
const rowsPerPageOptions = [10, 20, 50];

const columns = [
  { id: 'campaignID', label: 'Campaign ID', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 90 },
  { id: 'startDate', label: 'Start Date', minWidth: 110 },
  { id: 'endDate', label: 'End Date', minWidth: 110 },
  { id: 'actions', label: 'ACTIONS', minWidth: 200, },
];
const buttons = [
  { id: 'view', label: 'View', minWidth: 100, format: "button" },
  // { id: 'edit', label: 'Edit', minWidth: 100, format: "button" },
  { id: 'delete', label: 'Delete', minWidth: 100, format: "button" }
]
function App() {
  const location = useLocation()
  const [allCampaign, setAllCampaign] = useState([])
  const [rows, setRows] = useState([])
  const handleResetChange = () => {
    setRows(allCampaign)
  }
  

  useEffect(() =>{
    const dataVal = JSON.parse(localStorage.getItem('data'))?.length > 0  ? JSON.parse(localStorage.getItem('data')) : []
    const value = dataVal.map((curr,ind) =>{
      const {city, imageUrl, videoUrl, audience, productList, channel, ...rest} = curr;
      return rest;
    })
    localStorage.setItem('data',JSON.stringify(dataVal))
    setAllCampaign(value)
    setRows(value)
  },[location])


  const handleFilterChange = (values) => {
    const status = allCampaign?.filter(row => {
      return values.status === 'all' ? row : row.status === values.status
    })
    const nameArr = status.filter(row => {
      return row.name.toLowerCase().indexOf(values.name.toLowerCase()) !== -1
    })
    const filterData = nameArr.filter(row => {
      return row.campaignID.toLowerCase().indexOf(values.campaignID.toLowerCase()) !== -1
    })
    setRows(filterData)
  }
  return (
    <div className="displayComponent">
      <div className="header">Timely AI</div>

      <Routes>
        <Route path="/" element={
            <>
              <Filter handleFilterChange={handleFilterChange} handleResetChange={handleResetChange} />
              <Table columns={columns} rowsPerPageOptions={rowsPerPageOptions} rows={rows} buttons={buttons} />
            </>
          }
        />
        <Route path="/createCampaign" exact element={<CampaignForm editData ={false}/>} />
        {/* <Route path="/editCampaign/:campaignID" exact element={<CampaignForm editData ={true}/>} /> */}
        <Route path="/viewCampaign/:campaignID" element={<CampaignData/>} />
        <Route path="*" element = {<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
