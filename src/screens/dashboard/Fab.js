// src/screens/dashboard/Fab.js

import React, { useState, useEffect } from 'react';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Fab() {
  const navigation = useNavigation();
  const [fab, setFab] = useState(false);

  const onChangeFab = ({open}) => {
    setFab(open);
  }

  return (
    <FAB.Group
      style={{width: '100%'}}
      open={fab}
      icon={fab ? 'fish' : 'plus'}
      actions={[
        {
          icon: 'shaker-outline',
          label: 'Feed',
          onPress: () => console.log('Pressed feed'),
        },
        {
          icon: 'alert-outline',
          label: 'Warning',
          onPress: () => console.log('Pressed warning'),
        },
        {
          icon: 'binoculars',
          label: 'Behavior',
          onPress: () => console.log('Pressed behavior'),
        },
        {
          icon: 'approximately-equal',
          label: 'Compatibility',
          onPress: () => navigation.navigate('AddCompatibility'),
        },
        {
          icon: 'tag-outline',
          label: 'Family',
          onPress: () => console.log('Pressed family'),
        },
        {
          icon: 'fishbowl-outline',
          label: 'Tank',
          onPress: () => navigation.navigate('AddTank'),
        }
      ]}
      onStateChange={onChangeFab}
      onPress={() => {
        if (fab) {
          navigation.navigate('AddSpecies');
        }
      }}
    />
  );
}