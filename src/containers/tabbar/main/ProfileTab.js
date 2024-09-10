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
        ]}>
        <Ionicons
          name={'log-out-outline'}
          size={moderateScale(28)}
          color={colors.redColor}
          style={{backgroundColor:'#fff',padding:5,borderRadius:50}}
        /> 
      </TouchableOpacity>
      <LogOut SheetRef={LogOutSheetRef} navigation={navigation} />
      <View style={localStyles.profileSection}>
        <Image 
          //source={imagess.sky} 
          source={require('../../../assets/images/sky.jpg')}

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
    backgroundColor: '#f9fbff',
    paddingHorizontal: 20,
  },
  notificationContainer: {
    ...styles.center,
    ...styles.ph10,
    ...styles.pv10,
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
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 40,
    alignItems: 'center',
  },
  logoutText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
