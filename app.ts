const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

var corsOptions = {
    origin: 'file:///C:/Users/Decard/Desktop/htmx/index.html',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
// Use EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const cors = require("cors")
// Middleware to parse POST requests
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.get('/', (req, res) => {
  res.render('zones', { zones: [], state: '' });
});
app.use(express.static(__dirname));

//POST ZONE
app.post('/zones', async (req, res) => {
  try {
    console.log("I got triggered!")
    const state = req.body.state;
    const zoneResponse = await axios.get(`https://api.weather.gov/zones/forecast?area=${state}`);
    
    const zoneListSorted = zoneResponse.data.features.sort((a, b) => {
      return a.properties.name.localeCompare(b.properties.name);
    });
    
    res.render('zones', { zones: zoneListSorted, state });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data');
  }
});

//GET WEATHER
app.get('/current-weather/:zone_id',async (req,res)=>{
  try{
  const zone_id=req.params.zone_id;
  const weatherRes= await axios.get(`https://api.weather.gov/zones/forecast/${zone_id}/observations?limit=1`)
  console.log({name:"WEATHER DATA",value:weatherRes.data});
  const currentWeather = weatherRes.data.features[0].properties;
  res.render('weather', { current_wx: currentWeather });
  }
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data');
  }
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});