const els = {
  cityInput: document.getElementById('cityInput'),
  latInput: document.getElementById('latInput'),
  lonInput: document.getElementById('lonInput'),
  searchBtn: document.getElementById('searchBtn'),
  useGeolocationBtn: document.getElementById('useGeolocationBtn'),
  saveLocationBtn: document.getElementById('saveLocationBtn'),
  locationInfo: document.getElementById('locationInfo'),
  searchError: document.getElementById('searchError'),
  citySuggestions: document.getElementById('citySuggestions'),
  recentChips: document.getElementById('recentChips'),
  dailyContainer: document.getElementById('dailyContainer'),
  dailySummary: document.getElementById('dailySummary'),
  hourlyBody: document.getElementById('hourlyBody'),
  tempSparkline: document.getElementById('tempSparkline'),
  currentMetrics: document.getElementById('currentMetrics'),
  savedLocationsList: document.getElementById('savedLocationsList'),
  mapFrame: document.getElementById('mapFrame'),
  diaryForm: document.getElementById('diaryForm'),
  entryDate: document.getElementById('entryDate'),
  entryNote: document.getElementById('entryNote'),
  entryMood: document.getElementById('entryMood'),
  entryTags: document.getElementById('entryTags'),
  photoUrl: document.getElementById('photoUrl'),
  photoFile: document.getElementById('photoFile'),
  editId: document.getElementById('editId'),
  saveBtn: document.getElementById('saveBtn'),
  cancelEditBtn: document.getElementById('cancelEditBtn'),
  diaryList: document.getElementById('diaryList'),
  diaryStats: document.getElementById('diaryStats'),
  filterDate: document.getElementById('filterDate'),
  filterText: document.getElementById('filterText'),
  sortSelect: document.getElementById('sortSelect'),
  exportDiaryBtn: document.getElementById('exportDiaryBtn'),
  importDiaryFile: document.getElementById('importDiaryFile'),
  diaryModal: document.getElementById('diaryModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  modalDate: document.getElementById('modalDate'),
  modalNote: document.getElementById('modalNote'),
  modalMood: document.getElementById('modalMood'),
  modalTags: document.getElementById('modalTags'),
  modalPhotoUrl: document.getElementById('modalPhotoUrl'),
  modalPhotoFile: document.getElementById('modalPhotoFile'),
  modalPreview: document.getElementById('modalPreview'),
  modalEditId: document.getElementById('modalEditId'),
  saveModalBtn: document.getElementById('saveModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  toast: document.getElementById('toast'),
};

const fmt = {
  date(d) {
    try { return new Date(d).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }); }
    catch { return d; }
  },
  time(t) {
    try { return new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }
    catch { return t; }
  },
  num(n, unit = '') {
    if (n === null || n === undefined) return '-';
    const s = Number(n).toFixed(1);
    return unit ? `${s} ${unit}` : s;
  },
};

function scrollToMap() {
  const mapSection = document.getElementById('locais-title');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showToast(message) {
  if (!els.toast) return;
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    els.toast.classList.remove('show');
  }, 2400);
}

async function geocodeCity(name) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'pt');
  url.searchParams.set('format', 'json');
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha no geocoding');
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('Cidade não encontrada');
  const r = data.results[0];
  const display = `${r.name}, ${r.admin1 ?? r.country}`;
  return { lat: r.latitude, lon: r.longitude, display };
}

async function geocodeSuggestions(name) {
  if (!name || name.length < 2) return [];
  
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'pt');
  url.searchParams.set('format', 'json');
  
  const res = await fetch(url);
  if (!res.ok) return [];
  
  const data = await res.json();
  return (data.results ?? []).map(r => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone,
    population: r.population
  }));
}

async function fetchForecast(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('current', 'temperature_2m,precipitation,wind_speed_10m');
  url.searchParams.set('hourly', 'temperature_2m,precipitation,wind_speed_10m');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weathercode');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao obter previsão');
  
  const data = await res.json();
  return data;
}

