import React, {  createRef,useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Button ,Image, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import images from '../../../assets/images';
import {moderateScale} from '../../../common/constants';

import ImagePicker from 'react-native-image-crop-picker'; // New image picker library
import api from '../../../api/api'; // Assuming you have an API utility
import ProfilePicture from './ProfilePicture'; // Assuming ClassifiedForm is in the same directory

const ClassifiedForm = ({ visible, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState([]);
    const [selectImage, setSelectImage] = useState('');
    const colors = useSelector(state => state.theme.theme);

    const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();
    const ProfilePictureSheetRef = createRef();
  
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
          // includeBase64: true,
        }).then(images => {
          console.log("images",images)
          setSelectImage(images);
        });
      };
    
    //   useEffect(() => {
    //     if (selectImage && selectImage.path) {
    //       onPressUpdate();
    //     }
    //   }, [selectImage]);
      
    const onPressUpdate = async () => {
        try {
            const classifiedData = {
                title,
                description,
            };
            
            console.log("FormData:", classifiedData);
    
            // First API call: Create Classified
            const classifiedResponse = await fetch('http://tamizhy.smartprosoft.com/appdev/createClassifiedEndpoint.php', {
                method: 'POST',
                body: JSON.stringify(classifiedData),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
    
            const classifiedJson = await classifiedResponse.json();
            console.log("Classified Creation Response:", classifiedJson);
    
            const classifiedId = classifiedJson.data.id;
    
            // Second API call: Upload Media (if image is selected)
            if (selectImage && selectImage.path) {
                const mediaFormData = new FormData();
                mediaFormData.append('classified_id', classifiedId); // Pass classified_id here
                mediaFormData.append('media', {
                    type: selectImage.mime,
                    uri: selectImage.path,
                    name: selectImage.path.split('/').pop(),
                });
    
                const mediaResponse = await fetch('http://tamizhy.smartprosoft.com/appdev/uploadMedia.php', {
                    method: 'POST',
                    body:mediaFormData,

                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data', // Important!
                    },
                });
    
                const mediaJson = await mediaResponse.json();
                console.log("Media Upload Response:", mediaJson);
    
                if (mediaJson.success) {
                    Alert.alert("Classified and media uploaded successfully");
                } else {
                    Alert.alert("Classified created, but failed to upload media");
                }
            } else {
                Alert.alert("Classified created successfully");
            }
        } catch (error) {
            console.log("Error:", error);
            Alert.alert("Error occurred. Please try again.");
        }
    };
    

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />
                
             
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter description"
                    multiline
                />
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
<ProfilePicture onPressCamera={onPressCamera} onPressGallery={onPressGallery} SheetRef={ProfilePictureSheetRef} />

                <Button title="Submit" onPress={onPressUpdate} />

                <Button title="Close" onPress={onClose} color="red" />
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    userImageStyle: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(25),
      },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
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
});

export default ClassifiedForm;
