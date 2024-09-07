import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';
import {moderateScale} from '../../../common/constants';

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

const Post = ({ feedId, name, time, content }) => {
    // Log images to console to check if they are being passed correctly
    const [images, setImages] = useState([]);
    useEffect(() => {
        api.post('feedlistImages.php',{feed_id :feedId})  // Replace with the correct endpoint for fetching categories
            .then(response => {
                setImages(response.data.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []);

    console.log('images array:', images);
    
    return (
      <View style={styles.postContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
            source={{uri: 'http://tamizhy.smartprosoft.com/media/normal/434_images.jpg'}}
            style={styles.userImageStyle}
            />
            <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>
        </View>
        <Text style={styles.content}>{content}</Text>
        <FlatList
          data={images}
          renderItem={({ item }) => {
            console.log('image item', item); // Log each image item
            return (
              <Image
                source={{
                  uri: `http://tamizhy.smartprosoft.com/media/normal/${item.file_name}`,
                }}
                style={styles.image}
              />
            );
          }}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()} // Using index if item doesn't have a unique key
        />
      </View>
    );
  };
  
  

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
console.log('print',posts);
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
            feedId={item.feed_id}
            name={item.name}
            time='12 min ago'
            content={item.short_description}
            images={Array.isArray(item.file_name) ? item.file_name : [item.file_name]}
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
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomColor: '#f3f4f6',
    borderBottomWidth: 2,
    paddingBottom:30
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
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
    width: 170,
    height: 170,
    marginRight: 10,
    marginBottom:5,
    borderRadius: 8,
    marginTop:5,
  },
  userImageStyle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(25),
    marginRight:15,
  },
});

export default App;