function renderCurrent(current, units) {
  els.currentMetrics.innerHTML = '';
  if (!current) return;
  const metrics = [
    { key: 'temp', label: 'Temperatura', value: current.temperature_2m, unit: units?.temperature_2m },
    { key: 'rain', label: 'Chuva', value: current.precipitation, unit: units?.precipitation },
    { key: 'wind', label: 'Vento', value: current.wind_speed_10m, unit: units?.wind_speed_10m },
  ];

  const icons = {
    temp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0z"/></svg>',
    rain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 14a6 6 0 1112 0H6zm2 2l-2 4m6-4l-2 4m6-4l-2 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    wind: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 12h13a3 3 0 100-6 3 3 0 00-3 3H3v3zm0 6h9a3 3 0 110 6 3 3 0 01-3-3H3v-3z"/></svg>',
  };
  for (const m of metrics) {
    const div = document.createElement('div');
    div.className = 'metric-card';
    
    const percent = (() => {
      const v = Number(m.value) || 0;
      if (m.key === 'temp') return Math.max(0, Math.min(100, ((v + 10) / 50) * 100)); // -10..40
      if (m.key === 'wind') return Math.max(0, Math.min(100, (v / 60) * 100)); // 0..60
      if (m.key === 'rain') return Math.max(0, Math.min(100, (v / 20) * 100)); // 0..20
      return 0;
    })();
    
    div.innerHTML = `
      <div class="metric-icon">${icons[m.key]}</div>
      <div>
        <div class="label">${m.label}</div>
        <div class="value">${fmt.num(m.value)}<span class="unit">${m.unit ?? ''}</span></div>
      </div>
      <div class="gauge"><div class="gauge-fill" style="--p:${percent}%"></div></div>
    `;
    els.currentMetrics.appendChild(div);
  }
}

function renderDaily(daily, units) {
  els.dailyContainer.innerHTML = '';
  els.dailySummary && (els.dailySummary.innerHTML = '');
  if (!daily || !daily.time) return;
  // Resumo agregado
  renderDailySummary(daily, units);
  for (let i = 0; i < daily.time.length; i++) {
    const card = document.createElement('div');
    card.className = 'day-card';

    const date = fmt.date(daily.time[i]);

    const tmax = fmt.num(daily.temperature_2m_max?.[i], units?.temperature_2m_max || units?.temperature_2m);

    const tmin = fmt.num(daily.temperature_2m_min?.[i], units?.temperature_2m_min || units?.temperature_2m);

    const rain = fmt.num(daily.precipitation_sum?.[i], units?.precipitation_sum || units?.precipitation);

    const wind = fmt.num(daily.wind_speed_10m_max?.[i], units?.wind_speed_10m_max || units?.wind_speed_10m);

    const code = Number(daily.weathercode?.[i]) || 0;
    const icons = {
      sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="currentColor"/><path fill="currentColor" d="M12 1v3M12 20v3M3 12H0m24 0h-3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M19.78 4.22l-2.12 2.12M6.34 17.66l-2.12 2.12"/></svg>',
      cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 14a6 6 0 1112 0H6z"/></svg>',
      rain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 14a6 6 0 1112 0H6zm2 2l-2 4m6-4l-2 4m6-4l-2 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      snow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2 4-2 2-2-2 2-4zm-6 6l2 2-2 2-2-2 2-2zm12 0l2 2-2 2-2-2 2-2zM6 16l2 2-2 4-2-4 2-2zm12 0l2 2-2 4-2-4 2-2zM10 10h4v4h-4v-4z"/></svg>',
      thunder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 3l-8 10h6l-2 8 8-12h-6l2-6z"/></svg>',
    };
    const icon = (() => {
      if ([0].includes(code)) return icons.sun;
      if ([1,2,3,45,48].includes(code)) return icons.cloud;
      if ([51,53,55,61,63,65,66,67,80,81,82].includes(code)) return icons.rain;
      if ([71,73,75,77,85,86].includes(code)) return icons.snow;
      if ([95,96,99].includes(code)) return icons.thunder;
      return icons.cloud;
    })();
    const label = getWeatherLabel(code);

    card.innerHTML = `
      <div class="day-top">
        <div class="day-icon">${icon}</div>
        <div class="day-date">${date}</div>
        <div><strong>${tmax}</strong> / ${tmin}</div>
      </div>
      <div class="day-content">
        <div class="day-item"><strong>Chuva:</strong> ${rain}</div>
        <div class="day-item"><strong>Vento máx:</strong> ${wind}</div>
      </div>
      <div class="day-badge" aria-label="Condição">${label}</div>
    `;
    els.dailyContainer.appendChild(card);
  }
}

