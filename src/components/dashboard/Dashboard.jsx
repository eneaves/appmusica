import React, { useState } from "react";
// import React, { useEffect } from "react";
import fetchspotifyapi from "../../api/spotifyapi.js";

const Dashboard = () => {
  const [form, setForm] = useState({
    search: "",
  });

  const [type, setType] = useState("");

  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (type === "track") {
      params.append("q", encodeURIComponent(`track:${form.search}`));
    } else if (type === "artist") {
      params.append("q", encodeURIComponent(`artist:${form.search}`));
    } else if (type === "album") {
      params.append("q", encodeURIComponent(`album:${form.search}`));
    } else {
      params.append("q", encodeURIComponent(form.search));
    }
    params.append("type", type);

    const querystring = params.toString();
    const url = `https://api.spotify.com/v1/search`;
    const updatedUrl = `${url}?${querystring}`;
    const token = `Bearer ${localStorage.getItem("token")}`;

    const response = await fetchspotifyapi(
      updatedUrl,
      "GET",
      null,
      "application/json",
      token
    );
    let items = [];
    if (response && response[type + "s"]) {
      items = response[type + "s"].items;
    }
    console.log(response);
    setResults(items);
  };

  const handleOnChange = (e) => {
    console.log(e.target.value);
    const newValues = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(newValues);
  };

  const types = [
    "album",
    "artist",
    "playlist",
    "track",
    "show",
    "episode",
    "audiobook",
  ];

  const handleSelectChange = (e) => {
    console.log(e.target.value);
    setType(e.target.value);
  };

  const handleSelection = (song) => {
    console.log(song);
    handlePlayMusic(song.uri);
    return song;
  };

  const getDeviceId = async () => {
    const url = "https://api.spotify.com/v1/me/player/devices";
    const token = `Bearer ${localStorage.getItem("token")}`;
    const response = await fetchspotifyapi(
      url,
      "GET",
      null,
      "application/json",
      token
    );
    console.log(response);
    return response.devices.id;
  };

  const handlePlayMusic = async (song) => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const data = {
      uris: [song],
    };
    const id_device = "dbc42f642716b1dc4a429de464db6a1196365793";
    const playSong = await fetchspotifyapi(
      `https://api.spotify.com/v1/me/player/play?device_id=${id_device}`,
      "PUT",
      JSON.stringify(data),
      "application/json",
      token
    );
    console.log(playSong);
  };

  const handleGetToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    let codeVerifier = localStorage.getItem("code_verifier");
    console.log({ codeVerifier });
    console.log({ code });
    const url = "https://accounts.spotify.com/api/token";
    const clientId = "df2f00744da7443eab7a3d6a324d44f2";
    const redirectUri = "http://localhost:5173/";
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem("token", response.access_token);
  };

  return (
    <div className="flex flex-col justify-start items-top h-screen min-h-screen overflow-y-auto bg-gradient-to-b from-black to-gray-900">
      <div>
        <button
          onClick={handleGetToken}
          className="bg-green-500 w-40 text-white p-2 rounded-lg mt-5 justify-center items-center mb-6"
        >
          Get Token
        </button>
        <button
          onClick={getDeviceId}
          className="bg-green-500 w-40 text-white p-2 rounded-lg mt-5 justify-center items-center mb-6"
        >
          Get device
        </button>
      </div>
      <div className="flex flex-row">
        <div className="pr-5 mt-5">
          <input
            type="text"
            name="search"
            placeholder="Search for songs"
            value={form.search}
            className="border-4 border-gray-300 w-80 rounded-lg p-2 focus:outline-none focus:border-green-500 text-center"
            onChange={handleOnChange}
          />
          <select
            name="type"
            id="type"
            className=" ml-1 border-4 border-gray-300 w-34 rounded-lg p-2 focus:outline-none focus:border-green-500 text-center"
            onChange={handleSelectChange}
          >
            <option value="">Select a type</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center">
          <button
            className="bg-green-500 w-40 text-white p-2 rounded-lg mt-5"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mt-5">
        <div className="w-full h-full grid grid-cols-2 gap-4">
          {results && results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.id}
                className="bg-gray-800 w-full h-full rounded-lg p-5 flex items-center hover:bg-green-600 transition duration-300 ease-in-out"
                onClick={() => handleSelection(result)}
              >
                <div className="flex flex-col items-center">
                  <h1 className="text-white text-2xl">{result.name}</h1>
                  <h2 className="text-white text-xl">
                    {result.artists[0].name}
                  </h2>
                </div>

                <div className="w-16 h-16 bg-white rounded-full ml-auto">
                  <img
                    src={result.album.images[0].url}
                    alt={result.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </button>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
