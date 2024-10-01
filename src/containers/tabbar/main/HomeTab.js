// Library Imports
import {StyleSheet, View, ScrollView, ActivityIndicator, Alert, FlatList,TouchableOpacity,Text,Image,Modal, TextInput, Button} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import { Picker } from '@react-native-picker/picker';
//import {FlashList} from '@shopify/flash-list';
import filter from 'lodash.filter';
import moment from 'moment';
import EButton from '../../../components/common/EButton';
// Custom Imports
import {styles, commonColor} from '../../../themes';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import SearchComponent from '../../../components/homeComponent/SearchComponent';
import ProjectConfirmModal from '../../../components/models/ProjectConfirmModal';
import CardData from './CardData';
import EInput from '../../../components/common/EInput';
import {moderateScale} from '../../../common/constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';

import strings from '../../../i18n/strings';
import api from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

export default function HomeTab({navigation}) {

// Add new state variables for the modal and form inputs

  const colors = useSelector(state => state.theme.theme);

  const [categoriesData, setCategoriesData] = useState([]); // For categories
  const [directoryData, setDirectoryData] = useState([]);  // For directory data
  const [filteredDirectory, setFilteredDirectory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [valuelistRegion, setValuelistRegion] = useState([]);
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [valuelistLocation, setValuelistLocation] = useState([]);
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [valuelistCountry, setValuelistCountry] = useState([]);
  
  const [languages, setLanguages] = useState([]);
  const [item, setItem] = useState(null);

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };
  // Fetch categories from separate API
  useEffect(() => {
    setLoading(true);
    api.get('selectCategory.php')
      .then(response => {
        if (response.data && response.data.data) {
          const fetchedCategories = response.data.data.category_data;
          const fetchedDirectory = response.data.data.directory_data;
  
          setCategoriesData(fetchedCategories);  // Set categories
          setDirectoryData(fetchedDirectory);  // Set directory
  
          // Set initially selected category to the first category
          const firstCategory = fetchedCategories.length > 0 ? fetchedCategories[0] : null;
          setSelectedCategory(firstCategory);
  
          // Filter the directory based on the first category
          const filteredData = firstCategory 
            ? fetchedDirectory.filter(item => item.category_title === firstCategory.title)
            : fetchedDirectory;
  
          setFilteredDirectory(filteredData);  // Set initially filtered directory
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
  const getValuelistCountry = () => {
    api
      .get('selectCountry.php')
      .then((res) => {
        setValuelistCountry(res.data.data);
      })
      .catch((error) => {
        console.log('valuelist not found:', error);
      });
  };
  useEffect(() => {
    getValuelistLocation()
    getValuelistRegion()
    getValuelistCountry()
  }, [regionFilter]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  
    let filteredData = directoryData;
  
    // If a category is selected, filter the directory data by that category
    if (selectedCategory) {
      filteredData = filteredData.filter(item => item.category_title === selectedCategory.title);
    }
  
    // Now filter by the search query
    if (query) {
      filteredData = filteredData.filter(item => {
        const nameMatches = item.name?.toLowerCase().includes(query.toLowerCase());
        const mobileMatches = item.mobile?.toLowerCase().includes(query.toLowerCase());
        const regionMatches = item.region?.toLowerCase().includes(query.toLowerCase());
        const locationMatches = item.location?.toLowerCase().includes(query.toLowerCase());
        const hospitalMatches = item.hospital?.toLowerCase().includes(query.toLowerCase());
        const specialisationMatches = item.specialisation?.toLowerCase().includes(query.toLowerCase());
        const areaMatches = item.area?.toLowerCase().includes(query.toLowerCase());
        const languageMatches = item.language?.toLowerCase().includes(query.toLowerCase());
        return nameMatches || mobileMatches || regionMatches || locationMatches || hospitalMatches || specialisationMatches || areaMatches || languageMatches;
      });
    }
  
    // Update the filtered directory
    setFilteredDirectory(filteredData);
  };
  
  const handleViewAll = () => {
      setShowAll(!showAll);
  };

  const handleCategorySelect = (category) => {
      setSelectedCategory(category);
      // Filter directory based on the selected category's title
    const filteredData = directoryData.filter(item => item.category_title === category.title);
    setFilteredDirectory(filteredData); // Update the filtered directory state
  };

  const categoriesToDisplay = showAll ? categoriesData : categoriesData.slice(0, 3);

  const selectedCategoryData = selectedCategory
    ? directoryData.filter(item => item.category_title === selectedCategory.title)
    : directoryData.length > 0
    ? directoryData.filter(item => item.category_title === directoryData[0].category_title)
    : [];

      // Function to toggle the modal
      const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
      };

      const toggleModalClose = () => {
        setIsModalVisible(!isModalVisible);
        setRegionFilter('ALL')
        setCountryFilter('ALL')
        setLocationFilter('ALL')
      };
      // Function to handle form submission
      const handleFormSubmit = () => {
        // Filter based on all fields entered by the user
        let filteredData = selectedCategoryData;
      
        // Filter by region
        if (regionFilter !== 'ALL') {
          filteredData = filteredData.filter(item => item.region?.toLowerCase() === regionFilter.toLowerCase());
        }
      
        // Continue filtering by other fields
        if (locationFilter !== 'ALL') {
          filteredData = filteredData.filter(item => item.location?.toLowerCase().includes(locationFilter.toLowerCase()));
        }
            
        if (countryFilter !== 'ALL') {
          filteredData = filteredData.filter(item => item.nationality?.toLowerCase().includes(countryFilter.toLowerCase()));
        }
      
        if (languages.length > 0) {
          filteredData = filteredData.filter(item => {
            return languages.some(lang => 
              item.language && item.language.toLowerCase().includes(lang.toLowerCase())
            );
          });
        }        
            
        if (filteredData.length === 0) {
          Alert.alert('No results found', 'No categories match your search criteria.');
        } else {
          setFilteredDirectory(filteredData);
        }
      
        toggleModal();  // Close the modal after form submission
      };
      

      if ( loading ) {
        return (
          <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size={"large"} color="#0000ff"  />
          </View>
        )
      }
          
  return (
    <View style={{flexGrow:1, backgroundColor: '#fff', paddingTop:10,}}>
         <View style={{ 
          // b ackgroundColor: colors.backgroundColor3, 
          borderBottomRightRadius: 50, 
          borderBottomLeftRadius: 50,
          paddingBottom: 20,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center',paddingRight: 30, marginBottom: 5,}}>
        {/* SearchComponent on the left */}
        <View style={{ flex: 1 }}>
          <SearchComponent
            search={searchQuery}
            onSearchInput={handleSearch}
            error={error}
          />
        </View>

        <TouchableOpacity onPress={toggleModal}>
            <Image source={require('../../../assets/images/logos.png')} style={{ width: 40, height: 40, marginTop: 3 }} />
          </TouchableOpacity>
      </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal:30,}}>
        <View style={{ flex: 1 }}>
            <Text style={localStyles.categoryHeading}>Categories</Text>
        </View>
        <TouchableOpacity onPress={handleViewAll} style={localStyles.viewAllButton}>
            <Text style={localStyles.viewAllText}>View all</Text>
        </TouchableOpacity>        
      </View>

      <View style={{paddingHorizontal: 30,}}>      
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

      <View style={{paddingHorizontal: 30,}}> 
        {item ? ( 
          <Text style={localStyles.catTitle}>{item.title}</Text> 
        ) : ( 
          selectedCategoryData.length > 0 ? (
            <Text style={localStyles.catTitle}>{selectedCategoryData[0].category_title}</Text>
          ) : (
            <Text style={localStyles.catTitle}></Text>
          )
        )}
      </View>
      <View style={{paddingHorizontal: 30, marginBottom:600,}}>
          <FlatList
              data={filteredDirectory}
              keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
              renderItem={({ item }) => (
                <View style={localStyles.serviceCard}>
                  <View style={{ flexDirection: 'row'}}>
                    <View style={localStyles.leftSection}>
                      <Image 
                        source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item.file_name}` }} 
                        style={localStyles.serviceIcon} 
                      />
                    </View>
                    
                    <View style={localStyles.rightSection}>
                      <Text style={localStyles.title}>{item.name}</Text>
                      <HTMLView stylesheet={htmlStyles} value={item.description} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row'}}>
                      <View style={{ flex: 1 }}>
                          <Text style={localStyles.name}>{item.name}</Text>
                      </View>
                      <View style={{ }}>
                      <Text style={localStyles.serviceTitle}>{item.category_title}</Text>                  
                      </View>
                  </View>
                  <View>
                      {/* Area and Location */}
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome
                          name="map-marker"
                          size={moderateScale(15)}  
                          color='#399AF4'
                          style={styles.mr15}/>
                        <View>
                        <Text style={localStyles.area}>{item.area}</Text>
                        <Text style={localStyles.location}>{item.location}, {item.region}</Text>
                        </View>
                      </View>

                      {/* Mobile */}
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome
                          name="phone"
                          size={moderateScale(15)}  
                          color='#399AF4'
                          style={styles.mr10}/>
                        <Text style={localStyles.mobile}>{item.mobile}</Text>
                      </View>

                      {/* Doctor Section */}
                      {item.category_title === 'Doctor' && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FontAwesome
                            name="hospital-o"
                            size={moderateScale(15)}  
                            color='#399AF4'
                            style={styles.mr10}/>
                          <View>
                            <Text style={localStyles.mobile}>{item.hospital}</Text>
                            <Text style={localStyles.mobile}>{item.specialisation}</Text>
                          </View>
                        </View>
                      )}
                  </View>

                  <View style={localStyles.bottomInfo}>
                      <Text style={localStyles.nationality}><Text style={localStyles.name1}>Nationality</Text>{'\n'}{'\n'}{item.country || "Not specified"}</Text>
                      <Text style={localStyles.languages}><Text style={localStyles.name1}>Language</Text>{'\n'}{'\n'}{item.language || "Not specified"}</Text>
                  </View>      
                </View>
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
        <View style={localStyles.pickerContainer}>
            <Picker
                selectedValue={regionFilter}
                dropdownIconColor="#8694B2"
                onValueChange={(itemValue) => setRegionFilter(itemValue)}
                style={localStyles.picker}
            >
                <Picker.Item label="Select Region" value="ALL" style={localStyles.pickerItem}/>
                {valuelistRegion.map((item) => (
                    <Picker.Item key={item.value} label={item.value} value={item.value} style={localStyles.pickerItem} />
                ))}
            </Picker>
        </View>

        <View style={localStyles.pickerContainer}>
            <Picker
                selectedValue={locationFilter}
                dropdownIconColor="#8694B2"
                onValueChange={(itemValue) => setLocationFilter(itemValue)}
                style={localStyles.picker}
            >
                <Picker.Item label="Select Location" value="ALL" style={localStyles.pickerItem}/>
                {valuelistLocation?.map((item) => (
                    <Picker.Item key={item.value} label={item.value} value={item.value} style={localStyles.pickerItem} />
                ))}
            </Picker>
        </View>

        <View style={localStyles.pickerContainer}>
            <Picker
                selectedValue={countryFilter}
                dropdownIconColor="#8694B2"
                onValueChange={(itemValue) => setCountryFilter(itemValue)}
                style={localStyles.picker}
            >
                <Picker.Item label="Select Nationality" value="ALL" style={localStyles.pickerItem}/>
                {valuelistCountry.map((item) => (
                    <Picker.Item key={item.name} label={item.name} value={item.nationality} style={localStyles.pickerItem} />
                ))}
            </Picker>
        </View>

      {/* Languages (use a multi-select or text input based on your needs) */}
      <EInput
        placeholder="Languages (e.g., English, French)"
        value={languages.join(', ')}  // Display joined array for the input field
        onChangeText={text => setLanguages(text.split(',').map(lang => lang.trim()))}  // Split input text into an array of languages
        style={localStyles.inputFieldLang}
      />

      <Text style={localStyles.modalTitle}></Text>

      <EButton title="Submit" onPress={handleFormSubmit} containerStyle={localStyles.submitBtn}/>

      {/* Button to Close Modal */}
      <TouchableOpacity onPress={toggleModalClose}>
        <Text style={localStyles.closeModalText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    
</ View>
    
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
    width: '100%',
    backgroundColor:'#FFFFFF',
     borderRadius: 20,
     paddingVertical: 50,
     paddingHorizontal: 50,
     alignItems: 'center',
     marginTop: 280, 
     fontFamily: 'Gilroy-Medium',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Gilroy-Medium',
  },
  inputFieldLang: {
    width: '100%',
    padding: 10,
    borderColor: '#8694B2',
    borderWidth: 0.5,
    borderRadius: 8,
    fontFamily: 'Gilroy-Medium',
    marginLeft:18,
  },
  closeModalText: {
    color: '#399AF4',
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Gilroy-Medium',
  },
  categoryContainer: {
    alignItems: 'center',
    marginRight: 20,
    marginTop: 20,
    fontFamily: 'Gilroy-Medium',
},
categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
    borderRadius:5,
},
catTitle: {
  fontSize: 18,
  fontFamily: 'Gilroy-SemiBold',
  color:'#242B48',
  marginBottom:25,
  marginTop:20,
},
categoryHeading: {
  fontSize: 18,
  fontFamily: 'Gilroy-SemiBold',
  color:'#242B48',
},
categoryText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Gilroy-SemiBold',
    color:'#4A537E',
    marginBottom:10,
},
viewAllText: {
    color: '#8694B2',
    fontSize: 18,
    fontFamily: 'Gilroy-Light',
    textDecorationLine:'underline',
  },
serviceCard: {
  padding: 10,
  backgroundColor: '#fff',
  borderRadius: 10,
  marginBottom: 20,
  fontFamily: 'Gilroy-Medium',
  borderColor:'#EEEEEE',
  borderWidth:1,
},
leftSection: {
  fontFamily: 'Gilroy-Medium',
  marginRight:10,
},
rightSection: {
  flexDirection: 'column',  // Stack the text elements vertically
  justifyContent: 'center',
  paddingLeft: 10,
  fontFamily: 'Gilroy-Medium',
  paddingBottom: 20,
},
title: {
  fontSize: 14,
  color: '#242B48',
  fontFamily: 'Gilroy-SemiBold',
  justifyContent: 'center',

},
name: {
  fontSize: 17,
  color: '#399AF4',
  fontFamily: 'Gilroy-SemiBold',
  justifyContent: 'center',
  marginTop : 20,
},
name1: { 
  fontSize: 12,
  color: '#8694B2',
  fontFamily: 'Gilroy-Light',
},
description: {
  fontSize: 12,
  color: '#8694B2',
  marginBottom: 5,
  fontFamily: 'Gilroy-Light',
},
mobile: {
  fontSize: 12,
  color: '#8694B2',
  fontFamily: 'Gilroy-Medium',
  marginTop:5,
},
location: {
  fontSize: 12,
  color: '#8694B2',
  fontFamily: 'Gilroy-Medium',
},
area: {
  fontSize: 12,
  color: '#8694B2',
  fontFamily: 'Gilroy-Medium',
},
serviceIcon: {
  width: 75,
  height: 75,
},
serviceTitle: {
  fontSize: 12,
  fontFamily: 'Gilroy-SemiBold',  
  color: '#4A537E',
  backgroundColor: '#F0F7FF',
  paddingHorizontal: 15,
  paddingVertical:5,
  borderRadius:10,
  maxWidth:150,
  marginTop:20,
},

// New style for nationality and languages
bottomInfo: {
  backgroundColor: '#fff',
  flexDirection: 'row',  // Align nationality and languages in a row
  justifyContent: 'space-between',  // Space them apart
  borderTopWidth : 1,  // Add top border
  borderTopColor: '#eee',  // Light grey border color
  paddingTop: 5,  // Add padding at the top to give space between text and border
  fontFamily: 'Gilroy-Medium',
  marginTop:10,
},
nationality: {
  fontSize: 12,
  color: '#000000',
  fontFamily: 'Gilroy-Medium',
},
languages: {
  fontSize: 12,
  color: '#000000',
  fontFamily: 'Gilroy-Medium',
},
pickerContainer: {
  borderColor: '#8694B2',
  borderWidth: 0.5,
  borderRadius: 3,
  marginVertical: 10,
  marginLeft:7,
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
});

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 12,
    color: '#8694B2',
    marginBottom: 5,
    fontFamily: 'Gilroy-Light',
  },
  h1: {
    fontFamily: 'Gilroy-Bold', // Custom font for headings
    fontSize: 16,
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
