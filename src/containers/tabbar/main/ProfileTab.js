import React, { createRef, useState, useEffect, useReducer, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl,Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import {StackNav} from '../../../navigation/NavigationKeys';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {styles} from '../../../themes';
import images from '../../../assets/images';
import {TabNav} from '../../../navigation/NavigationKeys';
import { useFocusEffect } from '@react-navigation/native'; // Add this import
import api from '../../../api/api';
import {moderateScale} from '../../../common/constants';
import ProfilePicture from './ProfilePicture'; // Assuming ClassifiedForm is in the same directory
import AuthContext, { defaultState, reducer, restoreToken } from '../../../navigation/Type/Auth';
import LogOut from '../../../components/models/LogOut';
import {EditDark, EditLight} from '../../../assets/svgs';

const ProfileScreen = () => {
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUserData] = useState(null);
  const LogOutSheetRef = createRef();
  const [loading, setLoading] = useState(false); // Add loading state

  const [state, dispatch] = useReducer(reducer, defaultState);
  const [contentDetails, setContentDetails] = useState({
    first_name: '',
    email: '',
    mobile: '',
    password: '',
    file_name: '',

  });

  const [selectImage, setSelectImage] = useState([]);

  const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();

  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();
  const ProfilePictureSheetRef = createRef();
  const name = user?.[0]?.first_name || null;
  const contactId = user?.[0]?.contact_id || null;
  
  useEffect(() => {
    if (selectImage && selectImage.path) {
      // Only update the profile if an image has been selected
      onPressUpdate(); 
      ProfilePictureSheetRef?.current?.hide();
    }
  }, [selectImage]);
  

  useFocusEffect(
    React.useCallback(() => {
      // This will trigger every time the screen is focused
      getUser();  // Fetch the user data again
    }, [])
  );


// Function to fetch user data from AsyncStorage
const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('USER');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
    }
  } catch (error) {
    console.error('Error fetching user data from AsyncStorage:', error);
  }
};

// Handle token restoration and user fetching
useEffect(() => {
  const restore = async () => {
    try {
      await restoreToken(dispatch);
      await getUser();
    } catch (error) {
      console.error('Error restoring token:', error);
    }
  };
  restore();
}, []);

