import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import api from '../../../api/api';
import HTMLView from 'react-native-htmlview';

const AboutScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const removeHtmlTags = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, ""); 
  };

  useEffect(() => {
    api.get('contentAboutus.php')
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data); // Assuming response.data.data is an array
        } else {
          setError('Invalid response structure.');
        }
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
        setError('There was an error fetching the categories!');
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          categories.length > 0 ? (
            categories.map((category, index) => (
              <View key={index}>
                <Text style={styles.title}>{category.title}</Text>
                <HTMLView stylesheet={htmlStyles} value={category.description} />
              </View>
            ))
          ) : (
            <Text>Loading...</Text>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  header: {
    fontFamily: 'Gilroy-Medium',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:30,
    paddingTop:30,
    position: 'relative',
  },
  scrollViewContainer: {
    paddingBottom: 50, // Add some padding for better scrolling experience
  },
  title: {
    fontSize: 22,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 10,
    color:'#000',
  },
  description: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Gilroy-Regular',
    lineHeight: 20,
  },
  iconContainer: {
    position: 'absolute',
    left: 0,
    paddingTop:30,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

const htmlStyles = StyleSheet.create({
  p: {
    fontFamily: 'Gilroy-Regular', // Your custom font
    fontSize: 15,
    color: '#242B48',
    marginTop: 20,
    marginBottom: -80,
    lineHeight: 20,
  },
  h1: {
    fontFamily: 'Gilroy-Bold', // Custom font for headings
    fontSize: 20,
    color: '#242B48',
  },
  b: {
    fontFamily: 'Gilroy-Bold',
  },
  strong: {
    fontFamily: 'Gilroy-Bold',
  },
});

export default AboutScreen;