function getWeatherLabel(code) {
  if ([0].includes(code)) return 'Céu limpo';
  if ([1].includes(code)) return 'Parcialmente nublado';
  if ([2].includes(code)) return 'Nublado';
  if ([3].includes(code)) return 'Encoberto';
  if ([45,48].includes(code)) return 'Nevoeiro';
  if ([51,53,55].includes(code)) return 'Chuvisco';
  if ([61,63,65].includes(code)) return 'Chuva';
  if ([66,67].includes(code)) return 'Chuva gelada';
  if ([71,73,75,77].includes(code)) return 'Neve';
  if ([80,81,82].includes(code)) return 'Aguaceiros';
  if ([85,86].includes(code)) return 'Neve intensa';
  if ([95,96,99].includes(code)) return 'Trovoadas';
  return 'Condição variável';
}

function renderDailySummary(daily, units) {
  if (!els.dailySummary || !daily?.time?.length) return;
  const len = daily.time.length;
  const avg = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0) / (arr.length || 1);
  const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

  const avgMax = avg(daily.temperature_2m_max || []);
  const avgMin = avg(daily.temperature_2m_min || []);
  const totalRain = sum(daily.precipitation_sum || []);
  let maxWind = -Infinity, maxWindIdx = -1;
  (daily.wind_speed_10m_max || []).forEach((v, i) => {
    const num = Number(v) || 0;
    if (num > maxWind) { maxWind = num; maxWindIdx = i; }
  });

  const windUnit = units?.wind_speed_10m_max || units?.wind_speed_10m || 'km/h';
  const tempUnit = units?.temperature_2m_max || units?.temperature_2m || '°C';
  const rainUnit = units?.precipitation_sum || units?.precipitation || 'mm';

  const hottestIdx = (daily.temperature_2m_max || []).reduce((best, v, i, arr) => (Number(v) > Number(arr[best] || -Infinity) ? i : best), 0);
  const coldestIdx = (daily.temperature_2m_min || []).reduce((best, v, i, arr) => (Number(v) < Number(arr[best] || Infinity) ? i : best), 0);

  const items = [
    { label: 'Máx média', value: `${fmt.num(avgMax, tempUnit)}` },
    { label: 'Mín média', value: `${fmt.num(avgMin, tempUnit)}` },
    { label: 'Chuva total', value: `${fmt.num(totalRain, rainUnit)}` },
    { label: `Vento máx (${fmt.date(daily.time[maxWindIdx])})`, value: `${fmt.num(maxWind, windUnit)}` },
  ];

  els.dailySummary.innerHTML = items.map(i => `
    <div class="summary-card">
      <p class="label">${i.label}</p>
      <p class="value">${i.value}</p>
    </div>
  `).join('');
}

