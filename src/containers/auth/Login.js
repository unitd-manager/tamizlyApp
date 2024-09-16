// Library Imports
import {StyleSheet, View, TouchableOpacity, Alert,ImageBackground} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import { getHeight, moderateScale} from '../../common/constants';
import EHeader from '../../components/common/EHeader';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import { AppFavicon } from '../../assets/svgs';
import EInput from '../../components/common/Einpuut';
import {validateEmail} from '../../utils/validators';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import EButton from '../../components/common/EButton';
import api from '../../api/api';
import { useNavigation } from '@react-navigation/native'

import AuthContext from "../../navigation/Type/Auth";
import { StackNav } from '../../navigation/NavigationKeys';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EText from '../../components/common/EText';

const Login = () => {
  const navigation = useNavigation()

  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary5;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [passwordIcon, setPasswordIcon] = useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [passwordInputStyle, setPasswordInputStyle] = useState(BlurredStyle);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const { signIn } = useContext(AuthContext)

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      !emailError &&
      !passwordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password, emailError, passwordError]);

  const onChangedEmail = val => {
    const {msg} = validateEmail(val.trim());
    setEmail(val.trim());
    setEmailError(msg);
  };
  const onChangedPassword = val => {
    // const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    // setPasswordError(msg);
  };

  const EmailIcon = () => {
    return <Ionicons name="mail" size={moderateScale(20)} color={emailIcon} />;
  };

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };

  const PasswordIcon = () => (
    <Ionicons
      name="lock-closed"
      size={moderateScale(20)}
      color={passwordIcon}
    />
  );

  const onFocusPassword = () => {
    onFocusInput(setPasswordInputStyle);
    onFocusIcon(setPasswordIcon);
  };
  const onBlurPassword = () => {
    onBlurInput(setPasswordInputStyle);
    onBlurIcon(setPasswordIcon);
  };
  const RightPasswordEyeIcon = () => (
    <TouchableOpacity
      onPress={onPressPasswordEyeIcon}
      style={localstyles.eyeIconContainer}>
      <Ionicons
        name={isPasswordVisible ? 'eye-off' : 'eye'}
        size={moderateScale(20)}
        color={passwordIcon}
      />
    </TouchableOpacity>
  );

  const onPressSignWithPassword = async () => {
    api.post('loginApp.php', {
      email:email,
      password:password
    }).then(async(res) => { 
      console.log(res.data.data)
      if (res && res.data.msg === 'Success') {
        await AsyncStorage.setItem('USER_TOKEN','loggedin')
        await AsyncStorage.setItem('USER',JSON.stringify(res.data.data))
        signIn('124')  
      } else {
        Alert.alert('Invalid Credentials')
      }
    }).catch(()=>{
      Alert.alert('Invalid Credentials')
    })
  };


  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);

  const onPressSignIn = () => {
    navigation.navigate(StackNav.SignUp);
  };
  const onPressForgotPass = () => { 
    navigation.navigate(StackNav.ForgotPass);
  };
  const ArrowIcon = () => (
    <Ionicons name="arrow-forward" size={moderateScale(20)} style={localstyles.arrowIcon} />
  );

  return (
    <ESafeAreaView style={localstyles.root}>
      <KeyBoardAvoidWrapper contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
          source={require('../../assets/images/sky.jpg')} // Replace with your gradient image
          style={localstyles.backgroundImage}
        >
        <View style={localstyles.header}>
         
          <TouchableOpacity
                onPress={onPressSignIn}
                style={localstyles.signUpContainer}>
                  <ArrowIcon/>
                <EText
                  type={'m16'}
                  style={localstyles.signUpText}>
                  {strings.dontHaveAccount}
                </EText>
                <EText type={'m12'} style={localstyles.getStartedText}>
                  {' '}
                  {strings.getStarted}
                </EText>
              </TouchableOpacity>
        </View>
        <View style={localstyles.mainContainer}>
        <View style={[{flex:2}]}>
            <AppFavicon
                width={moderateScale(90)}
                height={moderateScale(90)}
                style={[localstyles.logoBg,styles.mv20,styles.selfCenter]}
            />
          </View>
                    <View style={localstyles.elevation}></View>

          <View style={localstyles.formContainer}>

          <EText type={'b16'} style={localstyles.welcomeText}>
                Welcome Back
              </EText>
              <EText type={'b16'} style={localstyles.enterDetailsText}>
                Enter your details to continue
              </EText>
             
              <EInput
  label={strings.email}
  placeholderTextColor={colors.primary5}
  keyBoardType={'email-address'}
  _value={email}
  _errorText={emailError}
  autoCapitalize={'none'}
  // insideLeftIcon={() => <EmailIcon />}
  toGetTextFieldValue={onChangedEmail}
  inputContainerStyle={localstyles.inputContainer}
  inputBoxStyle={[localstyles.inputBox, { fontFamily: 'Gilroy-Medium' }]}
  _onFocus={onFocusEmail}
  onBlur={onBlurEmail}
/>

<EInput
  label={strings.password}
  placeholderTextColor={colors.primary5}
  keyBoardType={'default'}
  _value={password}
  _errorText={passwordError}
  autoCapitalize={'none'}
  // insideLeftIcon={() => <PasswordIcon />}
  toGetTextFieldValue={onChangedPassword}
  inputContainerStyle={localstyles.inputContainer}
  inputBoxStyle={localstyles.inputBox}
  _isSecure={isPasswordVisible}
  _onFocus={onFocusPassword}
  onBlur={onBlurPassword}
  rightAccessory={() => <RightPasswordEyeIcon />}
/>
      
<EButton
                title="Sign In"
                containerStyle={localstyles.signInButton}
                type={'S16'}
                color={isSubmitDisabled && colors.white}
                onPress={onPressSignWithPassword}
                bgColor={isSubmitDisabled && colors.primary6}
              />
            <TouchableOpacity
                onPress={onPressForgotPass}
                style={localstyles.forgotPasswordText}>
                <EText
                  type={'m15'}
                  color={colors.dark ? colors.grayScale7 : colors.grayScale5}>
                  {strings.forgotPassword}
                </EText>
              </TouchableOpacity>

          </View>
        </View>
        </ImageBackground>
      </KeyBoardAvoidWrapper>
    </ESafeAreaView>
  );
};

