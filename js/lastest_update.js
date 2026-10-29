
/* ==========================================
   1. REGION COORDINATES
========================================== */

const regions = {
    ayeyarwady: {
        latitude: 16.7792,
        longitude: 94.7321
    },
    yangon: {
        latitude: 16.8661,
        longitude: 96.1951
    },
    rakhine: {
        latitude: 20.1462,
        longitude: 92.8984
    },
    tanintharyi: {
        latitude: 14.0833,
        longitude: 98.2000
    },
    mandalay: {
        latitude: 21.9588,
        longitude: 96.0891
    },
    bago: {
        latitude: 17.3367,
        longitude: 96.4797
    },
    sagaing: {
        latitude: 21.8787,
        longitude: 95.9797
    }
};


/* ==========================================
   2. HTML ELEMENTS
========================================== */

const regionSelect = document.getElementById("region");
const precipitationElement = document.getElementById("precipitation");
const updatedTimeElement = document.getElementById("updated_time");
const rainfall24H = document.getElementById("rainfall_24h");
const refreshButton = document.getElementById("refresh_data");
const floodRiskDisplay = document.getElementById("flood_risk_percentage");
const riskStatusNote = document.querySelector(".alert_explanation");

const rainfallThresholdElement = document.getElementById("rainfall_threshold");
const rainfallMeter = document.getElementById("rainfall_meter");
const rainfallMeterFill = document.getElementById("rainfall_meter_fill");
const rainfallMeterText = document.getElementById("rainfall_meter_text");


/* ==========================================
   3. REGION SETTINGS AND LOADING STATE
========================================== */

const centralRegions = ["sagaing", "magway"];

let isLoading = false;


/* ==========================================
   4. GET RAINFALL DATA
========================================== */

async function getRainfallData() {

    // Prevent multiple requests from running at once
    if (isLoading) {
        return;
    }

    isLoading = true;


    // Get the selected region's coordinates
    const selectedRegion = regions[regionSelect.value];

    if (!selectedRegion) {
        precipitationElement.textContent = "Region not found";
        refreshButton.disabled = false;
        isLoading = false;
        return;
    }


    // Display loading messages
    precipitationElement.textContent = "Loading...";
    rainfall24H.textContent = "Loading...";
    refreshButton.disabled = true;


    /* ==========================================
       5. FETCH WEATHER DATA FROM THE API
    ========================================== */

    try {
        const apiUrl = "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${selectedRegion.latitude}` +
            `&longitude=${selectedRegion.longitude}` +
            `&current=precipitation` +
            `&hourly=precipitation` +
            `&past_days=1` +
            `&forecast_days=1` +
            `&timezone=Asia%2FYangon`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch rainfall data");
        }

        const data = await response.json();


        /* ==========================================
           6. FIND THE MOST RECENT 24 HOURS OF RAINFALL
        ========================================== */

        const currentTime = data.current.time;

        const nextHourIndex = data.hourly.time.findIndex(time => time > currentTime);

        if (nextHourIndex < 24) {
            throw new Error("Not enough hourly rainfall data");
        }

        const recentRainfall = data.hourly.precipitation.slice(nextHourIndex - 24, nextHourIndex );

        if (recentRainfall.length !== 24) {
            throw new Error("Unable to calculate 24-hour rainfall");
        }


        /* ==========================================
           7. CALCULATE TOTAL 24-HOUR RAINFALL
        ========================================== */

        const totalRainfall = recentRainfall.reduce((total, value) => total + value, 0 );

        rainfall24H.textContent = totalRainfall.toFixed(1) + " mm";


        /* ==========================================
           8. SET THE HEAVY-RAINFALL THRESHOLD
        ========================================== */

        let heavyRainfallThreshold;

        if (centralRegions.includes(regionSelect.value)) {
            heavyRainfallThreshold = 1.50 * 25.4;
        } else {
            heavyRainfallThreshold = 3.00 * 25.4;
        }

        rainfallThresholdElement.textContent = (heavyRainfallThreshold / 25.4).toFixed(2) + " inches (" + heavyRainfallThreshold.toFixed(1) + " mm)";


        /* ==========================================
           9. CALCULATE THE RAINFALL PERCENTAGE
        ========================================== */

        const percentage = (totalRainfall / heavyRainfallThreshold) * 100;

        const meterPercentage = Math.max(
            0,
            Math.min(percentage, 100)
        );

        rainfallMeterFill.style.width = meterPercentage + "%";
        rainfallMeter.setAttribute("aria-valuenow", meterPercentage.toFixed(0));

        rainfallMeterText.textContent = percentage.toFixed(0) + "% of threshold";


        /* ==========================================
           10. UPDATE THE FLOOD-RISK STATUS DISPLAY
        ========================================== */

        const statusCard = document.querySelector(".alert_panel");
        const statusIcon = statusCard.querySelector(".alert_symbol i");

        if (totalRainfall >= heavyRainfallThreshold) {
            floodRiskDisplay.textContent = "Heavy-rainfall threshold reached";

            riskStatusNote.textContent = "The past 24-hour rainfall has reached or exceeded the regional threshold. Stay informed about official weather warnings.";

            statusCard.classList.remove("below-threshold");
            statusCard.classList.add("threshold-reached");
            statusIcon.className = "bi bi-exclamation-triangle-fill";

        } else {
            floodRiskDisplay.textContent = "Below heavy-rainfall threshold";

            riskStatusNote.textContent = "This indicator compares past 24-hour rainfall with the heavy-rainfall threshold for the selected region. Reaching the threshold does not necessarily mean flooding will occur.";

            statusCard.classList.remove("threshold-reached");
            statusCard.classList.add("below-threshold");
            statusIcon.className = "bi bi-shield-check";
        }


        /* ==========================================
           11. DISPLAY CURRENT PRECIPITATION AND TIME
        ========================================== */

        const precipitation = data.current.precipitation;
        precipitationElement.textContent = precipitation + " mm";

        updatedTimeElement.textContent =
            new Date().toLocaleString();


    /* ==========================================
       12. HANDLE ERRORS
    ========================================== */

    } catch (error) {
        console.error(error);
        precipitationElement.textContent = "Unable to load rainfall data";
        rainfall24H.textContent = "Unavailable";
        rainfallMeterText.textContent = "Data unavailable";
        rainfallThresholdElement.textContent = "Unavailable";


    /* ==========================================
       13. RESET LOADING STATE
    ========================================== */

    } finally {
        refreshButton.disabled = false;
        isLoading = false;
    }
}


/* ==========================================
   14. INITIAL LOAD AND EVENT LISTENERS
========================================== */

// Load rainfall data when the page opens
getRainfallData();


// Refresh data when the refresh button is clicked
refreshButton.addEventListener("click", getRainfallData);


// Fetch new data when a different region is selected
regionSelect.addEventListener("change", getRainfallData);


// Automatically refresh data every 10 minutes
setInterval(getRainfallData, 10 * 60 * 1000);