function renderHourly(hourly, units) {
  els.hourlyBody.innerHTML = '';
  if (!hourly || !hourly.time) return;
  const hours = Math.min(hourly.time.length, 24);
  const temps = [];
  for (let i = 0; i < hours; i++) {
    const tr = document.createElement('tr');
    const t = fmt.time(hourly.time[i]);
    const temp = fmt.num(hourly.temperature_2m?.[i], units?.temperature_2m);
    const rain = fmt.num(hourly.precipitation?.[i], units?.precipitation);
    const wind = fmt.num(hourly.wind_speed_10m?.[i], units?.wind_speed_10m);
    tr.innerHTML = `
      <td>${t}</td>
      <td>${temp}</td>
      <td>${rain}</td>
      <td>${wind}</td>
    `;
    els.hourlyBody.appendChild(tr);
    temps.push(Number(hourly.temperature_2m?.[i]));
  }
  renderSparkline(temps);
}

function renderSparkline(values) {
  els.tempSparkline.innerHTML = '';
  if (!values || values.length === 0) return;
  const width = 600, height = 120;
  const min = Math.min(...values), max = Math.max(...values);
  const xStep = width / (values.length - 1);
  const scaleY = v => {
    if (max === min) return height / 2;
    return height - ((v - min) / (max - min)) * height;
  };
  const points = values.map((v, i) => `${(i * xStep).toFixed(2)},${scaleY(v).toFixed(2)}`).join(' ');
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', '#4ea1ff');
  polyline.setAttribute('stroke-width', '2');
  els.tempSparkline.setAttribute('viewBox', `0 0 ${width} ${height}`);
  els.tempSparkline.appendChild(polyline);
}

async function doSearch() {
  els.searchError.hidden = true;
  els.searchError.textContent = '';
  try {
    let lat, lon, display;
    const city = els.cityInput.value.trim();
    const latStr = els.latInput.value.trim();
    const lonStr = els.lonInput.value.trim();

    if (city) {
      const g = await geocodeCity(city);
      lat = g.lat; lon = g.lon; display = g.display;
    } else if (latStr && lonStr) {
      lat = Number(latStr); lon = Number(lonStr);
      display = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    } else {
      throw new Error('Informe uma cidade OU latitude e longitude.');
    }

    const forecast = await fetchForecast(lat, lon);
    els.locationInfo.textContent = `${display} • Fuso: ${forecast.timezone}`;
    updateMap(lat, lon);
    renderCurrent(forecast.current, forecast.current_units);
    renderDaily(forecast.daily, forecast.daily_units);
    renderHourly(forecast.hourly, forecast.hourly_units);
    recordRecentSearch(display, lat, lon);
    showToast(`Previsão carregada: ${display}`);
    scrollToMap(); 
  } catch (err) {
    els.searchError.textContent = err.message || 'Erro inesperado na busca';
    els.searchError.hidden = false;
    showToast('Falha na busca. Verifique os campos.');
  }
}

async function useGeolocation() {
  els.searchError.hidden = true;
  els.searchError.textContent = '';
  if (!('geolocation' in navigator)) {
    els.searchError.textContent = 'Geolocalização não suportada neste navegador.';
    els.searchError.hidden = false;
    return;
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude: lat, longitude: lon } = pos.coords;
    els.latInput.value = String(lat.toFixed(4));
    els.lonInput.value = String(lon.toFixed(4));
    els.cityInput.value = '';
    await doSearch();
  }, (err) => {
    els.searchError.textContent = 'Não foi possível obter a localização.';
    els.searchError.hidden = false;
    showToast('Não foi possível obter a localização.');
  }, { enableHighAccuracy: true, timeout: 10000 });
}

const LOCATIONS_KEY = 'savedLocations';
const RECENT_KEY = 'recentSearches';

function clearForm() {
  els.entryDate.value = new Date().toISOString().slice(0, 10);
  els.entryNote.value = '';
  els.entryMood.value = ''; 
  els.entryTags.value = '';
  els.photoUrl.value = '';
  els.photoFile.value = '';
  els.editId.value = '';
  els.saveBtn.textContent = 'Salvar anotação';
  els.cancelEditBtn.hidden = true;
}