export default Login;

const localstyles = StyleSheet.create({
  mainContainer: {
   flex:1,
   justifyContent:'center'
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv30,
  },
  orContainer: {
    height: getHeight(1),
    width: '30%',
  },
  signBtnContainer: {
    ...styles.center,
    width: '100%',
    ...styles.mv20,
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mv10,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  checkboxContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },
  socialBtnContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  socialBtn: {
    ...styles.center,
    height: getHeight(60),
    width: moderateScale(90),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.mh10,
  },
  root:{
    flex:1,
    justifyContent:'center',
    flexDirection:'column',
   alignContent:'center',
    backgroundColor:'#004AAD',
  },
  logoBg:{
    backgroundColor:"#fff",
    borderRadius:20,
    marginBottom:50,
  },
  loginBg:{
    backgroundColor:"#fff",
    ...styles.ph20,
    borderTopRightRadius:100,
    paddingTop:10
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    color: '#FFFFFF',
    marginLeft:-15,
  },
  getStartedText: {
    color: '#FFF',
    marginLeft: 10,
    backgroundColor: '#85c1f9',
    padding:10,
    borderRadius:8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
    fontSize:30,
  },
  enterDetailsText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
    fontSize:13,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    alignSelf: 'center',
  },
  formContainer: {
  width: '100%',
 backgroundColor:'#FFFFFF',
  borderRadius: 20,
  paddingVertical: 80,
  paddingHorizontal: 10,
  alignItems: 'center',
  marginBottom: 20,  // Allows space for the shadow at the bottom
},
elevation:{
  backgroundColor: '#93c5f3',  // Use a darker color for a darker shadow
  borderRadius: 60,  // Increase the blur radius to spread the shadow out more
  elevation: 8, 
  Opacity: 0.9,    // Increase the opacity to make the shadow darker
  paddingTop: 20,
  height:50,
  marginBottom:-35,
  marginLeft:15,
  marginRight:15,
}
,  
arrowIcon: {
  marginRight: 25,
  color: '#FFF',
},
  inputContainer: {
    height: 50,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 15,
    borderColor: '#D3D3D3',
    width: '88%',
    marginLeft:20,
    marginRight:20,
    paddingHorizontal: 15,
    fontFamily: 'Gilroy-Medium',
  },
  inputBox: {
    color: '#333',
    borderBottomWidth:0,
    fontFamily: 'Gilroy-Medium',
  },
  signInButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '88%',
  },
  forgotPasswordText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 30,
  },
});
