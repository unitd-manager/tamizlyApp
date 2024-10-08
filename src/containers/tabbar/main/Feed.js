import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, Dimensions,Modal } from 'react-native';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';
import { moderateScale } from '../../../common/constants';
import ImageViewing from 'react-native-image-viewing';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using vector icons
import HTMLView from 'react-native-htmlview';
import flex from '../../../themes/flex';
import EText from '../../../components/common/EText'; 
import Video, {VideoRef} from 'react-native-video';
import { AudioPlayer } from './AudioPlayer';

const { width: screenWidth } = Dimensions.get('window');  // Get screen width
const VideoPlayer = ({ videoUri, visible, onClose }) => {
  const [paused, setPaused] = useState(true); // Control play/pause state

  const togglePlayPause = () => {
    setPaused(!paused);
  };
  
  return(
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.mvideoContainer}>
        <Video
          source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${videoUri}` }}
          style={styles.fullscreenVideo}
          controls={false} // We disable default controls to add our custom buttons
          paused={paused}
          resizeMode="contain"
        />
        {/* Play/Pause Button */}
        <TouchableOpacity
            onPress={togglePlayPause}
            style={styles.controlButton}
          >
            <Icon
              name={paused ? 'play' : 'pause'}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
      </View>
    </View>
  </Modal>
)};

const Post = ({ feedId, name, time, content, images, videos, audios }) => {
  //console.log('images', images);
//  const [images, setImages] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // To track the selected image index
  const [imageHeights, setImageHeights] = useState({});
  const [visibleVideo, setIsVisibleVideo] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0); // To track the selected image index
  const [videoHeights, setVideoHeights] = useState({});
  const videoRef = useRef(null);
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


  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

 

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
          {/* <Video 
    // Can be a URL or a local file.
    source={ {uri: 'http://tamizhy.smartprosoft.com/media/normal/461_SampleVideo_640x360_1mb.mp4'}}
    // Store reference  
    ref={videoRef}
    // Callback when remote video is buffering                                      
    //onBuffer={onBuffer}
    // Callback when video cannot be loaded              
    //onError={onError}               
    style={styles.backgroundVideo}
   /> */}
      </TouchableOpacity>
    );
  };

  // const handleVideoPress = (index) => {
  //   setSelectedVideoIndex(index);
  //   setIsVisibleVideo(true);
  // };

  const closeVideoModal = () => {
    setIsVisibleVideo(false);
    videoRef.current?.seek(0); // Reset video to start
  };
  // Function to navigate to the previous image
  const handlePreviousVideo = () => {
    if (selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    }
  };

  // Function to navigate to the next image
  const handleNextVideo = () => {
    if (selectedVideoIndex < videos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    }
  };

  const handleVideoLoad = (uri, width, height) => {
    const aspectRatio = height / width;
    const videoWidth = videos.length === 1 ? screenWidth : screenWidth * 0.42;
    setVideoHeights((prevHeights) => ({
      ...prevHeights,
      [uri]: videoWidth * aspectRatio, // Calculate height based on aspect ratio
    }));
  };
  const videoRefs = useRef(videos.map(() => React.createRef()));
  const [pausedStates, setPausedStates] = useState(Array(videos.length).fill(true));

  // const togglePlayPause = (index) => {
  //   setPausedStates((prev) => {
  //     const newStates = [...prev];
  //     newStates[index] = !newStates[index];
  //     return newStates;
  //   });

  //   if (pausedStates[index]) {
  //     videoRefs.current[index].current.play();
  //   } else {
  //     videoRefs.current[index].current.pause();
  //   }
  // };
  const togglePlayPause = (index) => {
    const newPausedState = !pausedStates[index];
    setPausedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = newPausedState;
      return newStates;
    });
  };
  const renderVideo = ({ item, index }) => {
    const isSingleVideo = videos.length === 1; // Check if there is only one image
    const videoWidth = screenWidth; // 100% for a single image, 45% for multiple
    const videoHeight = videoHeights[item] || screenWidth; // Adjust height based on aspect ratio or default

    return (
      <TouchableOpacity
        // onPress={() => {
        //   setIsVisibleVideo(true);
        //   setSelectedVideoIndex(index); // Set the selected image index
        // }}
        onPress={() => handleVideoPress(item)}
      >
         <View style={styles.videoContainer}>
          <Video 
          poster='http://tamizhy.smartprosoft.com/media/normal/547_Vx3PB.png'
    // Can be a URL or a local file.
    source={ {uri: `http://tamizhy.smartprosoft.com/media/normal/${item}`}}
    // Store reference  
    paused={pausedStates[index]}
    ref={videoRefs.current[index]}
    // Callback when remote video is buffering                                      
    //onBuffer={onBuffer}
    // Callback when video cannot be loaded              
    //onError={onError}    
     resizeMode="contain" // Ensures aspect ratio is maintained        
    style={styles.video} // Apply dynamic width and height
   />
         
       {/* <TouchableOpacity
        style={styles.controlButton}
        onPress={() => togglePlayPause(index)}
      >
        <Icon name={pausedStates[index] ? 'play' : 'pause'} size={30} color="#fff" />
      </TouchableOpacity> */}
   
       </View>

      </TouchableOpacity>
    );
  };
  const handleVideoPress = (video) => {
    setSelectedVideo(video);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
  };
  return (       
      <View style={styles.postContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: 'http://tamizhy.smartprosoft.com/media/normal/435_9187604.png' }}
          style={styles.userImageStyle}
        />
        <View>
          <EText type={'m15'} style={styles.name}>{name}</EText>
          <EText type={'m15'} style={styles.time}>{time}</EText>
          
        </View>
      </View>
      <HTMLView stylesheet={htmlStyles} value={content} />

      <FlatList
        data={images}
        renderItem={renderImage}
        numColumns={images.length === 1 ? 1 : 2} // Single column if only one image
        columnWrapperStyle={images.length > 1 ? styles.row : null} // Ensure correct spacing between columns for multiple images
        keyExtractor={(item, index) => index.toString()}
      /> 
 {videos.length >0 &&<FlatList
        data={videos}
        renderItem={renderVideo}
        numColumns={1} // Single column if only one image
        columnWrapperStyle={null } // Ensure correct spacing between columns for multiple images
        keyExtractor={(item, index) => index.toString()}
      />}
    
    {audios.length > 0 && (
      <>
        {audios.map((audio, index) => (
          <AudioPlayer key={index} audio={audio} />
        ))}
      </>
    )}
      
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
 {selectedVideo && (
        <VideoPlayer
          videoUri={selectedVideo}
          visible={modalVisible}
          onClose={closeModal}
        />
      )}
      <Modal
        visible={visibleVideo}
        onRequestClose={closeVideoModal}
        animationType="slide"
        transparent={false} // Set to false to take full screen
      >
        <Text>video:{videos[selectedVideoIndex]}</Text>
        <Video
          ref={videoRef}
          source={{ uri: `http://tamizhy.smartprosoft.com/media/large/${videos[selectedVideoIndex]}` }}
          style={styles.fullscreenVideo}
          controls
          resizeMode="contain"
        />
        <TouchableOpacity onPress={closeVideoModal} style={styles.closeButton}>
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    api.get('feedlist.php')  // Replace with the correct endpoint for fetching posts
      .then(response => {
        setPosts(response.data.data); 
        //console.log('video res',response.data.data)
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the posts!', error);
        setLoading(false);
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

  if ( loading ) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={"large"} color="#0000ff"  />
      </View>
    )
  }

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
            videos={Array.isArray(item.media_videos) ? item.media_videos : [item.media_videos]}
            audios={Array.isArray(item.media_audios) ? item.media_audios : [item.media_audios]}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    {/* <AudioPlayer/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Black with transparency
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'black',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop:2,
  },
  thumbnailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  content: {
    marginVertical: 12,
    fontSize: 14,
    marginBottom:-50,
    fontFamily: 'Gilroy-Medium',
  },
  image: {
    margin: 5, // Margin between images
    borderRadius: 8,
  },
  video: {
    margin: 5, // Margin between images
    padding:0,
    borderRadius: 8,
    width:'100%',
    height: 200
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  controlButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional background
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // video: {
  //   width: '100%',
  //   height: '100%',
  // },
  placeholderImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background
  },
  mvideoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure video is above the overlay
  },

  closeText: {
    color: '#fff',
    fontSize: 18,
  },
});

const htmlStyles = StyleSheet.create({
  p: {
    fontFamily: 'Gilroy-Regular', // Your custom font
    fontSize: 15,
    color:'#242B48',
    marginTop:20,
    marginBottom:-50,
  },
  h1: {
    fontFamily: 'Gilroy-Bold', // Custom font for headings
    fontSize: 20,
    color:'#242B48',
  },
  // Add other styles for different HTML elements if needed
  b: {
    fontFamily: 'Gilroy-Bold',
  },
  strong: {
    fontFamily: 'Gilroy-Bold',
  },
  
});
export default App;
