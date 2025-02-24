import { useState, useEffect } from "react";

import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { Header } from "../components/Header";
import { DateAndTime } from "../components/DateAndTime";
import { Search } from "../components/Search";
import { MetricsBox } from "../components/MetricsBox";
import { UnitSwitch } from "../components/UnitSwitch";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";

import styles from "../styles/Home.module.css";


export const App = () => {
  const [cities, setCities] = useState(["Paris", "Marseille", "Lille"]);
  const [selectedCity, setSelectedCity] = useState("Paris");
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // IDs des villes pour OpenWeatherMap
  const cityIds = {
      "Paris": 2988507,
      "Marseille": 2995469,
      "Lille": 2998324
  };
  
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        // Construction de la chaîne d'IDs à partir de notre liste de villes
        const idString = Object.values(cityIds).join(',');
        
        const res = await fetch("api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: "group", ids: idString }),
        });
        
        const data = await res.json();
        
        // Traitement des données pour toutes les villes
        const processedData = {};
        
        if (data.list && Array.isArray(data.list)) {
          data.list.forEach(cityData => {
            // Trouver le nom de la ville correspondant à cet ID
            const cityName = Object.keys(cityIds).find(name => cityIds[name] === cityData.id);
            
            if (cityName) {
              processedData[cityName] = {
                temperature: cityData.main?.temp !== undefined ? (cityData.main.temp - 273.15).toFixed(1) : null, // Conversion de Kelvin à Celsius
                humidity: cityData.main?.humidity !== undefined ? cityData.main.humidity : null
              };
            }
          });
        }
        
        setWeatherData(processedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données météo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getData();
  }, []);
  
  // Fonction pour changer la ville sélectionnée
  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };
  
  return (
    <div className="weather-container" style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      background: 'linear-gradient(to bottom,rgb(223, 185, 15),rgb(104, 122, 150))'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        Météo en France
      </h2>
      
      {/* Sélecteur de ville */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px',
        marginBottom: '20px'
      }}>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            style={{ 
              padding: '8px 16px',
              backgroundColor: selectedCity === city ? '#4a90e2' : '#e0e0e0',
              color: selectedCity === city ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {city}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Chargement des données météo...
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 10px 10px 0', color: '#555' }}>Température</h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0',
              color: '#e74c3c'
            }}>
              {weatherData[selectedCity]?.temperature !== null ? `${weatherData[selectedCity]?.temperature}°C` : 'N/A'}
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 10px', color: '#555' }}>Humidité</h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0',
              color: '#3498db'
            }}>
              {weatherData[selectedCity]?.humidity !== null ? `${weatherData[selectedCity]?.humidity}%` : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