async function renderDiary() {
  let list = [];
  try {
    const response = await fetch('http://localhost:3000/api/diary');
    if (!response.ok) throw new Error('Falha ao carregar anotações do servidor');
    list = await response.json();
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Erro ao carregar anotações.');
  }

  list = list.map(item => ({
    ...item,
    photoUrl: item.photoUrl || item.photo_url || '' 
  }));


  const sort = els.sortSelect ? els.sortSelect.value : 'desc';
  list = list.sort((a,b) => sort === 'asc' ? (a.date > b.date ? 1 : -1) : (a.date < b.date ? 1 : -1));
  
  const fd = els.filterDate.value;
  const ft = els.filterText.value.trim().toLowerCase();
  
  if (fd) list = list.filter(x => x.date === fd);
  if (ft) list = list.filter(x => (x.observacoes?.toLowerCase().includes(ft) || (x.tags || '').toLowerCase().includes(ft)));
  
  els.diaryList.innerHTML = '';
  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'Nenhuma anotação ainda.';
    els.diaryList.appendChild(empty);
    renderDiaryStats([]);
    return;
  }
  
  for (const item of list) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    
    const img = document.createElement('img');
    img.alt = 'Foto da anotação';
    img.className = 'entry-photo';
    const photoUrl = item.photoUrl || '';
    img.src = photoUrl; 
    if (!photoUrl) img.style.display = 'none';

    const content = document.createElement('div');
    const meta = document.createElement('div'); meta.className = 'entry-meta'; meta.textContent = fmt.date(item.date);
    
    const note = document.createElement('p');
    note.textContent = item.observacoes; 
    
    const mood = document.createElement('div'); mood.className = 'badge';
    mood.textContent = item.condicoes_percebidas || 'Sem condição'; 

    const tagsWrap = document.createElement('div'); tagsWrap.className = 'tags';
    const tags = (item.tags || '').split(',').map(s => s.trim()).filter(Boolean);
    for (const t of tags) { const span = document.createElement('span'); span.className = 'tag'; span.textContent = t; tagsWrap.appendChild(span); }
    content.appendChild(meta); content.appendChild(note);
    content.appendChild(mood); if (tags.length) content.appendChild(tagsWrap);

    const actions = document.createElement('div'); actions.className = 'entry-actions';
    const editBtn = document.createElement('button'); editBtn.className = 'ghost'; editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => startEdit(item)); 
    const delBtn = document.createElement('button'); delBtn.className = 'danger'; delBtn.textContent = 'Excluir';
    delBtn.addEventListener('click', () => deleteEntry(item.id)); 
    actions.appendChild(editBtn); actions.appendChild(delBtn);

    if (photoUrl) card.appendChild(img); 
    card.appendChild(content); 
    card.appendChild(actions);
    els.diaryList.appendChild(card);
  }
  renderDiaryStats(list);
}

function startEdit(item) {
  openDiaryModal(item);
}

