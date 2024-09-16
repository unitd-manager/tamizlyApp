// Library Imports
import {StyleSheet, View, Alert, FlatList,TouchableOpacity,Text,Image} from 'react-native';
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
import strings from '../../../i18n/strings';
import api from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

export default function HomeTab({navigation}) {
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

  return (
    <View style={{flexGrow:1, backgroundColor: '#F5F5F5'}}>
         <View style={{ 
          // backgroundColor: colors.backgroundColor3, 
          borderBottomRightRadius: 50, 
          borderBottomLeftRadius: 50,
          paddingBottom: 50,
      }}>
        <SearchComponent
          search={searchQuery}
          onSearchInput={handleSearch}
          isLoading={loading}
          error={error}
          rightIcon="blue-search-icon-path"  // You can customize the icon path here
        />
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

    
    </View>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  categoryContainer: {
    alignItems: 'center',
    marginRight: 25,
    marginTop: 65,

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
},
categoryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,

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
},
leftSection: {
  flex: 0.5,  // Left section for the logo
},
rightSection: {
  flex: 0.5,  // Right section for the text content
  flexDirection: 'column',  // Stack the text elements vertically
  justifyContent: 'center',
  paddingLeft: 10,
  paddingBottom: 20,
},
name: {
  fontSize: 16,
  color: 'skyblue',
  fontWeight: 'bold',
},
name1: { 
  fontSize: 16,
  color: '#ccc',
},
description: {
  fontSize: 16,
  color: '#666',
  fontWeight: 'bold',
  marginBottom: 5,
},
mobile: {
  fontSize: 14,
  color: '#333',
},
location: {
  fontSize: 14,
  color: '#333',
},
area: {
  fontSize: 14,
  color: '#333',
},
serviceIcon: {
  width: 90,
  height: 90,
},
serviceTitle: {
  fontSize: 19,
  fontWeight: 'bold',
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
},
nationality: {
  fontSize: 14,
  color: '#333',
  paddingStart:10,
  marginBottom: 12, 
  fontWeight: 'bold',

},
languages: {
  fontSize: 14,
  color: '#333',
  paddingEnd:10,
  fontWeight: 'bold',

},
});
