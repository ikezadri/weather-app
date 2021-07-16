import { useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState();
  const [weatherData, setWeatherData] = useState();

  const clickHandler = async () => {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setWeatherData({ ...data });
    console.log(data);
  };

  return (
    <div className={styles.wrapper}>
      <h1>My weather app {input}</h1>
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <button onClick={clickHandler}>Send</button>
      {weatherData && (
        <>
          <Image
            alt="weatherIcon"
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            height="300px"
            width="300px"
          />

          <p>
            {weatherData.name}, {weatherData.sys.country}
          </p>
          <h1 className={styles.mainTemp}>
            {Math.round(weatherData.main.temp)}°
          </h1>
          <p>Feels like {weatherData.main.feels_like}°</p>
        </>
      )}
    </div>
  );
}

// export const getServerSideProps = async () => {
//   const res = async fetch()
//   console.log(process.env.OPENWEATHER_API_KEY);

//   return { props: {} };
// };
