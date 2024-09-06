import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';

/*const posts = [
  {
    id: '1',
    name: 'John Doe',
    time: '12 min ago',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
    images: [
      { id: '1', uri: 'https://example.com/image1.jpg' },
      { id: '2', uri: 'https://example.com/image2.jpg' },
      { id: '3', uri: 'https://example.com/image3.jpg' },
    ],
  },
  {
    id: '2',
    name: 'Lisa Watson',
    time: '32 min ago',
    content: 'There are many variations of passages of Lorem Ipsum available, but the majority',
    images: [
      { id: '1', uri: 'https://example.com/image4.jpg' },
      { id: '2', uri: 'https://example.com/image5.jpg' },
      { id: '3', uri: 'https://example.com/image6.jpg' },
    ],
  },
];*/

const Post = ({ name, time, content, images }) => (
  <View style={styles.postContainer}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.time}>{time}</Text>
    <Text style={styles.content}>{content}</Text>
    <FlatList
      horizontal
      data={images}
      renderItem={({ item }) => (
        <Image source={{
            uri: `http://tamizhy.smartprosoft.com/media/normal/${item}`,
          }} style={styles.image} />
      )}
      keyExtractor={(item) => item.feed_id}
    />
  </View>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  const getUser = async () => {
    try {
      let userData = await AsyncStorage.getItem('USER');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load user data", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

useEffect(() => {
    api.get('feedlist.php')  // Replace with the correct endpoint for fetching categories
        .then(response => {
            setPosts(response.data.data);
        })
        .catch(error => {
            console.error('There was an error fetching the categories!', error);
        });
}, []);


  return (
    <View style={styles.container}>
      <HomeHeader user={user} />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post
            name={item.name}
            time='12 min ago'
            content={item.short_description}
            images={item.file_name}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    marginVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
});

export default App;
