// src/components/InputSuggestion.js

import React, { memo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { theme } from '../theme';

function InputSuggestion({ data, callback, attr = null, style, ...props }){
  return (

    	<FlatList style={styles.container}
          data={data}
          keyExtractor={(item) => {return item._id}}
          renderItem={({ item, index, separators }) => (
            <TouchableOpacity onPress={() => attr ? callback(item[attr]) : callback(item) } style={[styles.item, style]}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
      />
  );
}

const styles = StyleSheet.create({
	container: {
    maxWidth: theme.container.maxWidth,
    width:'100%',
    flexGrow: 1,
  },
  item: {
    width: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 7,
    flex:1,
  }
});

export default memo(InputSuggestion);