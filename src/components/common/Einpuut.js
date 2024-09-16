import React, { useState } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const EInput = ({
  label,
  _value,
  _errorText,
  insideLeftIcon,
  toGetTextFieldValue,
  inputContainerStyle,
  inputBoxStyle,
  _isSecure,
  _onFocus,
  onBlur,
  rightAccessory,
  placeholderTextColor,
  autoCapitalize,
  keyBoardType,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (_onFocus) _onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  // Display error message as a toast if _errorText is present
  /*if (_errorText) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: _errorText,
    });
  }*/

  return (
    <View style={[styles.container, inputContainerStyle]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {insideLeftIcon && insideLeftIcon()}
        <View style={{ flex: 1 }}>
          <Animated.Text
            style={[
              styles.label,
              {
                top: isFocused || _value ? 0 : 18,
                fontSize: isFocused || _value ? 14 : 14,
                color: isFocused ? '#aaa' : placeholderTextColor || '#aaa',
              },
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={[styles.input, inputBoxStyle]}
            value={_value}
            secureTextEntry={_isSecure}
            onChangeText={toGetTextFieldValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize={autoCapitalize}
            keyboardType={keyBoardType}
            placeholder=""
          />
        </View>
        {rightAccessory && rightAccessory()}
      </View>
      {/* Remove in-line error text since it's now shown as a toast */}
      {/* {_errorText ? <Text style={styles.errorText}>{_errorText}</Text> : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    height: 60,
    fontSize: 16,
    color: '#333',
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    position: 'absolute',
    left: 0,
    paddingLeft: 0,
    color: '#000',
    fontFamily: 'Gilroy-Medium',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default EInput;
