import React, {  createRef,useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Button ,Image, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import images from '../../../assets/images';
import {moderateScale} from '../../../common/constants';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ImagePicker from 'react-native-image-crop-picker'; // New image picker library
import api from '../../../api/api'; // Assuming you have an API utility
import ProfilePicture from './ProfilePicture'; // Assuming ClassifiedForm is in the same directory
import EButton from '../../../components/common/EButton';
import Toast from 'react-native-toast-message';

const ClassifiedForm = ({ visible, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [mobile, setMobile] = useState('');
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState([]);
    const [selectImage, setSelectImage] = useState([]);
    const colors = useSelector(state => state.theme.theme);
    const [regionFilter, setRegionFilter] = useState('ALL');
    const [valuelistRegion, setValuelistRegion] = useState([]);
    const [locationFilter, setLocationFilter] = useState('ALL');
    const [valuelistLocation, setValuelistLocation] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [valuelistCategory, setValuelistCategory] = useState([]);
    const [user, setUser] = useState(null);

    const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();
    const ProfilePictureSheetRef = createRef();
    const name = user?.[0]?.first_name || null;
    const contactId = user?.[0]?.contact_id || null;
    
    useEffect(() => {
      ProfilePictureSheetRef?.current?.hide();
    }, [selectImage]);

    const onPressCamera = () => {
        ImagePicker.openCamera({
          // cropping: true,
          mediaType: 'photo',
          includeBase64: true,
        }).then(image => {
          setSelectImage(image);
        });
      };

  
      const onPressGallery = () => {
        ImagePicker.openPicker({
          mediaType: 'photo',
          multiple: true,
          includeBase64: true,
        }).then(images => {
          const totalSelectedImages = selectImage.length + images.length;
      
          if (totalSelectedImages > 5) {
            Alert.alert("You can only select a maximum of 5 images.");
          } else {
            setSelectImage([...selectImage, ...images]);
          }
        }).catch(error => {
          console.log('Image selection cancelled or error occurred:', error);
        });
      };
      

      const getClose = () => {
        setCategoryFilter('ALL')
        setRegionFilter('ALL')
        setLocationFilter('ALL')
        setTitle('')
        setDescription('')
        setMobile('')
        onClose()
      };

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
    
    //   useEffect(() => {
    //     if (selectImage && selectImage.path) {
    //       onPressUpdate();
    //     }
    //   }, [selectImage]);
    const getValuelistRegion = () => {
      api
        .get('selectRegion.php')
        .then((res) => {
          setValuelistRegion(res.data.data);
        })
        .catch((error) => {
          console.log('valuelist not found:', error);
        });
    };
    const getValuelistLocation = () => {
      api.post('selectLocation.php', {
          region: regionFilter,
      }).then((res) => {
          setValuelistLocation(res.data.data);
        })
        .catch((error) => {
          console.log('valuelist not found:', error);
        });
    };
    const getValuelistCategory = () => {
      api
        .get('dropdowncategory.php')
        .then((res) => {
          setValuelistCategory(res.data.data);
        })
        .catch((error) => {
          console.log('valuelist not found:', error);
        });
    };
    useEffect(() => {
      getValuelistLocation()
      getValuelistRegion()
      getValuelistCategory()
    }, [regionFilter]);
          
    const onPressUpdate = async () => {
      if (categoryFilter === 'ALL') {
        Alert.alert("Please select the category");
        return;
      }
      if (regionFilter === 'ALL') {
        Alert.alert("Please select the region");
        return;
      }
      if (locationFilter === 'ALL') {
        Alert.alert("Please select the location");
        return;
      }
      if (title === '') {
        Alert.alert("Please enter the title");
        return;
      }
      if (description === '') {
        Alert.alert("Please enter the description");
        return;
      }
      if (mobile === '') {
        Alert.alert("Please enter the mobile");
        return;
      }
    
      try {
        const classifiedData = {
          title,
          description,
          mobile,
          category_id: categoryFilter,
          region: regionFilter,
          location: locationFilter,
          contact_id: contactId,
          created_by: name,
        };
    
        console.log("FormData:", classifiedData);
    
        // First API call: Create Classified
        const classifiedResponse = await fetch(
          'http://tamizhy.smartprosoft.com/appdev/createClassifiedEndpoint.php',
          {
            method: 'POST',
            body: JSON.stringify(classifiedData),
            headers: {
              Accept: 'application/json',
            },
          }
        );
    
        const classifiedJson = await classifiedResponse.json();
        console.log("Classified Creation Response:", classifiedJson);
    
        const classifiedId = classifiedJson.data.id;
    
        // Second API call: Upload Media (if image is selected)
        if (selectImage.length > 0) {
          const mediaFormData = new FormData();
          mediaFormData.append('record_id', classifiedId); // Classified ID from the previous API call
    
          // Iterate over each image and append to FormData
          selectImage.forEach((image, index) => {
            mediaFormData.append(`media[${index}]`, {
              uri: image.path,
              type: image.mime,
              name: image.path.split('/').pop(), // Get image name
            });
          });
    
          try {
            const mediaResponse = await fetch(
              'http://tamizhy.smartprosoft.com/appdev/uploadMedia.php',
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
              Alert.alert("Classified and media uploaded successfully");
            } else {
              Alert.alert("Classified created, but failed to upload media");
            }
          } catch (error) {
            console.log("Error uploading media:", error);
            Alert.alert("Error uploading media. Please try again.");
          }
        } else {
          Alert.alert("Classified created successfully, no media uploaded.");
        }
    
        getClose();
      } catch (error) {
        console.log("Error:", error);
        Alert.alert("Error occurred. Please try again.");
      }
    };
    
    
    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={categoryFilter}
                    dropdownIconColor="#8694B2"
                    onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Category" value="ALL" style={styles.pickerItem}/>
                    {valuelistCategory.map((item) => (
                        <Picker.Item key={item.category_title} label={item.category_title} value={item.category_id} style={styles.pickerItem} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={regionFilter}
                    dropdownIconColor="#8694B2"
                    onValueChange={(itemValue) => setRegionFilter(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Region" value="ALL" style={styles.pickerItem}/>
                    {valuelistRegion.map((item) => (
                        <Picker.Item key={item.value} label={item.value} value={item.value} style={styles.pickerItem} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={locationFilter}
                        dropdownIconColor="#8694B2"
                        onValueChange={(itemValue) => setLocationFilter(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Location" value="ALL" style={styles.pickerItem}/>
                        {valuelistLocation?.map((item) => (
                            <Picker.Item key={item.value} label={item.value} value={item.value} style={styles.pickerItem} />
                        ))}
                    </Picker>
                </View>

                <TextInput style={[styles.input, { height: 45, marginTop:10, }]} value={title} onChangeText={setTitle} placeholderTextColor='#8694B2' placeholder="Title" />                             
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    placeholderTextColor='#8694B2'
                    multiline
                />
                <TextInput style={[styles.input, { height: 45, color:'#8694B2', }]} value={mobile} onChangeText={setMobile} placeholderTextColor='#8694B2' placeholder="Mobile" />                             
                <TouchableOpacity onPress={onPressProfilePic} style={[styles.selfCenter, styles.mb20]}>
                  {!!selectImage?.path ? (
                    <Image
                      source={{ uri: selectImage?.path }}
                      style={styles.userImageStyle}
                    />
                  ) : (
                    <Image
                      source={colors.dark ? images.userDark : images.userLight}
                      style={styles.userImageStyle}
                    />
                  )}
                </TouchableOpacity> 
                <View style={styles.imageContainer}>
  {selectImage.map((image, index) => (
    <Image
      key={index}
      source={{ uri: image.path }}
      style={styles.userImageStyle}
    />
  ))}
</View>

                <ProfilePicture onPressCamera={onPressCamera} onPressGallery={onPressGallery} SheetRef={ProfilePictureSheetRef} />
                <View style={styles.btnContainer}>
                    <EButton title="Update" onPress={onPressUpdate} containerStyle={styles.submitBtn}/>

                    {/* Button to Close Modal */}
                    <TouchableOpacity onPress={getClose}>
                      <Text style={styles.closeModalText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        paddingTop: 20,
        backgroundColor: '#fff',
        paddingHorizontal:30,
    },
    userImageStyle: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(25),
      },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: 'Gilroy-Medium',
        color:'#8694B2',
      },
    input: {
        borderWidth: 1,
        borderColor: '#8694B2',
        padding: 10,
        marginBottom: 16,
        borderRadius: 5,
    },
    mediaUpload: {
        padding: 15,
        backgroundColor: '#eee',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
    },
    pickerContainer: {
      borderColor: '#8694B2',
      borderWidth: 0.5,
      borderRadius: 3,
      marginVertical: 10,
      width: '100%',
      borderRadius: 8,
      height:45,
      justifyContent: 'center',
    },
    picker: {
    },
    pickerItem: {
      color: '#8694B2', 
      fontSize:14,
      fontFamily: 'Gilroy-Medium',
    },
    submitBtn: {
      borderRadius:10,
      paddingHorizontal:50,
    },
    closeModalText: {
      color: '#399AF4',
      marginTop: 20,
      fontSize: 16,
      fontFamily: 'Gilroy-Medium',
    },
    btnContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',    
  },
});

export default ClassifiedForm;
