import React, { useEffect, useRef } from 'react'
import mapboxgl, { LngLatLike, AnySourceData } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { DirectionsResponse } from '@/types/RouteResponseApi'

interface Props {
  mapOptions?: mapboxgl.MapboxOptions
  route?: DirectionsResponse
  center?: LngLatLike
  controls?: boolean
  originMarkerColor?: string
  destinationMarkerColor?: string
}

/**
 * Initializes and configures a map using MapboxGL and displays routes and markers.
 *
 * @param mapOptions - options to customize the map
 * @param route - route to be displayed on the map
 * @param center - center of the map
 * @param controls - whether to add controls to the map
 * @param originMarkerColor - color of the origin marker
 * @param destinationMarkerColor - color of the destination marker
 * @return {JSX.Element} the map component
 */
export function Map({ mapOptions, route, ...props }: Props): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Map Definition

    if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS
    }
    const map = new mapboxgl.Map({
      container: mapRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 10,
      ...mapOptions,
      center: (mapOptions && mapOptions.center) ||
        props.center || [-99.1332, 19.4326],
    })

    // Add controls
    if (props.controls) {
      map.addControl(new mapboxgl.FullscreenControl())

      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true,
      })
      map.addControl(nav, 'bottom-right')
    }

    if (route) {
      // Add markers to the map

      const origin = route && route.waypoints[0].location
      const destination = route && route.waypoints[1].location

      const originMarker = new mapboxgl.Marker({
        color: props.originMarkerColor || 'red',
        offset: [0, 0],
      })
      originMarker.setLngLat(origin)
      originMarker.addTo(map)

      const destinationMarker = new mapboxgl.Marker({
        offset: [0, 0],
        color: props.destinationMarkerColor || 'blue',
      })
      destinationMarker.setLngLat(destination)
      destinationMarker.addTo(map)

      // Add Polyline to the map

      const bounds = new mapboxgl.LngLatBounds(origin, destination)
      const coords = route.routes[0].geometry.coordinates

      for (const coord of coords) {
        bounds.extend(coord as LngLatLike)
      }

      map.fitBounds(bounds, {
        padding: 50,
      })

      // draw the lines
      const sourceData: AnySourceData = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coords,
              },
            },
          ],
        },
      }

      // Add the route to the map when it's loaded
      map.on('load', () => {
        map.addSource('route', sourceData)

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': 'blue',
            'line-width': 5,
          },
        })
      })
    }

    return () => map.remove()
  }, [])

  return (
    <div
      ref={mapRef}
      className='flex-1 rounded-lg overflow-hidden max-h-[90%]'></div>
  )
}
