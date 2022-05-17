// src/components/Alert.js

import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { ucFirst } from '../helpers/helpers';
import Header from './Header';
import Paragraph from './Paragraph';

const Toggler = ({ title, description, list, size = 'big', titleStyle, listStyle, ...props }) => {

  const [isExpanded, setExpanded] = useState({ expanded: false });

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } 

  function changeLayout(value, setter) { 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter({ expanded: !value.expanded });
  }

  function getTitle() {
    return (
      <>
        { ucFirst(title) }
        { list && !!list.length &&
          <MaterialCommunityIcons
            name="chevron-down"
            size={size == 'big' ? 20 : 15}
            color={theme.colors.text}
          />
        }
      </>
    );
  }

  return (
    	<>
    		<TouchableOpacity activeOpacity={0.8} onPress={() => { list && !!list.length && changeLayout(isExpanded,setExpanded) }}>
          { size == 'big' ?
              <Header style={[styles.title, titleStyle]}>
                { getTitle() } 
              </Header>
            :
              <Paragraph style={[styles.title, titleStyle]}>
                { getTitle() } 
              </Paragraph>
          }
          
        </TouchableOpacity>

        <View style={{ height: isExpanded.expanded ? null : 0, overflow: 'hidden', justifyContent: 'flex-start' }}>
          <Paragraph style={[styles.description, listStyle]}>
            {description}:
          </Paragraph>
          <View style={styles.container}>
            { list && !!list.length &&
                <Paragraph style={[styles.item, listStyle]}>
                  { list.map((item, i, {length}) => {
                      let comma = i + 1 === length ? '' : ', ';
                      return ucFirst(item) + comma;
                    })
                  }
                </Paragraph>
            }
          </View>
        </View>
      </>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: 0,
    marginTop: 0,
    textAlign: 'left',
  },
  container: {
    marginBottom: theme.container.padding,
  },
  description: {
    fontSize: 12,
    color: theme.colors.lightText,
    marginBottom: 2,
  },
  item: {
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 2,
  },
});

export default memo(Toggler);