import React, {createRef,useState,useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeHeader from '../../../components/homeComponent/HomeHeader';

import EText from '../../../components/common/EText';

import {moderateScale} from '../../../common/constants';

import LogOut from '../../../components/models/LogOut';
import {styles} from '../../../themes';

const ProfileScreen = () => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const [user, setUserData] = useState();

  const LogOutSheetRef = createRef();
  const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();
  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    if (Array.isArray(userData)) {
      setUserData(userData[0]); // Access the first object in the array
    } else {
      setUserData(userData); // In case it’s not an array (for future-proofing)
    }
  };
  

  useEffect(() => {
    getUser();
  }, []);


  return (
    <View style={localStyles.container}>
      
      <TouchableOpacity
        onPress={onPressLogOutBtn}
        style={[
          localStyles.notificationContainer,
          {borderColor: colors.dark ? colors.grayScale8 : colors.grayScale3},
        ]}><Text style={localStyles.logout}>Logout</Text>
      </TouchableOpacity>
      <LogOut SheetRef={LogOutSheetRef} navigation={navigation} />
      <View style={localStyles.profileSection}>
        <Image 
          //source={imagess.sky} 
          source={{ uri: 'http://tamizhy.smartprosoft.com/media/normal/435_9187604.png' }}

          style={localStyles.profileImage} 
        />
        <Text style={localStyles.name}>{user && user.first_name ? `Welcome ${user.first_name}` : 'Loading...'}</Text>
        <Text style={localStyles.email}>{user && user.email ? `${user.email}` : 'Loading...'}</Text>
        <TouchableOpacity style={localStyles.editButton}>
          <Text style={localStyles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Options List */}
      <View style={localStyles.optionsContainer}>
        <TouchableOpacity style={localStyles.option}>
          <Text style={localStyles.optionText}>Forgot password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.option}>
          <Text style={localStyles.optionText}>Classified History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.option}>
          <Text style={localStyles.optionText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.option}>
          <Text style={localStyles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

  
      
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  notificationContainer: {
  },
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
    color:'#000',
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
    fontSize:15,
  },
  optionsContainer: {
    marginTop: 20,
    marginLeft:20,
    marginRight:20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Gilroy-Medium',
    color:'#242B48',
  },
  logoutButton: {
    marginTop: 40,
    alignItems: 'center',
  },
  logout: {
    color: '#399AF4',
    fontFamily: 'Gilroy-Medium',
    fontSize: 17,
    textAlign:'right',
    marginTop:15,
    marginRight:20,
  },
});

export default ProfileScreen;
