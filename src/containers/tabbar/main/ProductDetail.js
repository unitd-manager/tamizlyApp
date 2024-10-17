import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using vector icons
import Carousel, { Pagination } from 'react-native-snap-carousel';
import EButton from '../../../components/common/EButton';
import { TabNav } from '../../../navigation/NavigationKeys';

import ImageViewing from 'react-native-image-viewing';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width dynamically

const ProductDetails = ({ route, navigation }) => {
    const { item } = route.params;
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef(null);
    const [visible, setIsVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // To track the selected image index

    const handlePrevious = () => {
        if (selectedImageIndex > 0) {
          setSelectedImageIndex(selectedImageIndex - 1);
        }
      };
    
      // Function to navigate to the next image
      const handleNext = () => {
        if (selectedImageIndex < images.length - 1) {
          setSelectedImageIndex(selectedImageIndex + 1);
        }
      };
    
    const removeHtmlTags = (text) => {
        return text.replace(/<\/?[^>]+(>|$)/g, ""); 
    };

    const images = item.file_names ? item.file_names.split(',').map(image => image.trim()) : [];

    const renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                setIsVisible(true);
                setSelectedImageIndex(index); // Set the selected image index
                }}
            >
                <Image
                source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${item}` }}
                style={styles.image} // Apply dynamic width and height
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() =>  navigation.popToTop()} style={styles.iconContainer}>
                    <Icon name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
            </View>

            {/* Scrollable content */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {images.length > 1 ? (
                    <View>
                        <Carousel
                            ref={carouselRef}
                            data={images}
                            renderItem={renderImage}
                            sliderWidth={screenWidth}  // Use dynamic width
                            itemWidth={screenWidth * 0.9}  // Slightly smaller than screen width for padding
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
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            tappableDots={true}
                            carouselRef={carouselRef}
                            onPress={(index) => carouselRef.current.snapToItem(index)}
                        />
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => {
                        setIsVisible(true);
                        setSelectedImageIndex(0); // Set the selected image index to 0 for single image
                    }}>
                        <Image source={{ uri: `http://tamizhy.smartprosoft.com/media/normal/${images[0]}` }} style={styles.image} />
                    </TouchableOpacity>
                )}

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>{item.category_title}</Text>
                <Text style={styles.location}>{item.region}, {item.location}</Text>
                <Text style={styles.mobile}>Mob: {item.mobile}</Text>
                <Text style={styles.description1}>Description</Text>
                <Text style={styles.description}>{removeHtmlTags(item.description)}</Text>

                {/* Button container */}
                {/* <View style={styles.btnContainer}>
                    <EButton title="Buy Now" onPress={() => alert('Item purchased!')} containerStyle={styles.buyBtn}/>
                </View> */}
            </ScrollView>

            {images.length > 0 && (
                <ImageViewing
                    images={images.map((img) => ({ uri: `http://tamizhy.smartprosoft.com/media/large/${img}` }))}
                    imageIndex={selectedImageIndex}
                    visible={visible}
                    onRequestClose={() => setIsVisible(false)}
                    FooterComponent={() => (
                    <View style={styles.footerContainer}>
                        {selectedImageIndex > 0 && (
                        <TouchableOpacity onPress={handlePrevious} style={styles.previousButton}>
                            <Icon name="chevron-left" size={30} color="#fff" />
                        </TouchableOpacity>
                        )}
                        {selectedImageIndex < images.length - 1 && (
                        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                            <Icon name="chevron-right" size={30} color="#fff" />
                        </TouchableOpacity>
                        )}
                    </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'Gilroy-Medium',
        paddingHorizontal: 30,
    },
    header: {
        fontFamily: 'Gilroy-Medium',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        left: 0,
        paddingLeft: 15,
    },
    headerTitle: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Gilroy-SemiBold',
        color: '#242B48',
    },
    image: {
        width: screenWidth * 0.9,
        height: 300,
        marginBottom: 20,
        marginLeft:-20,
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
        marginTop: 10,
    },
    description1: {
        fontSize: 16,
        color: '#242B48',
        marginBottom: 10,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        fontFamily: 'Gilroy-SemiBold',
        paddingTop: 20,
    },
    description: {
        fontSize: 14,
        color: '#8694B2',
        marginBottom: 30,
        fontFamily: 'Gilroy-Light',
        lineHeight: 20,
    },
    btnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30, // Added margin to ensure button is fully visible
    },
    buyBtn: {
        borderRadius: 10,
        paddingHorizontal: 50,
    },

    footerContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        bottom: 50, // Adjust based on the position you want
      },
      previousButton: {
        position: 'absolute',
        left: 10,
      },
      nextButton: {
        position: 'absolute',
        right: 10,
      },
});

export default ProductDetails;
