import jwt from 'jsonwebtoken';
import './App.css';
import { Button, Dropdown, Grid, Segment } from "semantic-ui-react";
import { countries, cropPerCountry, crops } from "./data/DropDowns";
import { useEffect, useState } from "react";

const App = () => {
  const [country, setCountry] = useState(countries.map(c => c.value));
  const [crop, setCrop] = useState(crops.map(c => c.value));
  const [iframeUrl, setIframeUrl] = useState("");
  const METABASE_SITE_URL = "http://reports.tasai.dgstg.org";
  const METABASE_SECRET_KEY = "c14c2ed34e13e13ba48dab93245e48e710611225b2f73951dbfcf695d1882a12";


  // const iframeUrl =
  const generateUrl = () => {
    const payload = {
      resource: { dashboard: 9 },
      params: { "country": country },
      exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    };
    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    setIframeUrl(METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=false");
    console.log(payload);
  }
  useEffect(() => {
    generateUrl();

  }, []);

  const handleCountryOnChange = (e, { value }) => {
    setCountry(value);
    let selectedCrops = [];
    value.forEach(v => {
      selectedCrops = [...selectedCrops, ...(cropPerCountry.get(v))];
    });
    setCrop([...(new Set([...selectedCrops]))]);
  }
  const handleCropOnChange = (e, { value }) => {
    setCrop(value);
  }
  const executeQuery = (e) => {
    generateUrl();
  }
  const style = { width: '95%', height: '600px' };
  return (
    <Grid divided='vertically'>
      <Grid.Row columns={2}>
        <Grid.Column width={4}>
          <Segment> <Dropdown placeholder='Country' fluid multiple selection options={countries}
                              onChange={handleCountryOnChange}
                              value={country}
          />
          </Segment>
          <Segment><Dropdown placeholder='Crop' fluid multiple selection options={crops}
                             onChange={handleCropOnChange}
                             value={crop}
          /></Segment>
          <Segment><Button content='Execute query' primary onClick={executeQuery} /></Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <iframe
            src={iframeUrl}
            frameBorder="0"
            style={style}
            allowTransparency
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default App;
