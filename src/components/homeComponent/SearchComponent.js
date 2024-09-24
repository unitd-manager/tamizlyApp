import {StyleSheet, TouchableOpacity, View, ActivityIndicator, Text} from 'react-native';
import React, {memo} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import EInput from '../common/EInput';
import { Search_Icon} from '../../assets/svgs';
import strings from '../../i18n/strings';
import {moderateScale} from '../../common/constants';

const SearchComponent = props => {
  const {onSearchInput, search, isLoading,error,style } = props;
  const colors = useSelector(state => state.theme.theme);

  if ( isLoading ) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }
  
  if ( error ) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <Text>Error in fetching data... Please check your internet connection</Text>
      </View>
    )
  }

  const searchIcon = () => {
    return (
      <TouchableOpacity >
        <Search_Icon />
      </TouchableOpacity>
    );
  };
  return (
    <View style={[{marginLeft:30, marginRight:10,}]}>
      <EInput
        key="searchProject"
        placeHolder="Search for all services"
        keyBoardType={'default'}
        _value={search}
        toGetTextFieldValue={onSearchInput}
        autoCapitalize={'none'}
        insideLeftIcon={searchIcon}
        inputBoxStyle={localStyles.inputBox}
        inputContainerStyle={[
          localStyles.inputContainerStyle,
        ]}
        
      />
     
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    color:'red',
    backgroundColor:'#f3f4f6',
  },
  inputBox: {
    color: '#333',
    fontFamily: 'Gilroy-Medium',
    fontSize:14,
  },
});

export default memo(SearchComponent);
