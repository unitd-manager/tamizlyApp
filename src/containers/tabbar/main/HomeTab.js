// Library Imports
import {StyleSheet, View, Alert, FlatList,TouchableOpacity,Text,Image,Modal, TextInput, Button} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
//import {FlashList} from '@shopify/flash-list';
import filter from 'lodash.filter';
import moment from 'moment';
// Custom Imports
import {styles, commonColor} from '../../../themes';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import SearchComponent from '../../../components/homeComponent/SearchComponent';
import ProjectConfirmModal from '../../../components/models/ProjectConfirmModal';
import CardData from './CardData';
import EInput from '../../../components/common/EInput';

import strings from '../../../i18n/strings';
import api from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

export default function HomeTab({navigation}) {

// Add new state variables for the modal and form inputs

  const colors = useSelector(state => state.theme.theme);

  const [categories, setCategories] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState('');

  // New state for categories
  const [categoriesData, setCategoriesData] = useState([]);
  const [user, setUserData] = useState();
  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };
  // Fetch categories from separate API
  useEffect(() => {
      api.get('selectCategory(1).php')  // Replace with the correct endpoint for fetching categories
          .then(response => {
              if (response.data && response.data.data) {
                  setCategoriesData(response.data.data);
                  setFilteredCategories(response.data.data);
              } else {
                  setError('Invalid response structure.');
              }
              setLoading(false);
          })
          .catch(error => {
              console.error('There was an error fetching the categories!', error);
              setError('There was an error fetching the categories!');
              setLoading(false);
          });
  }, []);
  useEffect(() => {
  }, [categoriesData]);
  

  // Fetch the directory data from the original API
  useEffect(() => {
      api.get('selectCategory.php')
          .then(response => {
              if (response.data && response.data.data) {
                  setCategories(response.data.data);
              } else {
                  setError('Invalid response structure.');
              }
              setLoading(false);
          })
          .catch(error => {
              console.error('There was an error fetching the data!', error);
              setError('There was an error fetching the data!');
              setLoading(false);
          });
  }, []);

  const handleSearch = (query) => {
      setSearchQuery(query);
      if (query) {
          const filteredData = categoriesData.filter(category =>
              category.title.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredCategories(filteredData);
      } else {
          setFilteredCategories(categoriesData);
      }
  };

  const handleViewAll = () => {
      setShowAll(!showAll);
  };

  const handleCategorySelect = (category) => {
      setSelectedCategory(category);
  };

  const categoriesToDisplay = showAll ? filteredCategories : filteredCategories.slice(0, 3);

  const selectedCategoryData = selectedCategory
      ? categories.filter(item => item.category_title === selectedCategory.title)
      : [];
      const RightPasswordEyeIcon = () => (
     
            <TouchableOpacity onPress={toggleModal} >

            <Image source={require('../../../assets/images/logos.png')}
              style={{ width: 33, height: 34 }} 
                />
            
          </TouchableOpacity>
      );
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [location, setLocation] = useState('');
      const [city, setCity] = useState('');
      const [nationality, setNationality] = useState('');
      const [languages, setLanguages] = useState([]);
      const [address, setAddress] = useState('');
      
      // Function to toggle the modal
      const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
      };
      
      // Function to handle form submission
      const handleFormSubmit = () => {
        // Filter based on all fields entered by the user
        const filteredData = categories.filter(category => {
          const matchesLocation = location ? (category.location || '').toLowerCase().includes(location.toLowerCase()) : true;
          const matchesCity = city ? (category.city || '').toLowerCase().includes(city.toLowerCase()) : true;
          const matchesNationality = nationality ? (category.nationality || '').toLowerCase().includes(nationality.toLowerCase()) : true;
          const matchesLanguages = languages.length > 0 
            ? languages.some(lang => (category.languages || []).map(l => l.toLowerCase()).includes(lang.toLowerCase()))
            : true;
          const matchesAddress = address ? (category.address || '').toLowerCase().includes(address.toLowerCase()) : true;
      
          return matchesLocation || matchesCity || matchesNationality || matchesLanguages || matchesAddress;
        });
      
        if (filteredData.length === 0) {
          Alert.alert('No results found', 'No categories match your search criteria.');
        } else {
          setFilteredCategories(filteredData);
        }
      
        toggleModal();  // Close the modal after form submission
      };
      
      
  return (
    <View style={{flexGrow:1, backgroundColor: '#F5F5F5'}}>
         <View style={{ 
          // backgroundColor: colors.backgroundColor3, 
          borderBottomRightRadius: 50, 
          borderBottomLeftRadius: 50,
          paddingBottom: 50,
      }}>
          <View style={{ flexDirection: 'row', alignItems: 'center',paddingRight: 50 ,   marginBottom: 5,}}>
        {/* SearchComponent on the left */}
        <View style={{ flex: 1 }}>
          <SearchComponent
            search={searchQuery}
            onSearchInput={handleSearch}
            isLoading={loading}
            error={error}
          />
        </View>

        {/* RightPasswordEyeIcon on the right */}
        <RightPasswordEyeIcon />
      </View>
      </View>

      <View style={{flex: 1, marginTop: -40, paddingHorizontal: 20}}>
        <Text style={localStyles.categoryHeading}>Categories
        <TouchableOpacity onPress={handleViewAll} style={localStyles.viewAllButton}>
              <Text style={localStyles.viewAllText}>View All</Text>
            </TouchableOpacity>
        </Text>
      
        <FlatList
          data={categoriesToDisplay}
          keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCategorySelect(item)} style={localStyles.categoryContainer}>
              <Image source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item.file_name}` }} style={localStyles.categoryIcon} />
              <Text style={localStyles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        
        />
      </View>
<View style={{flex: 1, marginTop: -200}}>

<FlatList
    data={selectedCategoryData}
    keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
    renderItem={({ item }) => (
      <>
      <View style={localStyles.serviceCard}>
        <View style={localStyles.leftSection}>
          <Image 
            source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item.file_name}` }} 
            style={localStyles.serviceIcon} 
          />
          <Text style={localStyles.name}>{item.name}</Text>
          <Text style={localStyles.mobile}>{item.mobile}</Text>
          <Text style={localStyles.location}>{item.location}</Text>
          <Text style={localStyles.area}>{item.area}</Text>
        </View>
        
        <View style={localStyles.rightSection}>
          <Text style={localStyles.name}>{item.name}</Text>
          <Text style={localStyles.description}>{item.description || "Write description here"}</Text>
          <Text style={localStyles.serviceTitle}>{item.category_title}</Text>

          {/* New row for nationality and languages */}
         
        </View>
      </View>

        <View style={localStyles.bottomInfo}>
        <Text style={localStyles.nationality}><Text style={localStyles.name1}>Nationality</Text>{'\n'}{'\n'}{item.nationality || "not specified"}</Text>
        <Text style={localStyles.languages}><Text style={localStyles.name1}>Language</Text>{'\n'}{'\n'}{item.language || "Languages not specified"}</Text>
      </View>
      
        </>
    )}
