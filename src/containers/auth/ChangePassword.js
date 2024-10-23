// Library Imports
import { StyleSheet, View, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import { AppFavicon } from '../../assets/svgs';
import Icon from 'react-native-vector-icons/FontAwesome';

// Local Imports
import strings from '../../i18n/strings';
import { styles } from '../../themes';
import { getHeight, moderateScale } from '../../common/constants';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EInput from '../../components/common/Einpuut';
import { validateEmail } from '../../utils/validators';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import EButton from '../../components/common/EButton';
import api from '../../api/api';
import EText from '../../components/common/EText';
import { StackNav } from '../../navigation/NavigationKeys';
import Toast from 'react-native-toast-message';
import EHeader from '../../components/common/EHeader';

const ForgotPass = () => {
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
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
    const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);

    const onFocusInput = onHighlight => onHighlight(FocusedStyle);
    const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
    const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
    const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

    useEffect(() => {
        if (
            email.length > 0 &&
            !emailError
        ) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [email, emailError]);

    const onChangedEmail = val => {
        setPassword(val.trim());
    };

    const EmailIcon = () => {
        return <Ionicons name="mail" size={moderateScale(20)} color={'black'} />;
    };

    const onFocusEmail = () => {
        onFocusInput(setEmailInputStyle);
        onFocusIcon(setEmailIcon);
    };
    const onBlurEmail = () => {
        onBlurInput(setEmailInputStyle);
        onBlurIcon(setEmailIcon);
    };

    const onPressSignWithPassword = async () => {
        if(password === ''){
        Toast.show({
            type: 'error',
            text1:'Please enter the new password',
          });
        }
    api.post('forgotPassword.php', {
            email: email,
        }).then(async (res) => {
            SendEmail(res.data.data);
        }).catch(() => {
            //Alert.alert('Please verify the email address and try again.')
            Toast.show({
                type: 'error',
                text1:'Please verify the email address and try again',
              });
        })
    };

    const SendEmail = () => {
        if(password === ''){
            Toast.show({
                type: 'error',
                text1:'Please enter the new password',
            });
        } else {
            setLoading(true);
            const otp = '1234';
            const useremail = 'moin@usoftsolutions.com';

            api.post('https://ncapi.unitdtechnologies.com:3003/commonApi/sendTamizhyChangePasswordOtp', 
            { otp, useremail, })
            .then(response => {
                if (response.status === 200) {
                    Toast.show({
                        type: 'error',
                        text1:'Change Password',
                        text2:'OTP has been sent to your registered email address. Please enter the otp and update',
                    });
                    setLoading(false);
                    navigation.navigate(StackNav.OtpVerifyChangePassword, {newpassword:password, otp:otp, useremail:useremail});
                } else {
                    console.error('Error');
                    setLoading(false);
                }
            });
        }
    };

    const onPressSignIn = () => {
        navigation.navigate(StackNav.Login);
    };

    const signInWithPhoneNumber = async (phone) => {
        try {
          const confirmation = await auth().signInWithPhoneNumber(phone);
          setConfirm(confirmation);
        } catch (error) {
          console.error('Error sending OTP:', error);
        }
    };
    
    // if ( loading ) {
    //     return (
    //       <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
    //         <ActivityIndicator size={"large"} color="#0000ff"  />
    //       </View>
    //     )
    //   }
    
    return (
        <ESafeAreaView style={localStyles.root}>
            <KeyBoardAvoidWrapper contentContainerStyle={{ flex: 1 }}>
                <ImageBackground
                     source={require('../../assets/images/sky.jpg')}
                    style={localStyles.backgroundImage}
                >
                    <View style={localStyles.mainContainer}>
                    <View style={localStyles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={localStyles.iconContainer}>
                            <Icon name="arrow-left" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={[localStyles.logoBg11]}>
                            <AppFavicon
                                width={moderateScale(90)}
                                height={moderateScale(90)}
                                style={[localStyles.logoBg]}
                            />
                        </View>

                        <View style={[{ flex: 2 }]}></View>

                        <View style={[localStyles.loginBg, { justifyContent: 'space-between' }]}>                            
                            <View>
                            <EText type={'b16'} style={localStyles.welcomeText}>
                                Change Password?
                            </EText>
                            <EText type={'b16'} style={localStyles.enterDetailsText}>
                                Enter your details to continue
                            </EText>
                            {
                                <EInput
                                    label={'Enter new password'}
                                    placeholderTextColor={colors.primary5}
                                    keyBoardType={'default'}
                                    _value={password}
                                    errorStyle={colors.primary5}
                                    autoCapitalize={'none'}
                                    //insideLeftIcon={() => <EmailIcon />}
                                    toGetTextFieldValue={onChangedEmail}
                                    inputContainerStyle={[
                                        localStyles.inputContainerStyle,
                                        emailInputStyle,
                                    ]}
                                    inputBoxStyle={[localStyles.inputBoxStyle]}
                                />}
                            {/* { loading &&
                                <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                                    <ActivityIndicator size={"large"} color="#0000ff"  />
                                </View>
                            } */}
                               {
                                <EButton
                                    title='Verify'
                                    type={'S16'}
                                    color={isSubmitDisabled && colors.white}
                                    containerStyle={localStyles.signBtnContainer}
                                    onPress={SendEmail}
                                    bgColor={isSubmitDisabled && colors.primary6}
                                />
                                }
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </KeyBoardAvoidWrapper>
        </ESafeAreaView>
    );
};

export default ForgotPass;

const localStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    signBtnContainer: {
        width: '92%',
        ...styles.mv20,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:15,
    },
    inputContainerStyle: {
        height: 50,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 0.4,
        paddingLeft: 15,
        borderColor: 'white',
        width: '92%',
        marginLeft:15,
        marginRight:15,
        paddingHorizontal: 5,
        fontFamily: 'Gilroy-Medium',
        },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    inputBoxStyle: {
        color: '#333',
        borderBottomWidth:0,
        fontFamily: 'Gilroy-Medium',
    },
    root: {
        flex: 3,
        justifyContent: 'center',
        flexDirection: 'column',
        alignContent: 'center',
        backgroundColor: 'white',
    },
    enterDetailsText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#6c757d',
        fontSize:13,
      },
    
    loginBg: {
        backgroundColor: "#fff",
        ...styles.ph20,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 40,
    },
    banner: {
        width: '60%',
        height: '30%',
        alignSelf: 'flex-end',
    },
    signUpContainer: {
        ...styles.rowCenter,
        ...styles.mb40,
        color: '#007BFF',
    },
    logoBg11:{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:47,
        marginTop:120,
    },

    logoBg:{
        backgroundColor:"#fff",
        borderRadius:20,      
    },
    welcomeText: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
        fontSize:30,       
      },
    emailLabel: {
        marginBottom:10,
        marginLeft:3,
    },
    header: {
        fontFamily: 'Gilroy-Medium',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:30,
        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        left: 30,
        paddingTop:50,
    },        
});