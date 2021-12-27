// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]
// const express = require('express');
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

app.use(cors()); // enable all cors

// app.use(express.static("public"));
app.use(express.static("angular-app"));

app.get('/weather', async (req, res) => {
  // Construct api call queryString
  let searchParams = new URLSearchParams();
  // searchParams.append("foo", req.query.lat + ',' + req.query.lng);
  searchParams.append("location", req.query.lat + ',' + req.query.lng);
  searchParams.append("fields", ["temperature","temperatureApparent","temperatureMin","temperatureMax","windSpeed","windDirection","humidity","pressureSeaLevel","uvIndex","weatherCode","precipitationProbability","precipitationType","sunriseTime","sunsetTime","visibility","moonPhase","cloudCover"]);
  searchParams.append("units", "imperial");
  searchParams.append("timesteps", ["1h","1d"]);
  searchParams.append("timezone", "America/Los_Angeles");
  // searchParams.append("apikey", "6CQrarn7QIyUdQjVqQiwrnMRqxWSrbNe");
  searchParams.append("apikey", "Z6F1Dw0C8FaiOVjTu9PazcjkEryodIYn");

  const queryString = searchParams.toString();
  // Call tomorrow.io api using fetch
  const api_url = "https://api.tomorrow.io/v4/timelines";
  const fetch_response = await fetch(api_url + '?' + queryString, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });
  const response_json = await fetch_response.json();
  res.json(response_json); // send back to clientside
});


app.get('/autocomplete', async (req, res) => {
  // Construct api call queryString
  let searchParams = new URLSearchParams();
  searchParams.append("input", req.query.input);
  searchParams.append("components", "country:us");
  searchParams.append("types", "(cities)");
  searchParams.append("key", "AIzaSyDe-gIMRLcnp3uVz9l4ZOrCoy9zwXLRohI");
  
  const queryString = searchParams.toString();
  // Call google places-autocomplete api using fetch
  const api_url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
  const fetch_response = await fetch(api_url + '?' + queryString, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });
  const response_json = await fetch_response.json();
  res.json(response_json); // send back to clientside
});

app.get('/*', (req, res) => {
  // Serve frontend
  res.sendFile('index.html', { root: './angular-app' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

export default app;