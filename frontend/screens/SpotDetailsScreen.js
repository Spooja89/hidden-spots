import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import API from '../api'; // Axios instance

export default function SpotDetailsScreen({ route }) {
  const { spot } = route.params;

  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [comments, setComments] = useState(spot.comments || []);
  const [ratingsInput, setRatingsInput] = useState({
    vibe: 3,
    safety: 3,
    uniqueness: 3,
    crowd: 3,
  });

  const handleAddComment = () => {
    if (!comment.trim()) {
      Alert.alert('Comment required', 'Please enter something to share.');
      return;
    }

    const newComment = {
      name: name.trim() || 'Anonymous',
      text: comment,
    };

    setComments((prev) => [...prev, newComment]);
    setComment('');
    setName('');
  };

  const handleSubmitRatings = async () => {
    try {
      const res = await API.post(`/spots/${spot._id}/rate`, ratingsInput);
      Alert.alert("✅ Success", "Your rating was submitted!");
    } catch (err) {
      console.error("Rating submission failed:", err.message);
      Alert.alert("❌ Error", "Could not submit rating.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{spot.name}</Text>
      <Text style={styles.category}>Category: {spot.category}</Text>

      <Text style={styles.label}>📍 Coordinates:</Text>
      <Text style={styles.text}>
        {spot.coordinates?.coordinates?.[1]}, {spot.coordinates?.coordinates?.[0]}
      </Text>

      <Text style={styles.label}>📖 Story:</Text>
      <Text style={styles.text}>{spot.story}</Text>

      <Text style={styles.label}>📝 Description:</Text>
      <Text style={styles.text}>{spot.description}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>⭐ Current Ratings:</Text>
        <Text style={styles.text}>
          Vibe: {spot.ratings?.vibe ?? 0} | Safety: {spot.ratings?.safety ?? 0} | Uniqueness: {spot.ratings?.uniqueness ?? 0} | Crowd: {spot.ratings?.crowd ?? 0}
        </Text>
      </View>

      {spot.images && spot.images.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>🖼️ Images:</Text>
          {spot.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>🎯 Rate This Spot</Text>

        {['vibe', 'safety', 'uniqueness', 'crowd'].map((key) => (
          <View key={key} style={{ marginBottom: 15 }}>
            <Text style={styles.text}>{key.toUpperCase()}: {ratingsInput[key]}</Text>
            <Slider
              style={{ width: '100%' }}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={ratingsInput[key]}
              onValueChange={(value) =>
                setRatingsInput((prev) => ({ ...prev, [key]: value }))
              }
            />
          </View>
        ))}

        <Button title="Submit Ratings" onPress={handleSubmitRatings} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>💬 Comments</Text>

        {comments.map((item, i) => (
          <View key={i} style={styles.commentBox}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.text}</Text>
          </View>
        ))}

        <TextInput
          placeholder="Your name (optional)"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Write a comment..."
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <Button title="Add Comment" onPress={handleAddComment} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 16,
    color: '#666',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  section: {
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    padding: 10,
    borderRadius: 6,
  },
  commentBox: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 6,
    marginBottom: 5,
  },
});
