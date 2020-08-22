import React from 'react'
import { Map as LeafLetMap, TileLayer } from 'react-leaflet';

import { showDataOnMap } from '../util';

import './Map.css';

const Map = ({ countries, casesType, center, zoom }) => {
    return(
        <div className="map">
            <LeafLetMap center={center} zoom={zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreet</a> Contributors'
                    />     

                    {/* Loop through countries & draw circles */}
                    { showDataOnMap(countries, casesType) }

            </LeafLetMap>
        </div>
    )   
}

export default Map
