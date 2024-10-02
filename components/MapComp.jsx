import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MapView, { Circle, Marker, Polygon } from 'react-native-maps'

const MapComp = ({location,region}) => {
    const VIT_LATITUDE = 12.840705871582031;
    const VIT_LONGITUDE = 80.1539077758789;  
    
    const vitChennaiPolygon = [
      { latitude: 12.84252844169831, longitude: 80.15087616357157},
      { latitude: 12.842840448604258, longitude: 80.15132835492903}, 
      { latitude: 12.843425673897842, longitude: 80.15140829659303}, 
      { latitude: 12.843495941866225, longitude: 80.15127174078874},  // North-West
      { latitude: 12.845272900669434, longitude: 80.15240201746927},
      { latitude: 12.844788565481585 , longitude: 80.1561051466986 },
      { latitude: 12.8433955825647 , longitude: 80.15852235294946 },
      { latitude: 12.837851343172668, longitude: 80.15531798138569  } ,  // South-East
      { latitude: 12.837851343172668, longitude: 80.15531798138569  }   // North-East
    ];
  return (
    <View style={{height:200,width:'100%',borderRadius:20}}>
        <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {location && (
          <Marker
            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
            title={"Your Location"}
          />
        )}
        <Polygon
          coordinates={vitChennaiPolygon}
          strokeColor="rgba(0, 0, 255, 0.5)" // Blue border
          fillColor="rgba(0, 0, 255, 0.2)"   // Light blue fill
          strokeWidth={2}
        />
      </MapView>
      </View>
  )
}

export default MapComp

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 500,
        borderRadius:20
    }
})