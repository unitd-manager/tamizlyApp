// Tab Routes
import MainHome from '../containers/tabbar/main/HomeTab';
import TaskTab from '../containers/tabbar/taskList/TaskTab';

// // Screens Route
import Splash from '../containers/auth/Splash';
import WelcomeScreen from '../containers/WelcomeScreen';
import OnBoarding from '../containers/OnBoarding';
import Login from '../containers/auth/Login';
import SignUp from '../containers/auth/SignUp';
import ForgotPass from '../containers/auth/ForgotPass';

import TabBar from './Type/TabBarNavigation';
import Connect from '../containers/auth/Connect';
import SelfieWithId from '../containers/auth/SelfieWithId';
import HomeListCard from '../containers/tabbar/HomeListCard';


export const TabRoute = {
  MainHome,
  TaskTab,
  HomeListCard,
  Connect,
};

export const StackRoute = {
  Splash,
  WelcomeScreen,
  OnBoarding,
  Login,
  SignUp,
  ForgotPass,
 
  TabBar,
 
  SelfieWithId,
  
};
