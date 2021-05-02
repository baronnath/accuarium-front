// src/components/SpeciesCard.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { theme } from '../theme';
import { backend } from '../../app';

type Props = React.ComponentProps<typeof PaperCard>;

const SpeciesCard = ({ species, ...props }: Props) => (
  <Card
    style={styles.card}
    theme={theme}
    {...props}
  >
    <Card.Content>
      <Title>{species.name}</Title>
      <Paragraph>Card content</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: backend.imagesUrl + species._id + '.jpg' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card:{
    flex: 1,
    width: '100%',
    marginBottom: 20,
  }
});

export default memo(SpeciesCard);