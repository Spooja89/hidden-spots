// frontend/screens/AddSpotScreen.js
import API from '../api';
import React, { useState, useEffect } from 'react';
import {
  View, TextInput, StyleSheet, ScrollView,
  Button, Text, Alert, Image, TouchableOpacity
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function AddSpotScreen({ navigation }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [coords, setCoords] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  // Get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "We need your location to tag the spot.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setCoords(loc.coords);
    })();
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async () => {
  if (!imageUri) return null;

  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'spot.jpg',
  });

  formData.append('upload_preset', 'hiddenspots_preset');

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dblgko6of/image/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // ❌ DO NOT manually set 'Content-Type' — let fetch handle it
      },
    });

    const data = await response.json();

    if (data.secure_url) {
      console.log('✅ Uploaded to Cloudinary:', data.secure_url);
      return data.secure_url;
    } else {
      console.error('❌ Cloudinary response error:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Upload failed:', error);
    return null;
  }
};


  // Submit spot to backend
  const handleSubmit = async () => {
    if (!name || !category || !description || !story || !coords) {
      Alert.alert("Missing Info", "Please fill out all fields and allow location access.");
      return;
    }

    const imageUrl = await uploadImageToCloudinary();

    const newSpot = {
      name,
      category,
      description,
      story,
      coordinates: {
        type: 'Point',
        coordinates: [coords.longitude, coords.latitude],
      },
      ratings: {
        vibe: 0,
        safety: 0,
        uniqueness: 0,
        crowd: 0,
      },
      images: imageUrl ? [imageUrl] : [],
      comments: [],
    };

    try {
      const res = await API.post('/spots', newSpot);
      Alert.alert("✅ Success", "Spot added to database!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error submitting spot:", error.message);
      Alert.alert("Error", "Failed to submit spot");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Category (e.g. Romantic, Serene...)" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Short Description" value={description} onChangeText={setDescription} />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Share your story here..."
        value={story}
        onChangeText={setStory}
        multiline
      />
      
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
        <Text style={{ color: 'blue' }}>📸 Pick an Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 10 }} />
      )}

      <Text style={styles.coords}>
        📍 Location: {coords ? `${coords.latitude}, ${coords.longitude}` : "Getting..."}
      </Text>
      <Button title="Submit Spot" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
  },
  coords: {
    marginVertical: 10,
    fontSize: 12,
    color: '#555'
  }
});
