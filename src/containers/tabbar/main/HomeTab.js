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
      console.log("Categories Data Updated:", categoriesData);
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
    <View style={[styles.flexGrow1, {backgroundColor: '#F5F5F5'}]}>
      <View
        style={{
          backgroundColor: colors.backgroundColor3,
          borderBottomRightRadius: 50,
          borderBottomLeftRadius: 50,
          ...styles.pb50,
        }}>
        <HomeHeader user={user} />

        <SearchComponent
          search={searchQuery}
          onSearchInput={handleSearch}
          isLoading={isLoading}
          error={error}
        />
      </View>

      <View style={{flex: 1, marginTop: -40}}>
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
                ListFooterComponent={
                    <TouchableOpacity onPress={handleViewAll} style={localStyles.viewAllButton}>
                        <Text style={localStyles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                }
            />

            <FlatList
                data={selectedCategoryData}
                keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
                renderItem={({ item }) => (
                    <View style={localStyles.serviceCard}>
                        <Image source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item.file_name}` }}  style={localStyles.serviceIcon} />

                        <View>
                            <Text style={localStyles.serviceTitle}>{item.category_title}</Text>
                            <Text>{item.description}</Text>
                            <Text>{item.mobile}</Text>
                        </View>
                    </View>
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
categoryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,

},
viewAllButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginRight: 25,
    marginTop: 65,
},
viewAllText: {
    color: 'blue',
},
serviceCard: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#fff',
    marginTop: 5,

    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
},
serviceIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
},
serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',

},
});
