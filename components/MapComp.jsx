import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MapView, { Circle, Marker } from 'react-native-maps'

const MapComp = ({location,region}) => {
    const VIT_LATITUDE = 12.840705871582031;
    const VIT_LONGITUDE = 80.1539077758789;
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
        <Circle
          center={{ latitude: VIT_LATITUDE, longitude: VIT_LONGITUDE }}
          radius={1000}
          strokeColor="rgba(0, 0, 255, 0.5)" 
          fillColor="rgba(0, 0, 255, 0.2)"
        />
      </MapView>
      </View>
  )
}

export default MapComp

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 200,
        borderRadius:20
    }
})