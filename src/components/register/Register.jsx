import React, { useState } from "react";
import fetchspotifyapi from "../../api/spotifyapi.js";


const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    const newValues = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(newValues);
  };

  const handleRegister = async () => {
    const client_id = "df2f00744da7443eab7a3d6a324d44f2";
    const client_secret ="b77fbad0d65f4d49a026ec0dc1713568";
    const body = 'grant_type=client_credentials';

    const response = await fetchspotifyapi(
        'https://accounts.spotify.com/api/token',
        'POST',
        body,
        'application/x-www-form-urlencoded',
        `Basic ${btoa(client_id + ':' + client_secret)}`);
    
    console.log(response);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-80 flex flex-col justify-center items-center">
        <h1 className=" text-3xl mb-5 text-center text-white font-sans">
          My music app
        </h1>
        <input
            name="email"
          value={form.email}
          type="text"
          className="w-full mt-4 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          placeholder="Email"
          onChange={handleOnChange}
        />
        
        <input
         name="password"
          value={form.password}
          type="password"
          className="w-full mt-4 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          placeholder="Password"
          onChange={handleOnChange}
        />
        
        <button
          type="button"
            onClick={handleRegister}
          className="flex w-full justify-center align-middle mt-4 rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
