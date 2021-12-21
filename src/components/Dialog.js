// src/components/Dialog.js

import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, ScrollView } from 'react-native';
import { Portal, Dialog as PaperDialog } from 'react-native-paper';
import Button from './Button';
import { theme } from '../theme';
import translator from '../translator/translator';

const Dialog = ({ isVisible, setVisible, title, actions, scrollable = false, children, ...props }) => {

    const user = useSelector(state => state.user.data);
    const i18n = translator(user.locale);

    return (
      <Portal>
        <PaperDialog visible={isVisible} onDismiss={() => setVisible(false)} theme={theme} style={styles.container}>
          <PaperDialog.Title>{title}</PaperDialog.Title>
          { scrollable ?
            <PaperDialog.ScrollArea>
              <ScrollView contentContainerStyle={styles.scroll}>
                { children }
              </ScrollView>
            </PaperDialog.ScrollArea>
            :
            <PaperDialog.Content>
              { children }
            </PaperDialog.Content>
          }
          <PaperDialog.Actions>
            { actions ?
                actions
                :
                <Button onPress={() => setVisible(false)} mode="outlined">{i18n.t('general.cancel')}</Button>
            }
          </PaperDialog.Actions>
        </PaperDialog>
      </Portal>
    );
}

export default memo(Dialog);

const styles = StyleSheet.create({
  container: {
    maxHeight: '80%',
  },
  scroll: {
    paddingVertical: 10,
    // maxHeight: '80%',
  },
});