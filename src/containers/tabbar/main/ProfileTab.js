import React, { createRef, useState, useEffect, useReducer, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import {StackNav} from '../../../navigation/NavigationKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';
import AuthContext, { defaultState, reducer, restoreToken } from '../../../navigation/Type/Auth';
import LogOut from '../../../components/models/LogOut';

const ProfileScreen = () => {
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUserData] = useState(null);
  const LogOutSheetRef = createRef();
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [contentDetails, setContentDetails] = useState({
    first_name: '',
    email: '',
    mobile: '',
    password: '',
  });

  const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();

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
          });
        })
        .catch((err) => console.error('Error fetching contact details:', err));
    }
  }, [user]);

  const refreshHandler = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };

  const authContext = useMemo(() => ({
    signIn: (data) => {
      setUserData(data);
      dispatch({ type: 'SIGN_IN', token: data });
    },
    signOut: async () => {
      try {
        await AsyncStorage.clear();
        setUserData(null);
        navigation.navigate(StackNav.Login);
      } catch (error) {
        console.error('Error during sign out:', error);
      }
    },
    signUp: (data) => {
      dispatch({ type: 'SIGN_IN', token: data });
    },
  }), []);

  if (state.isLoading) return null;

  return (
    <AuthContext.Provider value={authContext}>
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
          <Image
            source={{ uri: 'http://tamizhy.smartprosoft.com/media/normal/435_9187604.png' }}
            style={localStyles.profileImage}
          />
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
    </AuthContext.Provider>
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
