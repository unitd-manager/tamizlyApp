import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';
import { moderateScale } from '../../../common/constants';
import ImageViewing from 'react-native-image-viewing';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using vector icons
import HTMLView from 'react-native-htmlview';
import flex from '../../../themes/flex';

const { width: screenWidth } = Dimensions.get('window');  // Get screen width
const Post = ({ feedId, name, time, content, images }) => {
  console.log('images', images);
//  const [images, setImages] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // To track the selected image index
  const [imageHeights, setImageHeights] = useState({});
  /*useEffect(() => {
    api.post('feedlistImages.php', { feed_id: feedId })  // Replace with the correct endpoint for fetching images
      .then(response => {
        setImages(response.data.data); // Assuming response.data.data contains the image array
      })
      .catch(error => {
        console.error('There was an error fetching the images!', error);
      });
  }, []);*/

  // Function to navigate to the previous image
  const handlePrevious = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Function to navigate to the next image
  const handleNext = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleImageLoad = (uri, width, height) => {
    const aspectRatio = height / width;
    const imageWidth = images.length === 1 ? screenWidth : screenWidth * 0.42;
    setImageHeights((prevHeights) => ({
      ...prevHeights,
      [uri]: imageWidth * aspectRatio, // Calculate height based on aspect ratio
    }));
  };

  const renderImage = ({ item, index }) => {
    const isSingleImage = images.length === 1; // Check if there is only one image
    const imageWidth = isSingleImage ? screenWidth * 0.87 : screenWidth * 0.42; // 100% for a single image, 45% for multiple
    const imageHeight = imageHeights[item] || (isSingleImage ? screenWidth * 0.6 : screenWidth * 0.5); // Adjust height based on aspect ratio or default

    return (
      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
          setSelectedImageIndex(index); // Set the selected image index
        }}
      >
        <Image
          source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item}` }}
          style={[styles.image, { width: imageWidth, height: imageHeight }]} // Apply dynamic width and height
          resizeMode="contain" // Ensures aspect ratio is maintained
          onLoad={(e) => {
            const { width, height } = e.nativeEvent.source;
            handleImageLoad(item, width, height); // Handle image load to calculate aspect ratio
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.postContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: 'http://tamizhy.smartprosoft.com/media/normal/435_9187604.png' }}
          style={styles.userImageStyle}
        />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <HTMLView style={[styles.content, { color: 'blue' }]} value={content} />

      <FlatList
        data={images}
        renderItem={renderImage}
        numColumns={images.length === 1 ? 1 : 2} // Single column if only one image
        columnWrapperStyle={images.length > 1 ? styles.row : null} // Ensure correct spacing between columns for multiple images
        keyExtractor={(item, index) => index.toString()}
      />

{images.length > 0 && (
  <ImageViewing
    images={images.map((img) => ({ uri: `http://tamizhy.smartprosoft.com/media/large/${img}` }))}
    imageIndex={selectedImageIndex}
    visible={visible}
    onRequestClose={() => setIsVisible(false)}
    FooterComponent={() => (
      <View style={styles.footerContainer}>
        {selectedImageIndex > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={styles.previousButton}>
            <Icon name="chevron-left" size={30} color="#fff" />
          </TouchableOpacity>
        )}
        {selectedImageIndex < images.length - 1 && (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Icon name="chevron-right" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    )}
  />
)}
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

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
    api.get('feedlist.php')  // Replace with the correct endpoint for fetching posts
      .then(response => {
        setPosts(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the posts!', error);
      });
  }, []);

  const formatDateTime = (creationDate) => {
    const date = new Date(creationDate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // use false for 24-hour format
    }).format(date);
  };

  return (
    <View style={styles.container}>
      <HomeHeader user={user} />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post
            feedId={item.feed_id}
            name={item.name}
            time={formatDateTime(item.creation_date)}
            content={item.description}
            images={Array.isArray(item.media_files) ? item.media_files : [item.media_files]}
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
    paddingBottom: 30,
    marginLeft:-8,
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
    marginBottom:-50,
  },
  image: {
    margin: 5, // Margin between images
    borderRadius: 8,
  },
  userImageStyle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(25),
    marginRight: 15,
  },
  footerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    bottom: 50, // Adjust based on the position you want
  },
  previousButton: {
    position: 'absolute',
    left: 10,
  },
  nextButton: {
    position: 'absolute',
    right: 10,
  },
});

export default App;
