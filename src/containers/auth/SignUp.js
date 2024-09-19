// Library Imports
import { StyleSheet, View, TouchableOpacity, Alert, ImageBackground, Image ,Text,KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Local Imports
import strings from '../../i18n/strings';
//import { styles } from '../../themes';
import { getHeight, moderateScale } from '../../common/constants';
import { AppFavicon } from '../../assets/svgs';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EInput from '../../components/common/Einpuut';
import { validateEmail } from '../../utils/validators';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import EButton from '../../components/common/EButton';
import api from '../../api/api';
import { useNavigation } from '@react-navigation/native'
import EText from '../../components/common/EText';
import { StackNav } from '../../navigation/NavigationKeys';
import Toast from 'react-native-toast-message';

const SignUp = () => {
    const navigation = useNavigation()
    const colors = useSelector(state => state.theme.theme);

    const BlurredStyle = {
        // backgroundColor: colors.inputBg,
        borderColor: colors.primary5,
    };
    const FocusedStyle = {
        backgroundColor: colors.inputFocusColor,
        borderColor: colors.primary5,
    };

    const BlurredIconStyle = colors.primary5;
    const FocusedIconStyle = colors.primary5;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [namelIcon, setNameIcon] = useState(BlurredIconStyle);
    const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
    const [phoneIcon, setPhoneIcon] = useState(BlurredIconStyle);
    const [passwordIcon, setPasswordIcon] = useState(BlurredIconStyle);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [nameInputStyle, setNameInputStyle] = useState(BlurredStyle);
    const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
    const [phoneInputStyle, setPhoneInputStyle] = useState(BlurredStyle);
    const [passwordInputStyle, setPasswordInputStyle] = useState(BlurredStyle);
    const [conpasswordInputStyle, setConPasswordInputStyle] = useState(BlurredStyle);
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);

    const onFocusInput = onHighlight => onHighlight(FocusedStyle);
    const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
    const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
    const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);
    const ArrowIcon = () => (
        <Ionicons name="arrow-forward" size={moderateScale(20)} style={styles.arrowIcon} />
      );
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

    // onChanged
    const onChangedName = val1 => {
        // const { msg } = validateEmail(val.trim());
        setName(val1.trim());
        // setEmailError(msg);
    };
    const onChangedEmail = val2 => {
        const { msg } = validateEmail(val2.trim());
        setEmail(val2.trim());
        setEmailError(msg);
    };
    const onChangedPhone = (value) => {
        // Ensure only numeric characters are entered
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 9);
        setPhone(numericValue);
      };
    const onChangedPassword = val4 => {
        // const {msg} = validatePassword(val.trim());
        setPassword(val4.trim());
        // setPasswordError(msg);
    };
    const onChangedConfirmPassword = val => {
        // const {msg} = validatePassword(val.trim());
        setConPassword(val.trim());
        // setPasswordError(msg);
    };
    
    const Insert = () => {  
        if(conPassword !== password){
            Toast.show({
                type: 'error',
                text1:'Password and confirm password are not same',
              });
            return;
        }
        if (!name || !email || !password || !phone || !conPassword) {
            //Alert.alert('Please fill in all fields');
            Toast.show({
                type: 'error',
                text1:'Please fill in all fields',
              });
            return;
        }

        const registerData = {
            first_name: name,
            email: email,
            password: password,
            mobile: phone,
        };

        api
            .post('insertRegister.php', registerData)
            .then(response => {
                console.log('Error11',response.data);
                if(response.data.msg === 'Failed'){
                    Toast.show({
                        type: 'error',
                        text1:'Email already exist',
                      });
                    return;
                  }
        
                if (response.status === 200) {
                    // setTimeout(() => {
                    //     SendEmail();
                    // }, 500);
                    //Alert.alert('You have successfully registered');
                    Toast.show({
                        type: 'error',
                        text1:'You have successfully registered',
                      });
                    return;
                            setTimeout(() => {
                        navigation.navigate(StackNav.Login)
                    }, 500);
                } else {
                    console.error('Error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            }

            );

    };

    const SendEmail = () => {
        const to = email;
        const subject = "Login Registration";
        api
            .post('/commonApi/sendUseremailSignUp', { to, subject })
            .then(response => {
                if (response.status === 200) {
                    Alert.alert('You have successfully registered');
                    setTimeout(() => {
                        navigation.navigate(StackNav.Login)
                    }, 500);
                } else {
                    console.error('Error');
                }
            })
    }
    // Icons
    const EmailIcon = () => {
        return <Ionicons name="mail" size={moderateScale(20)} color={'black'} />;
    };
    const NameIcon = () => {
        return <FontAwesome name="user" size={moderateScale(20)} color={'black'} />;
    };
    const PhoneIcon = () => {
        return <FontAwesome name="phone" size={moderateScale(20)} color={'black'} />;
    };

    // Focus
    const onFocusName = () => {
        onFocusInput(setNameInputStyle);
        onFocusIcon(setNameIcon);
    };
    const onFocusEmail = () => {
        onFocusInput(setEmailInputStyle);
        onFocusIcon(setEmailIcon);
    };
    const onFocusPhone = () => {
        onFocusInput(setPhoneInputStyle);
        onFocusIcon(setPhoneIcon);
    };
    const onFocusPassword = () => {
        onFocusInput(setPasswordInputStyle);
        onFocusIcon(setPasswordIcon);
    };
    const onFocusConfPassword = () => {
        onFocusInput(setConPasswordInputStyle);
        onFocusIcon(setPasswordIcon);
    };

    // Blur
    const onBlurName = () => {
        onBlurInput(setNameInputStyle);
        onBlurIcon(setNameIcon);
    };
    const onBlurEmail = () => {
        onBlurInput(setEmailInputStyle);
        onBlurIcon(setEmailIcon);
    };
    const onBlurPhone = () => {
        onBlurInput(setPhoneInputStyle);
        onBlurIcon(setPhoneIcon);
    };
    const onBlurPassword = () => {
        onBlurInput(setPasswordInputStyle);
        onBlurIcon(setPasswordIcon);
    };
    const onBlurConPassword = () => {
        onBlurInput(setConPasswordInputStyle);
        onBlurIcon(setPasswordIcon);
    };


    const PasswordIcon = () => (
        <Ionicons
            name="lock-closed"
            size={moderateScale(20)}
            color={'black'}
        />
    );
 
    const onPressSignIn = () => {
        navigation.navigate(StackNav.Login);
    };

    const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);


    return (
        <ESafeAreaView style={styles.root}>
        <ScrollView>
        <KeyBoardAvoidWrapper contentContainerStyle={{ flex: 1 }}>
            <ImageBackground
          source={require('../../assets/images/sky.jpg')} // Replace with your gradient image
          style={styles.backgroundImage}
        >
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                    <ArrowIcon/>
                    <EText type={'m12'} style={styles.signUpText}>Getting Started</EText>
                        <TouchableOpacity onPress={onPressSignIn}>
                            <EText type={'m12'} style={styles.getStartedText}>Sign In</EText>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.logoBg11]}>
            <AppFavicon
                width={moderateScale(90)}
                height={moderateScale(90)}
                style={[styles.logoBg]}
            />
          </View>
                    <View style={styles.elevation}></View>

                    <View style={styles.formContainer}>
                    <EText type={'b16'} style={styles.welcomeText}>
                Getting Started
              </EText>
              <EText type={'b16'} style={styles.enterDetailsText}>
                Enter your details to continue
              </EText>
                        <EInput
                            label="Name"
                            placeholderTextColor={colors.primary5}
                            keyBoardType={'default'}
                            _value={name}
                            autoCapitalize={'none'}
                            // insideLeftIcon={() => <FontAwesome name="user" size={moderateScale(20)} color={'black'} />}
                            toGetTextFieldValue={onChangedName}
                            inputContainerStyle={styles.inputContainerStyle}
                            inputBoxStyle={styles.inputBoxStyle}
                        />

                      
                            <EInput
                                label={strings.email}
                                placeholderTextColor={colors.primary5}
                                keyBoardType={'email-address'}
                                _value={email}
                                _errorText={emailError}
                                errorStyle={colors.primary5}
                                autoCapitalize={'none'}
                                toGetTextFieldValue={onChangedEmail}
                                inputContainerStyle={styles.inputContainerStyle}
                            inputBoxStyle={styles.inputBoxStyle}
                                _onFocus={onFocusEmail}
                                onBlur={onBlurEmail}
                            />


                        <EInput
                            label="Phone"
                            placeholderTextColor={colors.primary5}
                            keyBoardType={'phone-pad'}
                            _value={phone}
                            autoCapitalize={'none'}
                            // insideLeftIcon={() => <FontAwesome name="phone" size={moderateScale(20)} color={'black'} />}
                            toGetTextFieldValue={onChangedPhone}
                            inputContainerStyle={styles.inputContainerStyle}
                            inputBoxStyle={styles.inputBoxStyle}
                            keyboardType="phone-pad"  // Ensures only numeric keyboard is shown
                            maxLength={9}
                        />

                        <EInput
                            label="Password"
                            placeholderTextColor={colors.primary5}
                            keyBoardType={'default'}
                            _value={password}
                            autoCapitalize={'none'}
                            // insideLeftIcon={() => <Ionicons name="lock-closed" size={moderateScale(20)} color={'black'} />}
                            toGetTextFieldValue={onChangedPassword}
                            inputContainerStyle={styles.inputContainerStyle}
                            _isSecure={isPasswordVisible}
                            inputBoxStyle={styles.inputBoxStyle}
                            rightAccessory={() => (
                                <TouchableOpacity onPress={onPressPasswordEyeIcon}>
                                    <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={moderateScale(20)} color={'black'} />
                                </TouchableOpacity>
                            )}
                        />

                        <EInput
                            label="Confirm Password"
                            placeholderTextColor={colors.primary5}
                            keyBoardType={'default'}
                            _value={conPassword}
                            autoCapitalize={'none'}
                            // insideLeftIcon={() => <Ionicons name="lock-closed" size={moderateScale(20)} color={'black'} />}
                            toGetTextFieldValue={onChangedConfirmPassword}
                            inputContainerStyle={styles.inputContainerStyle}
                            _isSecure={isPasswordVisible}
                            inputBoxStyle={styles.inputBoxStyle}
                            rightAccessory={() => (
                                <TouchableOpacity onPress={onPressPasswordEyeIcon}>
                                    <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={moderateScale(20)} color={'black'} />
                                </TouchableOpacity>
                            )}
                        />

                       
                          <EButton
                                title="Sign Up"
                                type={'S16'}
                                color={isSubmitDisabled && colors.white}
                                containerStyle={styles.signBtnContainer}
                                onPress={(event) => {
                                    Insert(event)
                                }
                                }
                                bgColor={isSubmitDisabled ? colors.primary6 : colors.primary6}
                                />
                    </View>
                </View>
                </ImageBackground>
            </KeyBoardAvoidWrapper>
            </ScrollView>
            </ESafeAreaView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    root:{
        flex:1,
        justifyContent:'center',
        flexDirection:'column',
       alignContent:'center',
        backgroundColor:'#004AAD',
      },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
      },
      logoBg:{
        backgroundColor:"#fff",
        borderRadius:20,
      
      },
      logoBg11:{
        flex: 2,
        justifyContent: 'center',
        paddingHorizontal: 150,
        marginBottom:47,
        marginTop:50,
      },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 90,
        marginTop: 20,
    },
    arrowIcon: {
        marginRight: 25,
        color: '#FFF',
        marginTop:20,
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
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    signUpText: {
        color: '#FFFFFF',
        fontSize:20,
        marginTop:18,
      },
      getStartedText: {
        color: '#FFF',
        marginLeft: 10,
        backgroundColor: '#85c1f9',
        padding:10,
        borderRadius:8,
        marginTop:15,
          },
    signInText: {
        fontSize: 16,
        color: '#1E90FF',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    formContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '100%',
        paddingBottom:50,
        backgroundColor: '#FFF',
        borderRadius: 20,
       
    },
    elevation:{
        backgroundColor: '#93c5f3',  // Use a darker color for a darker shadow
        borderRadius: 60,  // Increase the blur radius to spread the shadow out more
        elevation: 8, 
        Opacity: 0.9,    // Increase the opacity to make the shadow darker
        paddingTop: 15,
        height:50,
        marginBottom:-35,
        marginLeft:15,
        marginRight:15,
    }, 
    inputContainerStyle: {
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        marginVertical: 10,
        paddingHorizontal: 15,
        marginTop:0,
        marginLeft:20,
        marginRight:20,
    },
    inputBoxStyle: {
        color: '#333',
        borderBottomWidth:0,
        fontFamily: 'Gilroy-Medium',
    },
    signBtnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
        marginVertical: 10,
        backgroundColor: '#1E90FF',
        marginLeft:20,
        marginRight:20,
    },
});