const onPressUpdate = async () => {
  setLoading(true);

  try {
    const contactId = user && user.contact_id;
    if (!selectImage?.path) {
      Alert.alert("No image selected", "Please select an image before uploading.");
      setLoading(false);
      return;
    }

    const mediaFormData = new FormData();
    mediaFormData.append('record_id', contactId);

    // Treat selectImage as an array
    const images = Array.isArray(selectImage) ? selectImage : [selectImage];

    images.forEach((image, index) => {
      mediaFormData.append(`media[${index}]`, {
        uri: image.path,
        type: image.mime,
        name: image.path.split('/').pop(), // Get image name
      });
    });

    console.log('Media FormData:', mediaFormData); // Log FormData to inspect it

    const mediaResponse = await fetch(
      'http://tamizhy.smartprosoft.com/appdev/uploadProfilePhoto.php',
      {
        method: 'POST',
        body: mediaFormData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const mediaJson = await mediaResponse.json();
    console.log("Media Upload Response:", mediaJson);

    if (mediaJson.success) {
      Alert.alert("Submission Successful", "Your post has been submitted!");
      await getUser();  // Refresh user data
      resetScreen();  
    } else {
      Alert.alert("Submission failed", mediaJson.message || "An unknown error occurred.");
    }
  } catch (error) {
    console.error("Error in onPressUpdate:", error);
    Alert.alert("An error occurred", "Please try again.");
  } finally {
    setLoading(false);
  }
};


const onPressCamera = () => {
  ImagePicker.openCamera({
    mediaType: 'photo',
    includeBase64: true,
  })
    .then(image => {
      setSelectImage(image); // Store the image directly
      // Do not call onPressUpdate() here
    })
    .catch(error => {
      console.error('Camera error:', error);
      //Alert.alert('Error', 'Failed to open camera.');
    });
};

const onPressGallery = () => {
  ImagePicker.openPicker({
    mediaType: 'photo',
    multiple: false, // Ensure it's single selection
    includeBase64: true,
  })
    .then(image => {
      setSelectImage(image); // Store the image directly
      // Do not call onPressUpdate() here
    })
    .catch(error => {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to select image.');
    });
};


const resetScreen = () => {
  navigation.reset({
    index: 0,
    routes: [
      {
        name: TabNav.ProfileTab,
      },
    ],
  });
};

    
    
  // Fetch contact details when the user is available
  useEffect(() => {
    if (user && user.contact_id) {
      api.post('getcontactById.php', { contact_id: user.contact_id })
        .then((res) => {
          const contact = res.data.data[0];
          setContentDetails({
            first_name: contact?.first_name || '',
            email: contact?.email || '',
            mobile: contact?.mobile || '',
            password: contact?.pass_word || '',
            file_name: contact?.file_name || '',

          });
        })
        .catch((err) => console.error('Error fetching contact details:', err));
    }
  }, [user]);
  //console.log("efer",contentDetails.file_name)

    // Fetch contact details when the user is available
  

  const refreshHandler = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };


  // const authContext = React.useMemo(
  //   () => ({
  //     signIn: data => {
  //       if(data){
  //         setUserData(data)
  //       }
  //       dispatch({type: 'SIGN_IN', token: data});
  //     },
  //     signOut: () => {  
  //       AsyncStorage.clear();
  //       setUserData(''); 
  //       try {
  //          RNRestart.Restart(); // Attempt to restart the application
  //       } catch (error) {
  //         console.error('Error restarting the application:', error);
  //       }
  //     },
  //     signUp: data => {
  //       dispatch({type: 'SIGN_IN', token: data});
  //     },
  //   }),
  //   [],
  // );

  if (state.isLoading) return null;

  return (
      <ScrollView
        contentContainerStyle={localStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />
        }
      >
        <View>
          <TouchableOpacity
            onPress={onPressLogOutBtn}
            style={[
              localStyles.notificationContainer,
              { borderColor: colors.dark ? colors.grayScale8 : colors.grayScale3 },
            ]}
          >
            <Text style={localStyles.logout}>Logout</Text>
          </TouchableOpacity>
          <LogOut SheetRef={LogOutSheetRef} navigation={navigation} />
        </View>

        <View style={localStyles.profileSection}>
        <TouchableOpacity
          onPress={onPressProfilePic}
          style={[styles.selfCenter, styles.mb20]}>
        {contentDetails?.file_name ? (
                 <Image
             source={{ uri: `http://tamizhy.smartprosoft.com/media/thumb/${contentDetails.file_name}`}}
               style={localStyles.profileImage}
             />
           
          ) : (
            <Image
            source={{ uri: 'http://tamizhy.smartprosoft.com/media/normal/435_9187604.png' }}
            style={localStyles.profileImage}
          />
          )}
          <View style={localStyles.editIcon}>
            {colors.dark ? <EditDark /> : <EditLight />}
          </View>
        </TouchableOpacity>
        <ProfilePicture onPressCamera={onPressCamera} onPressGallery={onPressGallery} SheetRef={ProfilePictureSheetRef} />

          <Text style={localStyles.name}>
            {contentDetails.first_name ? `Welcome ${contentDetails.first_name}` : 'Loading...'}
          </Text>
          <Text style={localStyles.email}>
            {contentDetails.email || 'Loading...'}
          </Text>
          <TouchableOpacity
            style={localStyles.editButton}
            onPress={() => navigation.navigate('EditProfile', { contactId: user?.contact_id })}
          >
            <Text style={localStyles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={localStyles.optionsContainer}>
          <TouchableOpacity style={localStyles.option}>
            <Text style={localStyles.optionText}>Forgot password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.option} onPress={() => navigation.navigate('ClassifiedHistory')}>
            <Text style={localStyles.optionText}>Classified History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.option} onPress={() => navigation.navigate('AboutScreen')}>
            <Text style={localStyles.optionText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.option} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={localStyles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  notificationContainer: {},
  profileSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Gilroy-Bold',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#8694B2',
    marginBottom: 20,
    fontFamily: 'Gilroy-Medium',
  },
  editButton: {
    backgroundColor: '#399af4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  editText: {
    color: 'white',
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
  },
  optionsContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Gilroy-Medium',
    color: '#242B48',
  },
  logoutButton: {
    marginTop: 40,
    alignItems: 'center',
  },
  logout: {
    color: '#399AF4',
    fontFamily: 'Gilroy-Medium',
    fontSize: 17,
    textAlign: 'right',
    marginTop: 15,
    marginRight: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userImageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
});

export default ProfileScreen;
