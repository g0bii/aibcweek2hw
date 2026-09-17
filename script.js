const clocks = [
  { city: 'Charlotte', zone: 'America/New_York', label: 'EDT' },
  { city: 'London', zone: 'Europe/London', label: 'BST' },
  { city: 'Mumbai', zone: 'Asia/Kolkata', label: 'IST' },
  { city: 'Tokyo', zone: 'Asia/Tokyo', label: 'JST' },
];

const grid = document.querySelector('#clock-grid');
grid.innerHTML = clocks.map(({ city, zone, label }) => `
  <article class="clock">
    <div class="city"><span>${city.toUpperCase()}</span><span class="zone">${label}</span></div>
    <time class="time" data-zone="${zone}">--:--:--</time>
    <span class="day" data-day="${zone}">LOADING</span>
  </article>`).join('');

function format(zone, options) {
  return new Intl.DateTimeFormat('en-US', { timeZone: zone, ...options }).format(new Date());
}
function updateTime() {
  document.querySelectorAll('[data-zone]').forEach((item) => {
    item.textContent = format(item.dataset.zone, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  });
  document.querySelectorAll('[data-day]').forEach((item) => {
    item.textContent = format(item.dataset.day, { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
  });
  document.querySelector('#utc-time').textContent = `UTC — ${format('UTC', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
  document.querySelector('#local-date').textContent = format(Intl.DateTimeFormat().resolvedOptions().timeZone, { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
}
updateTime();
setInterval(updateTime, 1000);
