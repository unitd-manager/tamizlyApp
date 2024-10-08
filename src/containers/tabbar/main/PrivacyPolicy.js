import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import api from '../../../api/api';

const AboutScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const removeHtmlTags = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, ""); 
};

  useEffect(() => {
    api.get('contentPrivacyPolicy.php')
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        categories.length > 0 ? (
          categories.map((category, index) => (
            <View key={index}>
              <Text style={styles.title}>{category.title}</Text>
              <Text style={styles.description}>{removeHtmlTags(category.description)}</Text>
            </View>
          ))
        ) : (
          <Text>Loading...</Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    paddingTop:50,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Gilroy-Regular',
    lineHeight:20,
},
  iconContainer: {
    position: 'absolute',
    left: 0,
    paddingLeft: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default AboutScreen;
