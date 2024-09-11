import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';

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
          style={[styles.mt5, {color:'#1983e5', fontWeight: 'bold',}]}
          numberOfLines={1}
          color={focused ? colors.textColor : colors.grayScale5}
          type={'R14'}>
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
          {backgroundColor: '#f5f5f5',     shadowColor: 'red',
            shadowOffset: { width: 5, height: 125 },
            shadowOpacity: 1,
            shadowRadius: 1,  
            elevation: 5,
            height:70,

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
              IconType={focused ? <HomeActiveWh /> : <HomeUnActive />}
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
              IconType={focused ? <TicketActiveWh /> : <TicketUnActive />}
              focused={focused}
              label={strings.Directory}
              onPress={() => navigation.navigate(TabNav.Feed)}  // Always navigate to MainHome
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
              IconType={focused ? <TicketActiveWh /> : <TicketUnActive />}
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
              IconType={focused ? <TicketActiveWh /> : <TicketUnActive />}
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
    height: getHeight(60),
    ...styles.ph20,
    borderTopWidth: 0,
  },
  tabViewContainer: {
    ...styles.center,
  },
});
