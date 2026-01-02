const token = document.querySelector('meta[name="mapbox-token"]')?.content;
const dataEl = document.getElementById('campground-data');
const campground = dataEl ? JSON.parse(dataEl.textContent) : null;

if (!token || !campground || !document.getElementById('map')) {
    console.warn('Map token or campground data missing');
} else {
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: campground.geometry?.coordinates?.length ? campground.geometry.coordinates : [15, 50],
        zoom: campground.geometry?.coordinates?.length ? 9 : 4
    });

    // marker
    if (campground.geometry?.coordinates?.length) {
        new mapboxgl.Marker()
            .setLngLat(campground.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h6>${campground.name}</h6><p>${campground.location}</p>`))
            .addTo(map);
    }

    // zoom controls (+/-)
    map.addControl(new mapboxgl.NavigationControl());
}
