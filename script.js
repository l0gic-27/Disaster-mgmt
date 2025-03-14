document.addEventListener("DOMContentLoaded", function () {
    console.log("🌍 Initializing 3D Disaster Monitoring System...");

    // Initialize 3D Globe
    const globe = Globe()
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .pointColor(() => '#ff0000')
        .pointAltitude(0.1)
        .pointRadius(0.3)
        (document.getElementById("globe-container"));

    // Reduce Earth size
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.3;
    globe.controls().enableZoom = true;
    globe.width([300]); // Reduce size
    globe.height([300]);

    console.log("🔍 Fetching earthquake alerts...");
    fetchEarthquakeAlerts();

    // Fetch earthquake alerts every 1 minute
    setInterval(fetchEarthquakeAlerts, 60000);

    async function fetchEarthquakeAlerts() {
        try {
            const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            console.log("✅ API Response:", data);

            if (!data.features || data.features.length === 0) {
                document.getElementById("alert-feed").innerHTML = `<li class="alert-item">✅ No recent earthquakes.</li>`;
                return;
            }

            document.getElementById("alert-feed").innerHTML = "";

            const earthquakePoints = [];
            
            data.features.slice(0, 10).forEach(alert => {
                const { place, mag, time } = alert.properties;
                const [longitude, latitude] = alert.geometry.coordinates;

                if (!latitude || !longitude) return;

                earthquakePoints.push({ lat: latitude, lng: longitude, size: mag / 10 });

                const li = document.createElement("li");
                li.className = "alert-item";
                li.innerHTML = `<strong>${new Date(time).toLocaleString()}</strong> - ${place} <span class="mag">Mag: ${mag}</span>`;
                document.getElementById("alert-feed").appendChild(li);
            });

            console.log("📊 Total Earthquake Alerts:", earthquakePoints.length);
            globe.pointsData(earthquakePoints);
        } catch (error) {
            console.error("⚠️ Error fetching alerts:", error);
            document.getElementById("alert-feed").innerHTML = `<li class="alert-item">⚠️ Unable to load alerts.</li>`;
        }
    }
});
