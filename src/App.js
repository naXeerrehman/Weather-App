import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdSunny, IoMdCloudy, IoMdRainy, IoMdSnow } from "react-icons/io";
import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsThermometer,
  BsWater,
  BsThunderbolt,
  BsSearch,
  BsWind,
} from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const APIkey = "bcf2048bc3be154bded8f277f580ba2e";

const App = () => {
  // state variables
  const [data, setData] = useState(null);
  // default location is bucharest
  const [location, setLocation] = useState("Bucharest");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    // it prevent the page from refreshing when submitting a form
    e.preventDefault();
    // if input value is not empty
    if (inputValue !== "") {
      setLocation(inputValue);
    } else {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }
    setInputValue("");
  };
  // request and response effect
  useEffect(() => {
    setLoading(true);
    // call the api
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIkey}`;
    axios
      .get(url)
      .then((res) => {
        setTimeout(() => {
          setData(res.data);
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err.response.data.message);
      });
  }, [location]);

  // error message clear effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 2000);
    // When the error message changes,it will erase the old error message and give a new error message or if the componenet unmount it will erase all the error message.
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // if data is not available
  if (!data) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center text-5xl">
        <div>
          <ImSpinner8 className="animate-spin"/>
        </div>
      </div>
    );
  }
// icon switching base on a condition
  let icon;
  switch (data.weather[0].main) {
    case "Clouds":
      icon = <IoMdCloudy />;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill />;
      break;
    case "Rain":
      icon = <IoMdRainy className="text-[#31cafb]" />;
      break;
    case "Clear":
      icon = <IoMdSunny className="text-[#ffde33]" />;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill className="text-[#31cafb]" />;
      break;
    case "Snow":
      icon = <IoMdSnow className="text-[#31cafb]" />;
      break;
    case "Thunderstorm":
      icon = <BsThunderbolt />;
      break;
    default:
      icon = <IoMdSunny />;
  }
// date
  const date = new Date();

  return (
    <div className="w-full h-[650px] bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
      {errorMsg && (<div className="w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-5 p-4 capitalize rounded-md text-center">{errorMsg}</div>)}
      {/* form */}
      <form
        className={`${
          animate ? "animate-shake" : "animate-none"
        } h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-3 mt-5`}>
        <div className="h-full relative flex justify-between items-center p-2 ">
          <input
            onChange={(e) => handleInput(e)}
            className="flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-[14px]"
            placeholder="Search by city or country"
            type="text"
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className="bg-[#1ab8ed] hover:bg-[#15abdd] w-[70px] h-10 rounded-full flex justify-center items-center transition"
          >
            <BsSearch className="text-2xl text-white" />
          </button>
        </div>
      </form>
      {/* card */}
      <div className="w-full max-w-[450px] bg-black/20 min-h-[370px] text-white backdrop-blur-[32px] rounded-[32px] py-10 px-6">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <ImSpinner8 className="text-white text-5xl animate-spin" />
          </div>
        ) : (
          <div>
            {/*weather icon */}
            <div className="flex items-center gap-x-1">
              <div className="text-[87px]">{icon}</div>
              {/*city,country and date */}
              <div>
                <div className="text-2xl font-semibold">
                  {data.name}, {data.sys.country}
                </div>
                {/* date */}
                <div>
                  {date.getUTCDate()}/ {date.getUTCMonth() + 1}/
                  {date.getUTCFullYear()}
                </div>
              </div>
            </div>
            <div className="my-5">
              {/* temperature */}
              <div className="flex justify-center items-center">
                <div className="text-[144px] leading-none font-light">
                  {parseInt(data.main.temp - 273.15)}
                </div>
                <div className="text-4xl">
                  <TbTemperatureCelsius />
                </div>
              </div>
              {/* description */}
              <div className="capitalize text-center mb-10">
                {data.weather[0].description}
              </div>

              <div className="max-w-[378px] mx-auto flex flex-col gap-y-6">
                {/* visibility and thermometer */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-x-2">
                    <BsEye className="text-[20px]" />
                    <div>
                      Visibility
                      <span className="ml-2">{data.visibility / 1000} km</span>
                    </div>
                  </div>
                  {/* thermometer */}
                  <div className="flex items-center gap-x-2">
                    <BsThermometer className="text-[20px]" />
                    <div className="flex">
                      Feels like
                      <div className="flex ml-2">
                        {parseInt(data.main.feels_like - 273.15)}
                        <TbTemperatureCelsius />
                      </div>
                    </div>
                  </div>
                </div>

                {/* water and wind */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-x-2">
                    {/* water */}
                    <BsWater className="text-[20px]" />
                    <div>
                      Humidity
                      <span className="ml-2">{data.main.humidity}%</span>
                    </div>
                  </div>

                  {/* wind */}
                  <div className="flex items-center gap-x-2">
                    <BsWind className="text-[20px]" />
                    <div>
                      Wind
                      <span className="ml-2">{data.wind.speed} m/s</span>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
