// script.js
document.addEventListener("DOMContentLoaded", () => {
  const user = sessionStorage.getItem('user');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('welcome').innerText = `Welcome, ${user}!`;

  fetchData();
  setInterval(fetchData, 20000); // update every 20 seconds
});

const channelID = "3145082";
const apiKey = "HF5NVG4EZ5GFZL5T";
const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=10`;

let chart;
function fetchData() {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const feeds = data.feeds;
      const temp = feeds.map(f => parseFloat(f.field1));
      const humid = feeds.map(f => parseFloat(f.field2));
      const pir = feeds[feeds.length - 1].field3;
      const ir = feeds[feeds.length - 1].field4;
      const tomato = feeds[feeds.length - 1].field5;
      const times = feeds.map(f => new Date(f.created_at).toLocaleTimeString());

      // Display latest values
      document.getElementById('temp').innerText = `${temp[temp.length - 1]} °C`;
      document.getElementById('humid').innerText = `${humid[humid.length - 1]} %`;
      document.getElementById('pir').innerText = pir == "1" ? "Motion Detected" : "No Motion";
      document.getElementById('ir').innerText = ir == "1" ? "Obstacle Detected" : "Clear";
      document.getElementById('tomato').innerText = tomato == "1" ? "Plugged" : "Not Plugged";

      // Chart for temp + humidity
      if (!chart) {
        const ctx = document.getElementById('tempChart').getContext('2d');
        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: times,
            datasets: [
              {
                label: 'Temperature (°C)',
                data: temp,
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                tension: 0.3
              },
              {
                label: 'Humidity (%)',
                data: humid,
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                tension: 0.3
              }
            ]
          },
          options: { responsive: true }
        });
      } else {
        chart.data.labels = times;
        chart.data.datasets[0].data = temp;
        chart.data.datasets[1].data = humid;
        chart.update();
      }
    })
    .catch(err => console.error(err));
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}
