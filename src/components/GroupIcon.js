// src/components/GroupIcon.js

import * as React from 'react';
import { createIconSetFromFontello } from '@expo/vector-icons';
import iconsConfig from '../assets/group-icons/config.json';

const Icon = createIconSetFromFontello(iconsConfig, 'group-icons', 'group-icons.ttf');

export default Icon;