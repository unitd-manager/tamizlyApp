// Tab Routes
import MainHome from '../containers/tabbar/main/HomeTab';
import Classified from '../containers/tabbar/main/Classified';
import ClassifiedHistory from '../containers/tabbar/main/ClassifiedHistory';

import AboutScreen from '../containers/tabbar/main/AboutScreen';
import PrivacyPolicy from '../containers/tabbar/main/PrivacyPolicy';
import EditProfile from '../containers/auth/EditProfile';
import ProductDetail from '../containers/tabbar/main/ProductDetail';
import TaskTab from '../containers/tabbar/taskList/TaskTab';
import Feed from '../containers/tabbar/main/Feed';
import Profile from '../containers/tabbar/main/ProfileTab';
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
  Classified,

  Feed,
  TaskTab,
  HomeListCard,
  Connect,
  Profile,
};

export const StackRoute = {
  Splash,
  WelcomeScreen,
  OnBoarding,
  Login,
  ClassifiedHistory,
  EditProfile,
  ProductDetail,
AboutScreen,
PrivacyPolicy,
  SignUp,
  ForgotPass,
  TabBar,
  SelfieWithId,
  
};
