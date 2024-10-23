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

const ForgotPass = ({route}) => {

  const { otp,useremail,newpassword} = route.params;

  console.log('otp',otp)
  console.log('useremail',useremail)
  console.log('newpassword',newpassword)
    const navigation = useNavigation()

    const colors = useSelector(state => state.theme.theme);

    const BlurredStyle = {
        // backgroundColor: colors.inputBg,
        borderColor: colors.primary5,
    };

    const [loading, setLoading] = useState(false);

    const [compareOtp, setOtp] = useState('');

    const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  
    const onChangedEmail = val => {
        setOtp(val.trim());
    };

    const onPressSignWithPassword = async () => {
        if(otp !== compareOtp){
          Toast.show({
            type: 'error',
            text1:'Otp you have entered is incorrect!',
          });
        } else {
          api.post('updatePassword.php', {
              password: newpassword,
              email: useremail,
          }).then(async (res) => {
                Toast.show({
                  type: 'error',
                  text1:'Your password changed successfully',
                });
            }).catch(() => {
              //Alert.alert('Please verify the email address and try again.')
              Toast.show({
                  type: 'error',
                  text1:'Please check the process',
                });
          })
        }
    };

    const onPressSignIn = () => {
      navigation.navigate(StackNav.Profile);
    };

    return (
        <ESafeAreaView style={localStyles.root}>
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
                                Enter OTP
                            </EText>
                            {
                                <EInput
                                    label={'OTP'}
                                    placeholderTextColor={colors.primary5}
                                    keyBoardType={'default'}
                                    _value={compareOtp}
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
                                    title='Submit'
                                    type={'S16'}
                                    containerStyle={localStyles.signBtnContainer}
                                    onPress={onPressSignWithPassword}
                                />
                                }
                                <TouchableOpacity
                                    onPress={onPressSignIn}
                                    style={localStyles.signUpContainer}>
                                    <EText
                                        type={'m15'}
                                        color={colors.dark ? colors.grayScale7 : colors.grayScale5}>
                                        Back to Home
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