async function deleteEntry(id) {
  const confirmed = await new Promise(resolve => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirmação de Exclusão</h3>
          <button onclick="document.body.removeChild(this.closest('.modal'))" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja excluir esta anotação?</p>
        </div>
        <div class="modal-footer actions">
          <button id="confirmDelBtn" class="danger">Excluir</button>
          <button id="cancelDelBtn" class="ghost">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('confirmDelBtn').onclick = () => { modal.remove(); resolve(true); };
    document.getElementById('cancelDelBtn').onclick = () => { modal.remove(); resolve(false); };
  });

  if (!confirmed) {
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:3000/api/diary/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Falha ao excluir anotação');
    }

    renderDiary(); 
    showToast('Anotação excluída.');

  } catch (err) {
    console.error(err);
    showToast(err.message || 'Erro ao excluir anotação.');
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function onDiarySubmit(ev) {
  ev.preventDefault();
  
  const editId = els.editId.value;
  if (editId) {
    clearForm();
    return;
  }

  const date = els.entryDate.value;
  const note = els.entryNote.value.trim(); 
  const mood = els.entryMood.value;      
  const tags = els.entryTags.value.trim();
  const photoUrl = els.photoUrl.value.trim(); 

  if (!date || !note) {
    showToast('Data e Observações são obrigatórias.');
    return;
  }

  const entryData = {
    date: date,
    tags: tags,
    observacoes: note, 
    condicoes_percebidas: mood,
    photoUrl: photoUrl 
  };

  try {
    const response = await fetch('http://localhost:3000/api/diary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });

    if (response.status !== 201) {
      throw new Error('Falha ao salvar anotação no servidor');
    }

    clearForm();
    renderDiary(); 
    showToast('Anotação salva.');

  } catch (err) {
    console.error(err);
    showToast(err.message || 'Erro ao salvar anotação.');
  }
}

function downloadBlob(filename, data, type = 'application/json') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function exportDiary() {
  try {
    const response = await fetch('http://localhost:3000/api/diary');
    if (!response.ok) throw new Error('Falha ao buscar dados para exportar');
    const list = await response.json();
    downloadBlob('diario-meteorologico.json', JSON.stringify(list, null, 2));
    showToast('Diário exportado como JSON.');
  } catch (err) {
    showToast(err.message);
  }
}

async function importDiary(file) {
  if (!file) return;

  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      const response = await fetch('http://localhost:3000/api/import-lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Falha ao importar diário');
      const result = await response.json();
      console.log("Resultado da importação:", result);
      showToast('Diário importado com sucesso.');
    }
  } catch (err) {
    showToast(err.message || 'Erro ao processar o arquivo.');
  }
}


