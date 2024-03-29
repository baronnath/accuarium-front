// src/components/Paragraph.js

import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

const Paragraph = ({ style, fontStyle, fontWeight, children }) => {

  let fontOptions;
  if(fontWeight == 'light')
  	if(fontStyle == 'italic')
  		fontOptions = styles.lightItalic;
  	else
  		fontOptions = styles.light;
  else if(fontWeight == 'bold')
  	if(fontStyle == 'italic')
  		fontOptions = styles.boldItalic;
  	else
  		fontOptions = styles.bold;
  else if(fontStyle == 'italic')
		fontOptions = styles.italic;
	else
		fontOptions = styles.regular;

	return(
	  	<Text style={[styles.text,fontOptions,style]}>{children}</Text>
	);
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  regular: {
    fontFamily: 'Montserrat_400Regular',
  },
  italic: {
    fontFamily: 'Montserrat_400Regular_Italic',
  },
  light: {
    fontFamily: 'Montserrat_300Light',
  },
  lightItalic: {
    fontFamily: 'Montserrat_300Light_Italic',
  },
  bold: {
    fontFamily: 'Montserrat_700Bold',
  },
  boldItalic: {
    fontFamily: 'Montserrat_700Bold_Italic',
  },
});

export default memo(Paragraph);