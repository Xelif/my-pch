import React from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { moveMap, selectItem } from "../ducks/itemVisibility";

/*
* CONTENTS:
*   [default] 
*   MapContainer: redux container for the Google map
*   [other]
*   MapPanel: display container for the Google map, passes down props
*   MapDisplay: the Google map component itself
*/


/*
* MapDisplay: the actual Google map
* react-google-maps' withGoogleMap() does the nitty gritty setup work for us
*/
const MapDisplay = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={5}
    defaultCenter={{ lat: 42.224, lng: -121.278 }}
    onBoundsChanged={props.onBoundsChanged}
  >
    {props.markers.map(marker => 
      <Marker 
        key={marker.id} 
        position={marker.position} 
        label={marker.label} 
        title={marker.title} 
        onClick={() => props.onMarkerClick(marker.id)}
        defaultAnimation={2}
      />)}
    </GoogleMap>
));

/*
* MapPanel: container element for Map divs
* 
*/

export class MapPanel extends React.Component {

  // keep a reference to the map object for later use
  onMapMounted(map) {
    this._map = map;
  }
  onMapMounted = this.onMapMounted.bind(this);

  // when the map bounds are changed (move/zoom)
  // we need to dispatch an action accordingly
  onBoundsChanged() {
    this.onMapMove(this._map.getBounds(), this._map.getZoom());
  }
  onBoundsChanged = this.onBoundsChanged.bind(this);

  // for the markers, dispatch an action with the selection
  onMarkerClick(id) {
    this.selectItem(id);
  }
  onMarkerClick = this.onMarkerClick.bind(this);

  // props contains bound dispatch functions
  componentDidMount() {
    this.onMapMove = this.props.moveMap;
    this.selectItem = this.props.selectItem;
  }

  render() {
    // pass through props to the child element
    return (
      <MapDisplay
        containerElement={
          <div className="map-container" 
               style={{ height: "100%" }} />
        }
        mapElement={
          <div className="map-element"
               style={{ height: "100%" }} />
        }
        markers={this.props.markers}
        onBoundsChanged={this.onBoundsChanged}
        onMapMounted={this.onMapMounted}
        onMarkerClick={this.onMarkerClick}
      />
    );
  }
}



/*
* MapContainer: container that handles the Redux side of things
*
*/

const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// construct an array of the currently visible place markers
const mapStateToProps = function(state) {
  let sortedItems = state.items.slice()
                               .filter(item => item.visible)
                               .sort((a,b) => b.coords.lat - a.coords.lat);
  return {
    markers: sortedItems.map((item, idx) => ({
                          position: item.coords,
                          label: labels[idx],
                          title: item.itemName,
                          id: item.id,
                          selected: item.selected
                        }))
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({ moveMap, selectItem }, dispatch);
}

const MapComponent = connect(mapStateToProps, mapDispatchToProps)(MapPanel);

export default MapComponent;