function loadLocations() {
  try { const raw = localStorage.getItem(LOCATIONS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveLocations(list) { localStorage.setItem(LOCATIONS_KEY, JSON.stringify(list)); }

function renderLocations() {
  const list = loadLocations();
  els.savedLocationsList.innerHTML = '';
  if (list.length === 0) {
    const li = document.createElement('li'); li.className = 'muted'; li.textContent = 'Nenhum local salvo.'; els.savedLocationsList.appendChild(li); return;
  }
  for (const loc of list) {
    const li = document.createElement('li'); li.className = 'saved-item';
    const info = document.createElement('div'); info.className = 'info';
    const name = document.createElement('span'); name.className = 'name'; name.textContent = `${loc.name}`;
    const coords = document.createElement('span'); coords.className = 'coords'; coords.textContent = `Lat ${loc.lat.toFixed(4)} • Lon ${loc.lon.toFixed(4)}`;
    info.appendChild(name); info.appendChild(coords);
    const actions = document.createElement('div'); actions.className = 'entry-actions';
    const loadBtn = document.createElement('button'); loadBtn.className = 'primary'; loadBtn.textContent = 'Carregar';
    loadBtn.addEventListener('click', async () => {
      els.latInput.value = String(loc.lat); els.lonInput.value = String(loc.lon); els.cityInput.value = `${loc.name}`;
      await doSearch();
    });
    const delBtn = document.createElement('button'); delBtn.className = 'danger'; delBtn.textContent = 'Excluir';
    delBtn.addEventListener('click', () => {
      const next = loadLocations().filter(x => !(x.lat === loc.lat && x.lon === loc.lon && x.name === loc.name));
      saveLocations(next); renderLocations();
    });
    actions.appendChild(loadBtn); actions.appendChild(delBtn);
    li.appendChild(info); li.appendChild(actions);
    els.savedLocationsList.appendChild(li);
  }
}

function saveCurrentLocation(name, lat, lon) {
  if (!name || !lat || !lon) return;
  const list = loadLocations();
  if (!list.some(x => x.name === name && x.lat === lat && x.lon === lon)) {
    list.unshift({ name, lat, lon });
    saveLocations(list);
    renderLocations();
    showToast('Local salvo com sucesso.'); 
  } else {
    showToast('Este local já está salvo.'); 
  }
}

function updateMap(lat, lon) {
  const delta = 0.05;
  const left = lon - delta, right = lon + delta, bottom = lat - delta, top = lat + delta;
  const bbox = `${left},${bottom},${right},${top}`;
  els.mapFrame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}


let suggestions = [];
let activeIndex = -1;
function renderSuggestions(items) {
  els.citySuggestions.innerHTML = '';
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.className = i === activeIndex ? 'active' : '';
    li.innerHTML = `<span class="name">${it.name}</span><span class="meta">${it.admin1 ?? ''} ${it.country ?? ''}</span>`;
    li.addEventListener('click', () => chooseSuggestion(i));
    els.citySuggestions.appendChild(li);
  }
}

function chooseSuggestion(idx) {
  const it = suggestions[idx]; if (!it) return;
  els.cityInput.value = `${it.name}, ${it.country}`;
  els.latInput.value = String(it.lat);
  els.lonInput.value = String(it.lon);
  activeIndex = -1; suggestions = []; renderSuggestions([]);
  saveCurrentLocation(`${it.name}, ${it.country}`, it.lat, it.lon);
  recordRecentSearch(`${it.name}, ${it.country}`, it.lat, it.lon);
  doSearch();
}

function debounce(fn, delay = 250) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

const onCityInput = debounce(async () => {
  const q = els.cityInput.value.trim();
  if (!q) { suggestions = []; renderSuggestions([]); return; }
  suggestions = await geocodeSuggestions(q);
  activeIndex = -1; renderSuggestions(suggestions);
}, 300);

function onCityKeyDown(ev) {
  if (!suggestions.length) return;
  if (ev.key === 'ArrowDown') { ev.preventDefault(); activeIndex = Math.min(activeIndex + 1, suggestions.length - 1); renderSuggestions(suggestions); }
  else if (ev.key === 'ArrowUp') { ev.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderSuggestions(suggestions); }
  else if (ev.key === 'Enter') { ev.preventDefault(); if (activeIndex >= 0) chooseSuggestion(activeIndex); }
}

els.searchBtn.addEventListener('click', doSearch);
els.useGeolocationBtn.addEventListener('click', useGeolocation);
els.saveLocationBtn.addEventListener('click', () => {
  const name = els.cityInput.value.trim();
  const lat = Number(els.latInput.value); const lon = Number(els.lonInput.value);
  if (name && !Number.isNaN(lat) && !Number.isNaN(lon)) {
    saveCurrentLocation(name, lat, lon);
  } else {
    showToast('Não é possível salvar. Verifique o nome e as coordenadas.');
  }
});
els.cityInput.addEventListener('input', onCityInput);
els.cityInput.addEventListener('keydown', onCityKeyDown);
els.diaryForm.addEventListener('submit', onDiarySubmit); 
els.cancelEditBtn.addEventListener('click', () => clearForm());
els.filterDate.addEventListener('change', renderDiary);
els.filterText.addEventListener('input', renderDiary);
els.exportDiaryBtn.addEventListener('click', exportDiary);
els.importDiaryFile.addEventListener('change', (e) => importDiary(e.target.files?.[0]));
if (els.sortSelect) els.sortSelect.addEventListener('change', renderDiary);

function loadRecent() {
  try { const raw = localStorage.getItem(RECENT_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveRecent(list) { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); }
function recordRecentSearch(name, lat, lon) {
  const list = loadRecent();
  const exists = list.find(x => x.lat === lat && x.lon === lon);
  const next = exists ? list.filter(x => !(x.lat === lat && x.lon === lon)) : list;
  next.unshift({ name, lat, lon });
  saveRecent(next.slice(0, 6));
  renderRecentChips();
}
function renderRecentChips() {
  if (!els.recentChips) return;
  const list = loadRecent();
  els.recentChips.innerHTML = '';
  for (const it of list) {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.innerHTML = `<span class="name">${it.name}</span><span class="coords">${it.lat.toFixed(2)}, ${it.lon.toFixed(2)}</span>`;
      chip.addEventListener('click', async (e) => {
          e.preventDefault(); 
          els.latInput.value = String(it.lat);
          els.lonInput.value = String(it.lon);
          els.cityInput.value = ''; 
          await doSearch();
      });
      els.recentChips.appendChild(chip);
  }
}

function openDiaryModal(item) {
  els.modalEditId.value = item.id;
  els.modalDate.value = item.date;
  els.modalNote.value = item.observacoes; 
  els.modalMood.value = item.condicoes_percebidas || ''; 
  els.modalTags.value = item.tags || '';
  
  const photoUrl = item.photoUrl || item.photo_url || '';

  els.modalPhotoUrl.value = photoUrl;
  els.modalPreview.style.display = photoUrl ? 'block' : 'none';
  if (photoUrl) { els.modalPreview.src = photoUrl; }
  
  els.diaryModal.setAttribute('aria-hidden', 'false');
}

function closeDiaryModal() {
  els.diaryModal.setAttribute('aria-hidden', 'true');
  els.modalEditId.value = '';
  els.modalPhotoFile.value = '';
}

async function saveDiaryFromModal() {
  const id = els.modalEditId.value;
  if (!id) { closeDiaryModal(); return; }
  
  const date = els.modalDate.value;
  const note = els.modalNote.value.trim();
  const mood = els.modalMood.value;  
  const tags = els.modalTags.value.trim();
  const photoUrl = els.modalPhotoUrl.value.trim(); 

  if (!date || !note) {
    showToast('Data e Observações são obrigatórias.');
    return;
  }
  
  const entryData = {
    date: date,
    tags: tags,
    observacoes: note,
    condicoes_percebidas: mood,
    photoUrl: photoUrl 
  };

  try {
    const response = await fetch(`http://localhost:3000/api/diary/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar anotação');
    }

    renderDiary(); 
    closeDiaryModal();
    showToast('Anotação atualizada.');

  } catch (err) {
    console.error(err);
    showToast(err.message || 'Erro ao atualizar anotação.');
  }
}

if (els.closeModalBtn) els.closeModalBtn.addEventListener('click', closeDiaryModal);
if (els.cancelModalBtn) els.cancelModalBtn.addEventListener('click', closeDiaryModal);
if (els.saveModalBtn) els.saveModalBtn.addEventListener('click', saveDiaryFromModal);
if (els.modalPhotoUrl) els.modalPhotoUrl.addEventListener('input', () => {
  const url = els.modalPhotoUrl.value.trim();
  if (url) {
    els.modalPreview.src = url;
    els.modalPreview.style.display = 'block';
  } else {
    els.modalPreview.src = '';
    els.modalPreview.style.display = 'none';
  }
});
if (els.modalPhotoFile) els.modalPhotoFile.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  showToast("O upload de arquivo não está configurado. Por favor, use o campo 'URL da foto'.");
  e.target.value = ''; 
  els.modalPhotoUrl.value = ''; 
});

function init() {
  els.entryDate.value = new Date().toISOString().slice(0, 10);
  renderDiary(); 
  renderLocations();
  renderRecentChips();
}

function renderDiaryStats(list) {
  if (!els.diaryStats) return;
  const total = list.length;
  const withPhoto = list.filter(x => !!x.photoUrl).length; 
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const thisMonth = list.filter(x => String(x.date).startsWith(ym)).length;
  els.diaryStats.innerHTML = '';
  const stats = [
    { label: 'Total de anotações', value: total }, 
    { label: 'Este mês', value: thisMonth },
  ];
  for (const s of stats) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `<div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div>`;
    els.diaryStats.appendChild(card);
  }
}
document.addEventListener('DOMContentLoaded', init);