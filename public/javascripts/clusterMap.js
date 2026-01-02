document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("cluster-map");
    if (!el) return;

    mapboxgl.accessToken = window.mapToken;

    const map = new mapboxgl.Map({
        container: "cluster-map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [15, 50], // Israel-ish default (lng, lat)
        zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
        map.addSource("campgrounds", {
            type: "geojson",
            data: window.campgroundsGeoJSON,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
        });

        // Clusters
        map.addLayer({
            id: "clusters",
            type: "circle",
            source: "campgrounds",
            filter: ["has", "point_count"],
            paint: {
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#51bbd6",
                    10, "#f1f075",
                    30, "#f28cb1"
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    18,
                    10, 24,
                    30, 30
                ]
            }
        });


        // Cluster count text
        map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "campgrounds",
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-size": 12,
            },
        });

        // Individual points (unclustered)
        map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "campgrounds",
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-radius": 7,
                "circle-stroke-width": 1,
            },
        });

        // Click a cluster → zoom into it
        map.on("click", "clusters", (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
            const clusterId = features[0].properties.cluster_id;

            map.getSource("campgrounds").getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;
                map.easeTo({ center: features[0].geometry.coordinates, zoom });
            });
        });

        // Click a single point → go to show page
        map.on("click", "unclustered-point", (e) => {
            const props = e.features[0].properties;
            const id = props.id;
            window.location.href = `/campgrounds/${id}`;
        });

        map.on("mouseenter", "clusters", () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "clusters", () => (map.getCanvas().style.cursor = ""));
        map.on("mouseenter", "unclustered-point", () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "unclustered-point", () => (map.getCanvas().style.cursor = ""));
    });
});
