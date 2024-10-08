import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Image, StyleSheet ,Modal,ScrollView} from 'react-native';
import SearchComponent from '../../../components/homeComponent/SearchComponent';
import api from '../../../api/api';  // Ensure this is your correct API import
import ClassifiedForm from './ClassifiedForm'; // Assuming ClassifiedForm is in the same directory
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import EButton from '../../../components/common/EButton';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const ClassifiedPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation(); // Initialize navigation
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]); // New state for filtered items
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [regionFilter, setRegionFilter] = useState('ALL');
    const [valuelistRegion, setValuelistRegion] = useState([]);
    const [locationFilter, setLocationFilter] = useState('ALL');
    const [valuelistLocation, setValuelistLocation] = useState([]);
  
    const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility state
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Handle form submission
    /*const handleFormSubmit = (newItem) => {
        setItems([...items, newItem]);
    };*/
    // Fetch categories on component mount
    useEffect(() => {
        setLoading(true);
        api.get('dropdowncategory.php')  // Use the correct API endpoint for categories
            .then(response => {
                if (response.data && response.data.data) {
                    setCategories(response.data.data); // Assuming response.data.data is the category list
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

    useFocusEffect(
        React.useCallback(() => {
            setSelectedCategory(null); // Reset the selected category when the screen is focused
            setFilteredItems(items);
        }, [])
    );

    const handleCategorySelect = (category) => {
        setSelectedCategory(category.category_title);
        if (category.category_title) {
            setFilteredItems(items.filter(item => item.category_title === category.category_title));
        } else {
            setFilteredItems(items); // Reset to all items if no category is selected
        }
        setDropdownVisible(false);
    };
    

 // Fetch classified items from API
 useEffect(() => {
    setLoading(true);
    api.get('classifiedItemsEndpoint.php') // Replace with your API endpoint for fetching classified items
        .then(response => {
            // console.log('API Response:', response);
            if (response.data && response.data.data) {
                setItems(response.data.data);  // Assuming the API returns items in 'data.items'
                setFilteredItems(response.data.data); // Initially show all items
            } else {
                setError('Invalid response structure for classified items.');
            }
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error fetching the classified items!', error);
            setError('There was an error fetching the classified items!');
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
  useEffect(() => {
    getValuelistLocation()
    getValuelistRegion()
  }, [regionFilter]);

      // Handle search input for both categories and items
      const handleSearch = (query) => {
        setSearchQuery(query);

        if (query) {
            const filteredData = items.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.category_title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredItems(filteredData);
        } else {
            setFilteredItems(items); // Show all items if search query is empty
        }
    };

    const selectedCategoryData = selectedCategory
    ? items.filter(item => item.category_title === selectedCategory.title)
    : items.length > 0
    ? items.filter(item => item.category_title === items[0].category_title)
    : [];

      // Function to toggle the modal
      const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
      };

      const toggleModalClose = () => {
        setIsModalVisible(!isModalVisible);
        setRegionFilter('ALL')
        setLocationFilter('ALL')
      };
      // Function to handle form submission
      const handleFormSubmit = () => {
        // Filter based on all fields entered by the user
        let filteredData = items;

        if (selectedCategory) {
            filteredData = filteredData.filter(item => item.category_title === selectedCategory);
        }
      
        // Filter by region
        if (regionFilter !== 'ALL') {
          filteredData = filteredData.filter(item => item.region?.toLowerCase() === regionFilter.toLowerCase());
        }
      
        // Continue filtering by other fields
        if (locationFilter !== 'ALL') {
          filteredData = filteredData.filter(item => item.location?.toLowerCase().includes(locationFilter.toLowerCase()));
        }
                        
        if (filteredData.length === 0) {
          Alert.alert('No results found', 'No categories match your search criteria.');
        } else {
            setFilteredItems(filteredData);
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
        <View style={styles.container}>
           

            {/* Dropdown Modal */}
            <Modal visible={dropdownVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            {categories.map((category, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.categoryItem}
                                    onPress={() => handleCategorySelect(category)}
                                >
                                    <Text style={styles.categoryItemText}>{category.category_title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setDropdownVisible(false)} // Close modal on button press
                        >
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Items List */}
            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>{error}</Text>
            ) : (
                <View style={{paddingHorizontal: 30}}>
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
                    numColumns={2}
                    renderItem={({ item }) => {
                        const firstFileName = item.file_names ? item.file_names.split(', ')[0] : '';

                        return (
                            <TouchableOpacity
                                style={styles.itemCard}
                                onPress={() => navigation.navigate('ProductDetail', { item })}
                            >
                                <View style={styles.itemImage1}>
                                    <Image source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${firstFileName}` }} style={styles.itemImage} />
                                </View>
                                <Text style={styles.itemCategory}>{item.region}, {item.location}</Text>
                                <Text style={styles.itemTitle}>
                                    {item.title.replace(/(<([^>]+)>)/gi, "").length > 30
                                        ? item.title.replace(/(<([^>]+)>)/gi, "").substring(0, 30) + '...' 
                                        : item.title.replace(/(<([^>]+)>)/gi, "")
                                    }
                                </Text>
                                <Text style={styles.itemDescription}>
                                    {item.description.replace(/(<([^>]+)>)/gi, "").length > 40
                                        ? item.description.replace(/(<([^>]+)>)/gi, "").substring(0, 40) + '...' 
                                        : item.description.replace(/(<([^>]+)>)/gi, "")
                                    }
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
                </View>
            )}


            {/* Classified Form Modal */}
            <ClassifiedForm
                visible={isFormVisible}
                onClose={() => setIsFormVisible(false)} // Close the modal
                onSubmit={handleFormSubmit} // Handle form submission
            />
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal}
            >
            <View style={styles.modalContainer1}>
                <View style={styles.modalContent}>
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

                <Text style={styles.modalTitle}></Text>

                <EButton title="Submit" onPress={handleFormSubmit} containerStyle={styles.submitBtn}/>

                {/* Button to Close Modal */}
                <TouchableOpacity onPress={toggleModalClose}>
                    <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
                </View>
            </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 8,
    },
    filterIcon: {
        paddingLeft: 8,
    },
    categoryDropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 13,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 25,
        marginHorizontal:30,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'Gilroy-Medium',
        color:'#8694B2',
    },
    itemCard: {
        backgroundColor: '#fff',
        borderColor: '#F3F4F6',
        borderWidth:1,
        padding: 8,
        borderRadius: 5,
        marginHorizontal:6,
        marginBottom:14,
        paddingBottom:2,
        minHeight: 150, // Adjust to control the height of the cards
        width: '47.5%',
    },
    itemImage: {
        width: 100,
        height: 100,
    },
    itemImage1: {
        width: '100%',
        height: 150,
        backgroundColor: '#F0F7FF',    
        borderRadius:5,
        justifyContent: 'center', // Center vertically
        alignItems: 'center',    
    },
    itemTitle: {
        fontSize: 14,
        color: '#242B48', // Black color for title
        fontFamily: 'Gilroy-SemiBold',
        marginBottom:5,
    },
    itemDescription:{
        fontFamily: 'Gilroy-Light',
        fontSize: 12,
        color:'8694B2',
        marginBottom:10,
    },
    itemPrice: {
        fontSize: 16,
        color: '#399AF4', // Price color as blue
        fontFamily: 'Gilroy-Bold',
    },
    itemCategory: {
        fontSize: 11,
        color: '#8694B2', // Gray color for category title
        marginVertical: 5,
        fontFamily: 'Gilroy-Medium',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        maxHeight: '50%',
    },
    categoryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        fontFamily: 'Gilroy-Medium',
    },
    categoryItemText: {
        fontFamily: 'Gilroy-Medium',
    },
    closeButton: {
        padding: 10,
        alignItems: 'center',
    },
    modalContainer1: {
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
      closeModalText: {
        color: '#399AF4',
        marginTop: 20,
        fontSize: 16,
        fontFamily: 'Gilroy-Medium',
      },
                
    });

export default ClassifiedPage;
