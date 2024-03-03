import axios from 'axios';
import * as stationConfigs from "./stationsConfig.js"

const api_url = "https://api.yupooooo.me"
export const fetchRealtimeData = (value, setRealTimeData) => {
    if (!value) return;
    axios.get(`${api_url}/api/metro/${encodeURIComponent(value)}`)
        .then(response => {
            setRealTimeData(response.data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
};

export const findStationRoute = (stationName) => {
    if (stationConfigs.BlueLine.includes(stationName)) {
        return "bl"
    }
    else if (stationConfigs.RedLine.includes(stationName)) {
        return "r";
    }
    else if (stationConfigs.GreenLine.includes(stationName)) {
        return "g";
    }
    else if (stationConfigs.OrangeLine.includes(stationName)) {
        return "o";
    }
    else if (stationConfigs.BrownLine.includes(stationName)) {
        return "br";
    }
}

export const requestLocationPermission = (handleStationChange, handleRouteChange, setlocation, location) => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setlocation(`${position.coords.latitude},${position.coords.longitude}`);
                axios.get(`${api_url}/api/location/${encodeURIComponent(location)}`)
                    .then(response => {
                        handleStationChange(response.data);
                        handleRouteChange(findStationRoute(response.data));
                    })
                    .catch(error => {
                        console.log('Error fetching data:', error);
                    });
            },
            (error) => {
                console.error("Error obtaining location: ", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};