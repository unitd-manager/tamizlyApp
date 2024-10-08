import React, { createRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';

import LogOut from '../../../components/models/LogOut';

const ProfileScreen = () => {
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();
  const [user, setUserData] = useState();
  const [refreshing, setRefreshing] = useState(false); // For refresh state
  const LogOutSheetRef = createRef();

  const [contentDetails, setContentDetails] = useState({
    first_name: '',
    email: '',
    mobile: '',
    password: '',
  });

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

  const refreshHandler = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user && user.contact_id) {
      api
        .post('getcontactById.php', { contact_id: user.contact_id })
        .then((res) => {
          setContentDetails({
            first_name: res.data.data[0]?.first_name || '',
            email: res.data.data[0]?.email || '',
            mobile: res.data.data[0]?.mobile || '',
            password: res.data.data[0]?.pass_word || '',
          });
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <ScrollView
      contentContainerStyle={localStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />
      }
    >
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

      <View style={localStyles.profileSection}>
        <Image
          source={{ uri: 'http://tamizhy.smartprosoft.com/media/normal/435_9187604.png' }}
          style={localStyles.profileImage}
        />
        <Text style={localStyles.name}>
          {contentDetails && contentDetails.first_name
            ? `Welcome ${contentDetails.first_name}`
            : 'Loading...'}
        </Text>
        <Text style={localStyles.email}>
          {contentDetails && contentDetails.email ? `${contentDetails.email}` : 'Loading...'}
        </Text>
        <TouchableOpacity
          style={localStyles.editButton}
          onPress={() => navigation.navigate('EditProfile', { contactId: user?.contact_id })}
        >
          <Text style={localStyles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Options List */}
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
});

export default ProfileScreen;
