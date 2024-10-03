import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import EButton from '../../../components/common/EButton';

const ProductDetails = ({ route, navigation }) => {
    const { item } = route.params; // Get the item passed from the previous screen
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef(null); // Reference to the carousel

    const removeHtmlTags = (text) => {
        return text.replace(/<\/?[^>]+(>|$)/g, ""); // Removes HTML tags
    };

    // Remove any extra spaces after splitting the URLs
    const images = item.file_names.split(',').map(image => image.trim());

    const renderImage = ({ item }) => {
        return (
            <Image source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item}` }} style={styles.image} />
        );
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

            {/* Show either the carousel or a single image */}
            {images.length > 1 ? (
                <View>
                    <Carousel
                        ref={carouselRef}
                        data={images}
                        renderItem={renderImage}
                        sliderWidth={350} // Adjust this based on your layout
                        itemWidth={350}
                        onSnapToItem={(index) => setActiveSlide(index)}
                    />
                    <Pagination
                        dotsLength={images.length}
                        activeDotIndex={activeSlide}
                        containerStyle={{ paddingVertical: 8 }}
                        dotStyle={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginHorizontal: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.92)',
                        }}
                        inactiveDotStyle={{
                            // Define styles for inactive dots
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        tappableDots={true}  // Enable tappable dots
                        carouselRef={carouselRef}
                        // When a dot is tapped, change the carousel slide
                        onPress={(index) => carouselRef.current.snapToItem(index)}
                    />
                </View>
            ) : (
                <Image source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${images[0]}` }} style={styles.image} />
            )}

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.category}>{item.category_title}</Text>
            <Text style={styles.location}>{item.region}, {item.location}</Text>
            <Text style={styles.mobile}>Mob: {item.mobile}</Text>
            <Text style={styles.description1}>Description</Text>
            <Text style={styles.description}>{removeHtmlTags(item.description)}</Text>

            <View style={styles.btnContainer}>
                <EButton title="Buy Now" onPress={() => alert('Item purchased!')} containerStyle={styles.buyBtn}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'Gilroy-Medium',
        paddingHorizontal:30,
    },
    header: {
        fontFamily: 'Gilroy-Medium',
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
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Gilroy-SemiBold',
        color: '#242B48',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Gilroy-SemiBold',
        color: '#242B48',
        marginBottom: 10,
    },
    category: {
        fontSize: 14,
        color: '#8694B2',
        fontFamily: 'Gilroy-Medium',
        marginBottom: 5,
    },
    location: {
        fontSize: 12,
        color: '#8694B2',
        fontFamily: 'Gilroy-Medium',
    },
    mobile: {
        fontSize: 12,
        color: '#8694B2',
        fontFamily: 'Gilroy-Medium',
        marginTop:10,
    },
    description1: {
        fontSize: 16,
        color: '#242B48',
        marginBottom: 10,
        marginTop: 20,
        borderTopWidth : 1,  // Add top border
        borderTopColor: '#eee',  // Light grey border color
        fontFamily: 'Gilroy-SemiBold',  
        paddingTop:20,    
    },
    description: {
        fontSize: 14,
        color: '#8694B2',
        marginBottom: 30,
        fontFamily: 'Gilroy-Light',
        lineHeight:20,      
    },
    btnContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',    
    },
    buyBtn: {
        borderRadius:10,
        paddingHorizontal:50,
    }
});

export default ProductDetails;
