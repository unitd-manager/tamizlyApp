import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackRoute} from '../NavigationRoutes';
import {StackNav} from '../NavigationKeys';
import AuthStack from './AuthStack';
import AuthContext, {defaultState, reducer, restoreToken} from './Auth';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  React.useEffect(() => {
    restoreToken(dispatch);
  }, []);
  const authContext = React.useMemo(
    () => ({
      signIn: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
    }),
    [],
  );

  if (state.isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
          {state.userToken == null ? ( <Stack.Screen name={StackNav.Auth} component={AuthStack} />) : (<>
            <Stack.Screen name={StackNav.TabBar} component={StackRoute.TabBar} />
            <Stack.Screen name={StackNav.Login} component={StackRoute.Login} />
            <Stack.Screen name={StackNav.ProductDetail} component={StackRoute.ProductDetail}  />
            <Stack.Screen name={StackNav.AboutScreen} component={StackRoute.AboutScreen}  />
            <Stack.Screen name={StackNav.PrivacyPolicy} component={StackRoute.PrivacyPolicy}  />
            <Stack.Screen name={StackNav.EditProfile} component={StackRoute.EditProfile}  />
            <Stack.Screen name={StackNav.ClassifiedHistory} component={StackRoute.ClassifiedHistory}  />

                    </>)}
     
    
    </Stack.Navigator>
    </AuthContext.Provider>
  );
}
