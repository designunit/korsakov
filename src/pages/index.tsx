import { NextPage } from "next"
import { useEffect, useRef } from "react"
import mapboxgl, { LngLatLike, maxParallelImageRequests } from "mapbox-gl"

const key = 'pk.eyJ1IjoidG1zaHYiLCJhIjoiZjYzYmViZjllN2MxNGU1OTAxZThkMWM5MTRlZGM4YTYifQ.uvMlwjz7hyyY7c54Hs47SQ'

function app(container: any) {
    mapboxgl.accessToken = key
    const center: LngLatLike = [
        142.79405865469897,
        46.6188040383542,
    ]
    var map = new mapboxgl.Map({
        // style: 'mapbox://styles/mapbox/light-v10',
        style: 'mapbox://styles/mapbox/satellite-v9', // style URL
        // style: 'mapbox://styles/grigorybbb/8sy4fqrv',
        center,
        zoom: 14.11258863317506,
        pitch: 57.99999999999994,
        bearing: -8.799999999999962,
        container,
        // container: 'map',
        antialias: true,
    });

    map.on('moveend', event => {
        console.log({
            center: map.getCenter(),
            zoom: map.getZoom(),
            pitch: map.getPitch(),
            bearing: map.getBearing(),
        })
    })

    map.on('load', function () {
        map.addSource('korsakov-buildings', {
            type: 'geojson',
            // Use a URL for the value for the `data` property.
            data: '/static/osm_buildings_export_3.geojson'
        });
        map.addSource('korsakov-buildings2', {
            type: 'geojson',
            // Use a URL for the value for the `data` property.
            data: '/static/test.geojson',
        });
        map.addSource('korsakov-green', {
            type: 'geojson',
            data: '/static/test-green.geojson',
        });

        // for vector mapbox style
        // map.setLayoutProperty('building', 'visibility', 'none');
        // map.setLayoutProperty('building-outline', 'visibility', 'none');

        // Add terrain source, with slight exaggeration
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.terrain-rgb',
            'tileSize': 512,
            'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // map.addSource('korsakov-tiles', {
        //     url: "mapbox://grigorybbb.8sy4fqrv",
        //     type: "raster",
        //     tileSize: 256,
        // });
        // map.addLayer({
        //     "id": "kt",
        //     "type": "raster",
        //     "paint": {},
        //     "layout": {},
        //     "source": "korsakov-tiles",
        // })

        // map.setPaintProperty( 'building', 'minzoom', 10);

        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers!;
        var labelLayerId;
        // for (var i = 0; i < layers.length; i++) {
        //     if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        //         labelLayerId = layers[i].id;
        //         break;
        //     }
        // }

        // The 'building' layer in the Mapbox Streets
        // vector tileset contains building height data
        // from OpenStreetMap.
        map.addLayer(
            {
                'id': 'add-3d-buildings',
                'source': 'korsakov-buildings',
                // 'source': 'composite',
                // 'source-layer': 'building',
                // 'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 10,
                'paint': {
                    // 'fill-extrusion-color': '#f0f',
                    'fill-extrusion-color': '#fffff0',
                    'fill-extrusion-height': ['*',
                        3,
                        ['get', 'building_height'],
                    ],

                    // Use an 'interpolate' expression to
                    // add a smooth transition effect to
                    // the buildings as the user zooms in.
                    // 'fill-extrusion-height': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['zoom'],
                    //     15,
                    //     0,
                    //     15.05,
                    //     ['get', 'building_height']
                    // ],
                    // 'fill-extrusion-base': 1,
                    // 'fill-extrusion-base': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['zoom'],
                    //     15,
                    //     0,
                    //     15.05,
                    //     ['get', 'min_height']
                    // ],
                    // 'fill-extrusion-opacity': 0.6
                }
            },

            labelLayerId
        )

        map.addLayer(
            {
                'id': 'add-3d-buildings2',
                'source': 'korsakov-buildings2',
                'type': 'fill-extrusion',
                'minzoom': 10,
                'paint': {
                    'fill-extrusion-color': '#f0f',
                    'fill-extrusion-height': ['*',
                        0.75,
                        ['get', 'height'],
                    ],
                    'fill-extrusion-base': ['get', 'offset'],
                }
            },

            labelLayerId
        )

        map.addLayer(
            {
                'id': 'korsakov-green',
                'source': 'korsakov-green',
                'type': 'fill',
                'minzoom': 10,
                'paint': {
                    'fill-color': '#27831e',
                    'fill-opacity': 0.8,
                }
            },

            labelLayerId
        )
        // map.addLayer({
        //     'id': 'buildings-i1',
        //     'type': 'line',
        //     'source': 'korsakov-buildings',
        //     'layout': {
        //         'line-join': 'round',
        //         'line-cap': 'round'
        //     },
        //     'paint': {
        //         'line-color': '#ff69b4',
        //         'line-width': 1
        //     }
        // });
    })
}

const Page: NextPage = () => {
    const ref = useRef()

    useEffect(() => {
        app(ref.current)
    }, [])

    return (
        <>
            <div ref={ref as any} style={{
                width: '100%',
                height: '100%',
            }}></div>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }}>
                <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                    <h1 className="text-6xl font-bold">
                        Welcome to{' '}
                        <a className="text-blue-600" href="https://nextjs.org">
                            Next.js!
                        </a>
                    </h1>

                    <p className="mt-3 text-2xl">
                        Get started by editing{' '}
                        <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
                            pages/index.js
                        </code>
                    </p>

                    <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
                        <a
                            href="https://nextjs.org/docs"
                            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
                        >
                            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
                            <p className="mt-4 text-xl">
                                Find in-depth information about Next.js features and API.
                            </p>
                        </a>

                        <a
                            href="https://nextjs.org/learn"
                            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
                        >
                            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
                            <p className="mt-4 text-xl">
                                Learn about Next.js in an interactive course with quizzes!
                            </p>
                        </a>

                        <a
                            href="https://github.com/vercel/next.js/tree/master/examples"
                            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
                        >
                            <h3 className="text-2xl font-bold">Examples &rarr;</h3>
                            <p className="mt-4 text-xl">
                                Discover and deploy boilerplate example Next.js projects.
                            </p>
                        </a>

                        <a
                            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
                        >
                            <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
                            <p className="mt-4 text-xl">
                                Instantly deploy your Next.js site to a public URL with Vercel.
                            </p>
                        </a>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Page