/>

      </View>

<Modal
  visible={isModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={toggleModal}
>
  <View style={localStyles.modalContainer}>
    <View style={localStyles.modalContent}>

      {/* Input for State */}
      <EInput
        placeholder="State"
        value={location}
        onChangeText={setLocation}
        style={localStyles.inputField}
      />

      {/* Input for City */}
      <EInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={localStyles.inputField}
      />

      {/* Input for Nationality */}
      <EInput
        placeholder="Nationality"
        value={nationality}
        onChangeText={setNationality}
        style={localStyles.inputField}
      />

      {/* Languages (use a multi-select or text input based on your needs) */}
      <EInput
        placeholder="Languages (e.g., English, French)"
        value={languages.join(', ')}  // Join array for display
        onChangeText={text => setLanguages(text.split(',').map(lang => lang.trim()))}
        style={localStyles.inputField}
      />

      {/* Input for Address */}
      <EInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={localStyles.inputField}
      />
      <Text style={localStyles.modalTitle}></Text>



      <Button   title="Search" onPress={handleFormSubmit} />

      {/* Button to Close Modal */}
      <TouchableOpacity onPress={toggleModal}>
        <Text style={localStyles.closeModalText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    
    </View>
    
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
    fontFamily: 'Gilroy-Medium',
  },
  inputContainer: {
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 15,
    borderColor: '#D3D3D3',
    width: '88%',
    marginLeft:20,
    marginRight:20,
    paddingHorizontal: 15,
    fontFamily: 'Gilroy-Medium',
  },
  inputBox: {
    color: '#333',
    borderBottomWidth:0,
    fontFamily: 'Gilroy-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    width: '80%',
 

    width: '100%',
    backgroundColor:'#FFFFFF',
     borderRadius: 20,
     paddingVertical: 70,
     paddingHorizontal: 30,
     alignItems: 'center',
     marginTop: 200, 
     fontFamily: 'Gilroy-Medium',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Gilroy-Medium',
  },
  inputField: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'Gilroy-Medium',
  },
  closeModalText: {
    color: 'blue',
    marginTop: 40,
    fontSize: 20,
    fontFamily: 'Gilroy-Medium',
  },
  categoryContainer: {
    alignItems: 'center',
    marginRight: 25,
    marginTop: 65,
    fontFamily: 'Gilroy-Medium',

},
categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
},
categoryHeading: {
  fontSize: 22,
  fontWeight: 'bold',
  paddingBottom: 0,
  paddingLeft: 15,
  fontFamily: 'Gilroy-Medium',
},
categoryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Gilroy-Medium',
},
viewAllButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 150,
    marginRight: 85,
    marginTop: 95,
},
viewAllText: {
    color: 'blue',
    fontSize: 20,
    fontFamily: 'Gilroy-Medium',
},
serviceCard: {
  flexDirection: 'row',  // Main container with two columns: one for the logo, the other for the text
  padding: 20,
  backgroundColor: '#fff',
  marginTop: 10,
  borderRadius: 10,
  marginBottom: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 2,
  fontFamily: 'Gilroy-Medium',
},
leftSection: {
  flex: 0.5,  // Left section for the logo
  fontFamily: 'Gilroy-Medium',
},
rightSection: {
  flex: 0.5,  // Right section for the text content
  flexDirection: 'column',  // Stack the text elements vertically
  justifyContent: 'center',
  paddingLeft: 10,
  fontFamily: 'Gilroy-Medium',
  paddingBottom: 20,
},
name: {
  fontSize: 16,
  color: 'skyblue',
  fontWeight: 'bold',
  fontFamily: 'Gilroy-Medium',
},
name1: { 
  fontSize: 16,
  color: '#ccc',
  fontFamily: 'Gilroy-Medium',
},
description: {
  fontSize: 16,
  color: '#666',
  fontWeight: 'bold',
  marginBottom: 5,
  fontFamily: 'Gilroy-Medium',
},
mobile: {
  fontSize: 14,
  color: '#333',
  fontFamily: 'Gilroy-Medium',
},
location: {
  fontSize: 14,
  color: '#333',
  fontFamily: 'Gilroy-Medium',
},
area: {
  fontSize: 14,
  color: '#333',
  fontFamily: 'Gilroy-Medium',
},
serviceIcon: {
  width: 90,
  height: 90,
},
serviceTitle: {
  fontSize: 19,
  fontWeight: 'bold',
  fontFamily: 'Gilroy-Medium',
},

// New style for nationality and languages
bottomInfo: {
  backgroundColor: '#fff',

  flexDirection: 'row',  // Align nationality and languages in a row
  justifyContent: 'space-between',  // Space them apart
  borderTopWidth: 3,  // Add top border
  borderTopColor: '#FFF',  // Light grey border color
  marginBottom: 12,  // Add margin from the top
  paddingTop: 15,  // Add padding at the top to give space between text and border
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 1,
  fontFamily: 'Gilroy-Medium',
},
nationality: {
  fontSize: 14,
  color: '#333',
  paddingStart:10,
  marginBottom: 12, 
  fontWeight: 'bold',
  fontFamily: 'Gilroy-Medium',
},
languages: {
  fontSize: 14,
  color: '#333',
  paddingEnd:10,
  fontWeight: 'bold',
  fontFamily: 'Gilroy-Medium',
},
});
