import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale} from '../../common/constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Local Imports
import {TabRoute} from '../NavigationRoutes';
import {TabNav} from '../NavigationKeys';
import {styles} from '../../themes';
import {getHeight} from '../../common/constants';
import strings from '../../i18n/strings';
import EText from '../../components/common/EText';
import {
  HomeActiveWh,
  HomeUnActive,
  TicketActiveWh,
  TicketUnActive,
} from '../../assets/svgs';

export default function TabBarNavigation() {
  const colors = useSelector(state => state.theme.theme);
  const Tab = createBottomTabNavigator();

  const TabText = memo(({IconType, label, focused, onPress}) => (
    <TouchableOpacity onPress={onPress}>
      <View style={localStyle.tabViewContainer}>
        {IconType}
        <EText
          style={focused?[styles.mt5, {color:'#1983e5'}]:[styles.mt5, {color:'#8694B2'}]}
          numberOfLines={1}
          color={focused ? colors.textColor : colors.grayScale5}
          type={'m14'}>
          {label}
        </EText>
      </View>
    </TouchableOpacity>
  ));

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: [
          localStyle.tabBarStyle,
          {backgroundColor: '#fff', shadowColor: 'black',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 8,  
            elevation: 10,
            zIndex: 1,
        },
        ],
        tabBarShowLabel: false,
      }}
      initialRouteName={TabNav.Feed}>
      
      <Tab.Screen
        name={TabNav.Feed}
        component={TabRoute.Feed}
        options={({navigation}) => ({
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ?           
              <FontAwesome
                name="rss"
                size={moderateScale(20)}
                color='#399AF4'
                style={styles.mr5}/>
              :           
              <FontAwesome
                name="rss"
                size={moderateScale(20)}  
                color='#8694B2'
                style={styles.mr5}/>
              }
              focused={focused}
              label={strings.home}
              onPress={() => navigation.navigate(TabNav.Feed)}
            />
          ),
        })}
      />

      <Tab.Screen
        name={TabNav.MainHome}
        component={TabRoute.MainHome}  // Keep this component as MainHome to stay on the same page
        options={({navigation}) => ({
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ?               
              <FontAwesome
                name="folder-open"
                size={moderateScale(20)}
                color='#399AF4'
                style={styles.mr5}/>
              :           
              <FontAwesome
                name="folder-open"
                size={moderateScale(20)}  
                color='#8694B2'
                style={styles.mr5}/>
              }

              focused={focused}
              label={strings.Directory}
              onPress={() => navigation.navigate(TabNav.MainHome)}  // Always navigate to MainHome
            />
          ),
        })}
      />

      <Tab.Screen
        name={TabNav.Connect}
        component={TabRoute.MainHome}  // Keep this component as MainHome to stay on the same page
        options={({navigation}) => ({
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? 
                <Ionicons
                name="grid-outline"
                size={moderateScale(20)}
                color='#399AF4'
                style={styles.mr5}/>
              :           
              <Ionicons
                name="grid-outline"
                size={moderateScale(20)}  
                color='#8694B2'
                style={styles.mr5}/>
              }
              focused={focused}
              label={strings.Classified}
              onPress={() => navigation.navigate(TabNav.Feed)}  // Always navigate to MainHome
            />
          ),
        })}
      />

      <Tab.Screen
        name={TabNav.Profile}
        component={TabRoute.Profile}  // Keep this component as MainHome to stay on the same page
        options={({navigation}) => ({
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? 
                <Ionicons
                name="settings-outline"
                size={moderateScale(20)}
                color='#399AF4'
                style={styles.mr5}/>
              :           
              <Ionicons
                name="settings-outline"
                size={moderateScale(20)}  
                color='#8694B2'
                style={styles.mr5}/>
              }
              focused={focused}
              label={strings.TaskList}
              onPress={() => navigation.navigate(TabNav.Profile)}  // Always navigate to MainHome
            />
          ),
        })}
      />

    </Tab.Navigator>
  );
}

const localStyle = StyleSheet.create({
  tabBarStyle: {
    height: getHeight(80),
    ...styles.ph20,
    borderTopWidth: 1,
  },
  tabViewContainer: {
    ...styles.center,
  },
});
