import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import API from '../api';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

export default function MapScreen({ navigation }) {
  const [spots, setSpots] = useState([]);
  const [region, setRegion] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  // 📍 Always load from Gwalior + spots
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      // Hardcoded Gwalior view
      setRegion({
        latitude: 26.2183,
        longitude: 78.1734,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      loadSpots();
    })();
  }, []);

  // Reload when screen refocuses
  useFocusEffect(
    useCallback(() => {
      loadSpots();
    }, [])
  );

  const loadSpots = async () => {
    try {
      const res = await API.get('/spots');
      setSpots(res.data);
      console.log('✅ Spots loaded:', res.data.length);
      res.data.forEach((s, i) =>
        console.log(`🔹 ${i + 1}: ${s.name} [${s.coordinates?.coordinates}]`)
      );
    } catch (error) {
      console.error('❌ Error loading spots:', error.message);
    }
  };

  const getMarkerColor = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'romantic':
        return 'pink';
      case 'serene':
        return 'skyblue';
      case 'creative':
        return 'orange';
      default:
        return 'purple';
    }
  };

  const filteredSpots = filterCategory
    ? spots.filter((s) =>
        s.category?.toLowerCase().includes(filterCategory.toLowerCase())
      )
    : spots;

  if (!region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 🧭 Filter buttons */}
      <View style={styles.smartButtons}>
        <Button title="Nearby Romantic" onPress={() => setFilterCategory('romantic')} />
        <Button title="Nearby Serene" onPress={() => setFilterCategory('serene')} />
        <Button title="All" onPress={() => setFilterCategory('')} />
      </View>

      {/* 🗂️ Category Picker */}
      <Picker
        selectedValue={filterCategory}
        onValueChange={(val) => setFilterCategory(val)}
        style={styles.picker}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Romantic" value="romantic" />
        <Picker.Item label="Serene" value="serene" />
        <Picker.Item label="Creative" value="creative" />
      </Picker>

      {/* 🗺️ Map with filtered spots */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
      >
        {filteredSpots.map((spot) => {
          const coords = spot?.coordinates?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const [lon, lat] = coords;

          return (
            <Marker
              key={spot._id}
              coordinate={{ latitude: lat, longitude: lon }}
              pinColor={getMarkerColor(spot.category)}
            >
              <Callout onPress={() => navigation.navigate('SpotDetails', { spot })}>
                <View style={{ width: 200 }}>
                  <Text style={{ fontWeight: 'bold' }}>{spot.name}</Text>
                  <Text>{spot.category}</Text>
                  <Text numberOfLines={2}>{spot.description}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* ➕ Add spot button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add Spot')}
      >
        <Text style={styles.addButtonText}>+ Add Spot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  picker: {
    marginHorizontal: 10,
    backgroundColor: '#f2f2f2',
  },
  smartButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#eee',
  },
});
