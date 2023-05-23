// src/components/SpeciesImage.js

import React, { memo } from 'react';
import { StyleSheet, Image } from 'react-native';
import Paragraph from './Paragraph';
import { backend } from '../../app.json';
import { theme } from '../theme';

const SpeciesImage = ({ img = 'notFound', scientificName = 'accuarium', description = false, style, descriptionStyle, ...props }) => {

  let uri = `${backend.imageDefaultUrl}${scientificName}`;
  if(img && scientificName != 'accuarium')
    uri = `${backend.imagesUrl}species/${scientificName.replace(' ', '-').toLowerCase()}/${img}`;

  function getImageDescription(img) {
    const imgDescriptions = ['male', 'female', 'alevin'];
    let description = img.split('.').shift().split('-').pop(); // Delete the extension and grab the last word
    let found = imgDescriptions.find(desc => desc == description)
    return found !== undefined && i18n.t(`general.${description}`);
  }

  return(
    <>
      <Image
        source={{ uri: uri }}
        style={[styles.speciesImage, style]}
      />
      { 
        img && description &&
        <Paragraph style={descriptionStyle}>{getImageDescription(img)}</Paragraph>
      }
    </>
  );
}

export default memo(SpeciesImage);

const styles = StyleSheet.create({
  speciesImage: {
  },
});

