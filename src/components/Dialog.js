// src/components/Dialog.js

import React, { memo, useState } from 'react';
import { Portal, Dialog as PaperDialog } from 'react-native-paper';
import Button from './Button';
import { theme } from '../theme';

const Dialog = ({ isVisible, setVisible, title, cancelButton, scrollable = false, children, ...props }) => {

    return (
      <Portal>
        <PaperDialog visible={isVisible} onDismiss={() => setVisible(false)} theme={theme}>
          <PaperDialog.Title>{title}</PaperDialog.Title>
          { scrollable ?
            <PaperDialog.ScrollArea>
              <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
                { children }
              </ScrollView>
            </PaperDialog.ScrollArea>
            :
            <PaperDialog.Content>
              { children }
            </PaperDialog.Content>
          }
          <PaperDialog.Actions>
            <Button onPress={() => setVisible(false)} mode="outlined">{cancelButton || 'Cancel'}</Button>
          </PaperDialog.Actions>
        </PaperDialog>
      </Portal>
    );
}

export default memo(Dialog);