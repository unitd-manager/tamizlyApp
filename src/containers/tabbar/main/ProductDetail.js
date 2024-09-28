import React from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductDetails = ({ route, navigation }) => {
    const { item } = route.params; // Get the item passed from the previous screen
    const removeHtmlTags = (text) => {
        return text.replace(/<\/?[^>]+(>|$)/g, ""); // Removes HTML tags
    };

    return (
        <View style={styles.container}>
            {/* Header Section with Icon and Title */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
            </View>

            {/* Product Details */}
            <Image source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item.file_name}` }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.description1}>Description</Text>
            <Text style={styles.description}>{removeHtmlTags(item.description)}</Text>

            <Button title="Buy Now" onPress={() => alert('Item purchased!')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative', // Allows centering the text while keeping the icon clickable
    },
    iconContainer: {
        position: 'absolute',
        left: 0, // Position the icon on the left
        paddingLeft: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 20,
        color: 'green',
        marginBottom: 10,
    },
    description1: {
        fontSize: 26,
        color: '#000',
        marginBottom: 10,
        marginTop: 20,
        borderTopWidth : 1,  // Add top border
        borderTopColor: '#eee',  // Light grey border color
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 50,
      
    },
});

export default ProductDetails;
