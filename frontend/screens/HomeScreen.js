import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import API from '../api';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();

    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await API.get('/spots');
      setSpots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          {spots.map((spot, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: spot.coordinates.coordinates[1],
                longitude: spot.coordinates.coordinates[0],
              }}
              title={spot.name}
              description={spot.description}
            />
          ))}
        </MapView>
      )}
      <View style={styles.addButton}>
        <Button title="Add Spot" onPress={() => navigation.navigate('Add Spot')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
