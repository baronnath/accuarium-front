// src/components/Slider.js

import React, { memo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Button from './Button';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { theme } from '../theme';

function Slider({items, ...props}){


  const [index, setIndex] = useState(0);
  const carouselRef = useRef();

  const sliderWidth = Dimensions.get('window').width - (2*theme.container.padding);

  function _renderItem({item,index}){
      return (
        <View style={styles.item}>
          {item}
          {items.length != (index+1) &&
            <Button mode="outlined" style={styles.button} onPress={() => { carouselRef.current.snapToNext() }}>Next</Button>
          }
        </View>
      )
  }

  return (

      <View style={styles.container}>
      	<Carousel
          data={items}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
          renderItem={_renderItem}
          onSnapToItem = { index => setIndex(index) }
          ref={carouselRef}
        />
        <Pagination
          dotsLength={items.length}
          activeDotIndex={index}
          containerStyle={styles.sliderContainer}
          dotStyle={styles.dot}
          inactiveDotStyle={styles.inactiveDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
	sliderContainer: {
    backgroundColor: theme.colors.transparent,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: theme.colors.lightText,
  },
  inactiveDot: {
    backgroundColor: theme.colors.disabled,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - getStatusBarHeight() - theme.bottomNav.height - 65, // 65 is the pagination height
    flex: 1,
  },
  button: {
    marginTop: 50,
  }
});

export default memo(Slider);