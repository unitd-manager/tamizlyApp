import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet ,Modal,ScrollView} from 'react-native';
import SearchComponent from '../../../components/homeComponent/SearchComponent';
import api from '../../../api/api';  // Ensure this is your correct API import

import Icon from 'react-native-vector-icons/Ionicons';

const ClassifiedPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]); // New state for filtered items


    const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility state

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

    const handleCategorySelect = (category) => {
        setSelectedCategory(category.category_title);
        setFilteredItems(items.filter(item => item.category_title === category.category_title));
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

      // Handle search input for both categories and items
      const handleSearch = (query) => {
        setSearchQuery(query);

        if (query) {
            const filteredData = items.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredItems(filteredData);
        } else {
            setFilteredItems(items); // Show all items if search query is empty
        }
    };

    return (
        <View style={styles.container}>
            {/* Search and Filter Section */}
            <View style={{ 
                borderBottomRightRadius: 50, 
                borderBottomLeftRadius: 50,
                paddingBottom: 50,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 50, marginBottom: 5 }}>
                    {/* SearchComponent on the left */}
                    <View style={{ flex: 1 }}>
                        <SearchComponent
                            search={searchQuery}
                            onSearchInput={handleSearch}
                            isLoading={loading}
                            error={error}
                        />
                    </View>
                    {/* Filter Icon */}
                    <TouchableOpacity style={styles.filterIcon}>
                        <Icon name="filter" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Category Dropdown */}
            <TouchableOpacity
                style={styles.categoryDropdown}
                onPress={() => setDropdownVisible(true)} // Show dropdown when pressed
            >
                <Text style={styles.categoryText}>
                    {selectedCategory || 'Select Categories'}
                </Text>
                <Icon name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>

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
                                    <Text>{category.category_title}</Text>
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
                <FlatList
                data={filteredItems}
                    keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={styles.itemCard}>
                            <Image source={{ uri: 'http://tamizhy.smartprosoft.com/media/normal/435_9187604.png' }} style={styles.itemImage} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemPrice}>{item.description}</Text>
                        </View>
                    )}
                />
            )}

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.floatingButton}>
                <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
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
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 16,
    },
    itemCard: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 8,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 1,
    },
    itemImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 14,
        color: '#00A',
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
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    closeButton: {
        padding: 10,
        alignItems: 'center',
    },
});

export default ClassifiedPage;
