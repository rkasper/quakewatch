import './style.css';
import {
  fetchQuakes,
  fetchWeather,
  weatherCodeToLabel,
  type QuakeFeature,
} from './api';

const app = document.querySelector<HTMLDivElement>('#app')!;

// ── State ──────────────────────────────────────────────
let quakes: QuakeFeature[] = [];
let minMag = 0;

// ── Bootstrap ──────────────────────────────────────────
app.innerHTML = `
  <header>
    <h1>🌍 Quake <span>Watch</span></h1>
    <p>Recent earthquakes worldwide — powered by USGS</p>
  </header>
  <div class="filter-bar">
    <label for="mag-slider">Min magnitude</label>
    <input id="mag-slider" type="range" min="0" max="8" step="0.5" value="0" />
    <span class="mag-value" id="mag-display">0</span>
  </div>
  <div id="detail-container"></div>
  <div id="quake-list" class="quake-list">
    <div class="status-msg"><div class="spinner"></div><br>Loading earthquakes…</div>
  </div>
`;

const slider = document.getElementById('mag-slider') as HTMLInputElement;
const magDisplay = document.getElementById('mag-display')!;
const listEl = document.getElementById('quake-list')!;
const detailContainer = document.getElementById('detail-container')!;

slider.addEventListener('input', () => {
  minMag = parseFloat(slider.value);
  magDisplay.textContent = minMag.toFixed(1);
  renderList();
});

// ── Fetch & render ─────────────────────────────────────
loadQuakes();

async function loadQuakes() {
  try {
    quakes = await fetchQuakes();
    renderList();
  } catch (err) {
    listEl.innerHTML = `<div class="status-msg error">Failed to load earthquakes. Please try again later.</div>`;
    console.error(err);
  }
}

function renderList() {
  const filtered = quakes.filter((q) => q.properties.mag >= minMag);

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="status-msg">No earthquakes found above magnitude ${minMag.toFixed(1)}</div>`;
    return;
  }

  listEl.innerHTML = filtered
    .map((q) => {
      const mag = q.properties.mag.toFixed(1);
      const magClass =
        q.properties.mag >= 5 ? 'mag-high' : q.properties.mag >= 3 ? 'mag-med' : 'mag-low';
      const time = new Date(q.properties.time).toLocaleString();

      return `
        <div class="quake-card" data-id="${q.id}">
          <div class="quake-mag ${magClass}">${mag}</div>
          <div class="quake-info">
            <div class="place">${q.properties.place ?? 'Unknown location'}</div>
            <div class="time">${time}</div>
          </div>
          <div class="quake-arrow">›</div>
        </div>
      `;
    })
    .join('');

  // Attach click listeners
  listEl.querySelectorAll('.quake-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = (card as HTMLElement).dataset.id!;
      selectQuake(id);
    });
  });
}

// ── Detail view ────────────────────────────────────────
function selectQuake(id: string) {
  const quake = quakes.find((q) => q.id === id);
  if (!quake) return;

  const { properties: p, geometry: g } = quake;
  const [lon, lat, depth] = g.coordinates;
  const time = new Date(p.time).toLocaleString();

  detailContainer.innerHTML = `
    <div class="detail-panel">
      <h2>${p.place ?? 'Unknown location'}</h2>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="label">Magnitude</div>
          <div class="value">${p.mag.toFixed(1)}</div>
        </div>
        <div class="detail-item">
          <div class="label">Depth</div>
          <div class="value">${depth.toFixed(1)} km</div>
        </div>
        <div class="detail-item">
          <div class="label">Time</div>
          <div class="value">${time}</div>
        </div>
        <div class="detail-item">
          <div class="label">Coordinates</div>
          <div class="value">${lat.toFixed(2)}°, ${lon.toFixed(2)}°</div>
        </div>
      </div>
      <div class="weather-section" id="weather-section">
        <h3>Current Weather at Location</h3>
        <div class="weather-loading">Loading weather data…</div>
      </div>
      <button class="detail-close" id="detail-close">Close</button>
    </div>
  `;

  document.getElementById('detail-close')!.addEventListener('click', () => {
    detailContainer.innerHTML = '';
  });

  detailContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  loadWeather(lat, lon);
}

async function loadWeather(lat: number, lon: number) {
  const section = document.getElementById('weather-section');
  if (!section) return;

  try {
    const weather = await fetchWeather(lat, lon);
    section.innerHTML = `
      <h3>Current Weather at Location</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="label">Condition</div>
          <div class="value">${weatherCodeToLabel(weather.weathercode)}</div>
        </div>
        <div class="detail-item">
          <div class="label">Temperature</div>
          <div class="value">${weather.temperature}°C</div>
        </div>
        <div class="detail-item">
          <div class="label">Wind Speed</div>
          <div class="value">${weather.windspeed} km/h</div>
        </div>
      </div>
    `;
  } catch {
    section.innerHTML = `
      <h3>Current Weather at Location</h3>
      <div class="weather-loading" style="color: var(--danger)">Failed to load weather data.</div>
    `;
  }
}