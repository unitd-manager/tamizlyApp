// Library Imports
import { StyleSheet, View, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import { AppFavicon } from '../../assets/svgs';

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

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
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
        const { msg } = validateEmail(val.trim());
        setEmail(val.trim());
        setEmailError(msg);
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

    const SendEmail = (emailData) => {
console.log('emailData',emailData.email);
        const to = emailData.email;
        const password = emailData.pass_word;

        api.post('https://ncapi.unitdtechnologies.com:3003/commonApi/sendTamizhyForgotEmail', 
            { to,
              password, })
            .then(response => {
                if (response.status === 200) {
                    Toast.show({
                        type: 'error',
                        text1:'Forgot Password',
                        text2:'Password has been sent to your registered email address. Please enter the password to continue logging in',
                      });
                    navigation.navigate(StackNav.Login)
                } else {
                    console.error('Error');
                }
            });
    };

    const onPressSignIn = () => {
        navigation.navigate(StackNav.Login);
    };

    return (
        <ESafeAreaView style={localStyles.root}>
            {/* <EHeader isHideBack/> */}
            <KeyBoardAvoidWrapper contentContainerStyle={{ flex: 1 }}>
                <ImageBackground
                     source={require('../../assets/images/sky.jpg')}
                    style={localStyles.backgroundImage}
                >
                    <View style={localStyles.mainContainer}>
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
                                Forgot Password?
                            </EText>
                            <EText type={'b16'} style={localStyles.enterDetailsText}>
                                Enter your details to continue
                            </EText>
                                <EInput
                                    label={'Enter your registered email'}
                                    placeholderTextColor={colors.primary5}
                                    keyBoardType={'email-address'}
                                    _value={email}
                                    _errorText={emailError}
                                    errorStyle={colors.primary5}
                                    autoCapitalize={'none'}
                                    //insideLeftIcon={() => <EmailIcon />}
                                    toGetTextFieldValue={onChangedEmail}
                                    inputContainerStyle={[
                                        localStyles.inputContainerStyle,
                                        emailInputStyle,
                                    ]}
                                    inputBoxStyle={[localStyles.inputBoxStyle]}
                                    _onFocus={onFocusEmail}
                                    onBlur={onBlurEmail}
                                />

                                <EButton
                                    title='Send'
                                    type={'S16'}
                                    color={isSubmitDisabled && colors.white}
                                    containerStyle={localStyles.signBtnContainer}
                                    onPress={onPressSignWithPassword}
                                    bgColor={isSubmitDisabled && colors.primary6}
                                />

                                <TouchableOpacity
                                    onPress={onPressSignIn}
                                    style={localStyles.signUpContainer}>
                                    <EText
                                        type={'m15'}
                                        color={colors.dark ? colors.grayScale7 : colors.grayScale5}>
                                        Back to Login
                                    </EText>
                                </TouchableOpacity>
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
    }

});