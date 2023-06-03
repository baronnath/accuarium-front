// src/components/SpeciesSearchFilter.js

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios } from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { RadioButton, ToggleButton, Switch, Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Subheader from '../../../components/Subheader';
import Paragraph from '../../../components/Paragraph';
import Dialog from '../../../components/Dialog';
import Modal from '../../../components/Modal';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import Surface from '../../../components/Surface';
import translator from '../../../translator/translator';
import helpers from '../../../helpers/helpers';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';

export default function SpeciesSearchFilter({ visible, setVisible, filters, changeFilter, removeFilter, clearFilter, resetSearch }) {

  const excludingTypes = ['amphibian','plant']; 

  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.tanks);
  const locale = user.locale;

  const [paramFilterSwitch, setParamFilterSwitch] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [types, setTypes] = useState(null);
  const [families, setFamilies] = useState(null);
  const [groups, setGroups] = useState(null);
  const [depths, setDepths] = useState(null);
  const [behaviors, setBehaviors] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [colors, setColors] = useState(null);

  const i18n = translator(locale);

  useEffect(() => {

    Promise.all([
      axios.get(backend.url + '/types'),
      axios.get(backend.url + '/families'),
      axios.get(backend.url + '/groups'),
      axios.get(backend.url + '/depths'),
      axios.get(backend.url + '/behaviors'),
      axios.get(backend.url + '/feeds'),
      axios.get(backend.url + '/colors'),
    ])
    .then(res => {
      setTypes(res[0].data.types);
      setFamilies(res[1].data.families);
      setGroups(res[2].data.groups);
      setDepths(res[3].data.depths);
      setBehaviors(res[4].data.behaviors);
      setFeeds(res[5].data.feeds);
      setColors(res[6].data.colors);

    })
    .catch(err => {
        handleAlert(err);          
    });

  }, []);


  function getRegularInput(key) {
    return <TouchableOpacity style={styles.row} onPress={() => { setModalVisible(key) }}>
      <Paragraph style={[styles.subheader, styles.leftSide]}>{i18n.t(`general.${key}.one`)}</Paragraph>
      <Paragraph fontWeight='bold' style={styles.centerSide}>
        {filters[key] && (filters[key].displayValue && helpers.isArray(filters[key].displayValue) ?
          filters[key].displayValue.join(', ')
          :
          filters[key].displayValue)
        }
      </Paragraph>
      <View style={styles.rightSide}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color={theme.colors.lightText}
        />
      </View>
    </TouchableOpacity>;
  }

  function getParamInput(keyAbbr, icons, measure = null) {
    function getDisplay(key, value) {
      return i18n.t(`general.${key}`) + `: ${value}` + (measure ? i18n.t(`measures.${user.units[measure]}Abbr`) : '');
    }
    return <View style={styles.row}>
      <TextInput
        label={i18n.t('general.minimum')}
        dense={true}
        style={[styles.inlineInput, styles.leftInput]}
        name={`min${keyAbbr}`}
        returnKeyType="next"
        value={filters[`min${keyAbbr}`] ? filters[`min${keyAbbr}`].value : ''}
        onChangeText={(value) => changeFilter(`min${keyAbbr}`, { displayValue: getDisplay(`min${keyAbbr}`, value), value: value}) }
        autoCapitalize="none"
        textContentType="none"
        keyboardType="numeric"
        icon={icons[0]}
      />
      <TextInput
        label={i18n.t('general.maximum')}
        dense={true}
        style={[styles.inlineInput, styles.rightInput]}
        name={`max${keyAbbr}`}
        returnKeyType="next"
        value={filters[`max${keyAbbr}`] ? filters[`max${keyAbbr}`].value : ''}
        onChangeText={(value) => changeFilter(`max${keyAbbr}`, { displayValue: getDisplay(`max${keyAbbr}`, value), value: value}) }
        autoCapitalize="none"
        textContentType="none"
        keyboardType="numeric"
        icon={icons[1]}
      />
    </View>
  }

  function getParamUnit(measure = null) {
    let unit = i18n.t(`measures.${user.units[measure]}Abbr`);
    return `(${unit})`;
  }

  function getActions(onClose, clear = true) {
    return (
      <>
        { clear && 
          <Button
            onPress={() => {
              resetSearch();
              clearFilter();
            }}
            mode="text"
            style={styles.inlineButton}
          >
            {i18n.t('general.clear')}
          </Button>
        }
        <Button
          onPress={() => {
            onClose(false);
            resetSearch();
          }}
          mode="text"
          style={styles.inlineButton}
        >
          {i18n.t('general.ok')}
        </Button>
      </>
    );
  }

  function getModalContent(key) {
    let array = [];
    let style = 'radio';

    switch(key) {
      case 'tank':
        array = tanks;
        break;
      case 'family':
        if(filters.type){
          array = families.filter((family) => String(family.type) == String(filters.type.value))
        }else
          array = families;
        break;
      case 'group':
        if(filters.type){
          array = groups.filter((group) => String(group.type) == String(filters.type.value))
        }else
          array = groups;
        break;
      case 'depth':
        array = depths;
        break;
      case 'feed':
        array = feeds;
        break;
      case 'behavior':
        array = behaviors;
        style = 'checkbox';
        break;
      case 'color':
        array = colors;
        style = 'checkbox';
        break;
      default:
        break;
    }

    function getDescription(key, item) {
      switch(key) {
        case 'tank':
          return item.liters && `${item.liters} L`;
        default:
          return '';
      }
    }

    return <>
      <Paragraph style={styles.modalTitle}>{i18n.t(`speciesSearchFilter.${key}ModalTitle`)}</Paragraph>
      <Paragraph style={styles.modalParagraph}>{i18n.t(`speciesSearchFilter.${key}ModalParagraph`)}</Paragraph>
      <ScrollView style={styles.listContainer}>
        { array && !!array.length ?
            style === 'radio' ?
              <RadioButton.Group
                value={filters[key] ? filters[key].value : null}
              >
                {
                  array.map(item => {  
                    return (
                      <RadioButton.Item
                        label={helpers.ucFirst(item.name[locale] ? item.name[locale] : item.name)}
                        value={item._id}
                        style={styles.list}
                        mode="ios"
                        key={item._id}
                        onPress={() => {
                          setModalVisible(false);
                          changeFilter(key, { displayValue: helpers.ucFirst(item.name[locale] ? item.name[locale] : item.name), value: item._id })
                        }}
                      />
                    )
                  })
                }
              </RadioButton.Group>
            :
              array.map(item => {  
                return (
                  <TouchableOpacity
                    style={[styles.row, styles.checkboxContainer]}
                    onPress={() => {
                      changeFilter(key, { displayValue: helpers.ucFirst(item.name[locale] ? item.name[locale] : item.name), value: item._id }, true)
                    }}
                  >
                    { item.icon ? 
                        <MaterialCommunityIcons size={24} style={styles.leftCheckbox} name={item.icon} color={theme.colors.text}/>
                      : !!item.hex && item.hex != '-1' ?
                        <View style={[styles.circle, {backgroundColor: `#${item.hex}`}]} />
                        :
                        <LinearGradient style={styles.circle}
                          colors={['#ee5353', '#ff9f43', '#ffeaa7', '#00b894', '#2e86de', '#6c5ce7']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 1 }}
                        />
                    }
                 
                    <Paragraph style={[styles.subheader, styles.centerCheckbox]}>{helpers.ucFirst(item.name[locale] ? item.name[locale] : item.name)}</Paragraph>
                    <Checkbox.Item
                      style={styles.rightCheckbox}
                      status={filters[key] && filters[key].value.includes(item._id) ? 'checked' : 'unchecked'}
                    />
                  </TouchableOpacity>
                )
              })
        :
          <Paragraph style={{paddingVertical: 20}}>{i18n.t(`${key}.no${helpers.ucFirst(key)}`)}</Paragraph>
        }
      </ScrollView>
    </>
  }

  function switchParamFilterSwitch() {
    setParamFilterSwitch(!paramFilterSwitch);
    if(paramFilterSwitch) 
      removeFilter('tank'); 
  }

  const styles = StyleSheet.create({
    background: {
    },
    row: {
      flexDirection: 'row',
    },
    header: {
      marginTop: 15,
      fontSize: 15,
      lineHeight: 15,
    },
    subheader: {
      marginTop: 15,
      // color: theme.colors.lightText,
      fontSize: 12,
      lineHeight: 10,
    },
    inlineButton: {
      width: 'auto',
    },
    inlineInput: {
      flex: 1,
      marginVertical: 0,
    },
    leftInput: {
      marginRight: 5,
    },
    rightInput: {
      marginLeft: 5,
    },
    leftSide: {
      flex: 5,
      textAlign: 'left',
      lineHeight: 15,
      alignSelf: 'center',
    },
    centerSide: {
      flex: 7,
      textAlign: 'left',
      marginTop: 15,
    },
    rightSide: {
      flex: 1,
      alignItems: 'flex-end',
      alignSelf: 'center',
      // textAlign: 'right',
    },
    leftSwitch: {
      flex: 1,
      // color: theme.colors.lightText,
      textAlign: 'left',
      alignSelf: 'center',
    },
    centerSwitch: {
      flex: 7,
      textAlign: 'left',
      marginTop: 15,
    },
    rightSwitch: {
      flex: 1,
      alignItems: 'flex-end',
      alignSelf: 'center',
      // textAlign: 'right',
    },
    checkboxContainer: {
    },
    leftCheckbox: {
      flex: 2,
      // color: theme.colors.lightText,
      textAlign: 'left',
      alignSelf: 'center',
    },
    centerCheckbox: {
      flex: 7,
      textAlign: 'left',
      lineHeight: 12,
      alignSelf: 'center',
    },
    rightCheckbox: {
      flex: 1,
      alignItems: 'flex-end',
    },
    link: {
      alignSelf: 'flex-end',
      color: theme.colors.secondary,
      marginVertical: 10,
    },
    listContainer: {
      width: '100%',
      // maxHeight: '70%',
    },
    list:{
      paddingVertical: 10,
    },
    listRight: {
      alignSelf: 'center',
    },
    toggleContainer: {
      flex: 1,
      justifyContent: 'space-around',
    },
    toggleButton: {
      height:50,
      width:50,

    },
    modalTitle: {
      fontSize: 30,
      lineHeight: 32,
      marginVertical: 15,
      marginBottom: 0,
    },
    modalParagraph: {
      marginTop: 0,
      color: theme.colors.lightText,
    },
    circle: {
      alignSelf: 'center',
      width: 25,
      height: 25,
      borderRadius: 25/2,
      marginRight: 10,
      borderColor: theme.colors.lightText,
      borderWidth: 2,
    },
    paramsSurface: {
      marginTop: 0,
      marginHorizontal: 0,
    },
    paramsButtons: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    paramsButton: {
      opacity: !paramFilterSwitch ? 0.3 : 1,
    },
    tankButton: {
      opacity: paramFilterSwitch ? 0.3 : 1,
    },
    paramsButtonLabel: {
      fontSize: 10,
      opacity: 1,
    },
  });

  return (
    <>
      <Dialog
        isVisible={visible}
        setVisible={() => setVisible()}
        title={i18n.t('speciesSearchFilter.title')}
        cancelButton={i18n.t('general.cancel')}
        actions={getActions(setVisible, true)}
        scrollable={true}
      >
        <Surface style={styles.paramsSurface}>
          <View style={styles.paramsButtons}>
            <Button
              onPress={() => switchParamFilterSwitch() }
              style={[styles.inlineButton, styles.tankButton]}
              labelStyle={styles.paramsButtonLabel}
            >
              {i18n.t('speciesSearchFilter.byTankCompatibility')}
            </Button>
            <Button
              onPress={() => switchParamFilterSwitch() }
              style={[styles.inlineButton, styles.paramsButton]}
              labelStyle={styles.paramsButtonLabel}
            >
              {i18n.t('speciesSearchFilter.byParams')}
            </Button>
          </View>

          { paramFilterSwitch ?
            <>
              {/*<Subheader style={styles.header}>{i18n.t('general.parameter.other')}</Subheader>*/}

              <Subheader style={styles.subheader}>{i18n.t('general.temperature')} {getParamUnit('temperature')}</Subheader>
              { getParamInput('Temp', ['thermometer-low','thermometer-high'], 'temperature') }

              <Subheader style={styles.subheader}>{i18n.t('general.ph')}</Subheader>
              { getParamInput('Ph', ['water-outline','water']) }
              
              <Subheader style={styles.subheader}>{i18n.t('general.gh')} {getParamUnit('hardness')}</Subheader>
              { getParamInput('Gh', ['crop-free','focus-field'], 'hardness') }

              <Subheader style={styles.subheader}>{i18n.t('general.kh')} {getParamUnit('hardness')}</Subheader>
              { getParamInput('Kh', ['crop-free','focus-field-horizontal'], 'hardness') }
                
            </>
          :
            <>
              <Subheader style={styles.subheader}>{i18n.t('general.tank.one')}</Subheader>

              { getRegularInput('tank') }
            </>
          }

          <TouchableOpacity onPress={() => switchParamFilterSwitch() }
          >
            <Text style={styles.link}>{ i18n.t(paramFilterSwitch ? 'speciesSearchFilter.chooseCompTank' : 'speciesSearchFilter.chooseParams')}</Text>
          </TouchableOpacity>
        </Surface>
        
        <Subheader style={styles.header}>{i18n.t('general.classification')}</Subheader>
          <View style={[styles.row, styles.toggleContainer]}>
            { !types ?
                <Spinner />
              :
                types.map(type => {
                  if(!excludingTypes.includes(type.name['en'])){ 
                    return (
                      <ToggleButton
                        icon={type.icon}
                        value={type._id}
                        onPress={() => {
                          removeFilter('family');
                          removeFilter('group');
                          changeFilter('type', { displayValue: helpers.ucFirst(type.name[locale]), value: type._id });
                        }}
                        status={filters.type && filters.type.value == type._id ? 'checked' : 'unchecked'}
                        style={styles.toggleButton}
                        theme={theme}
                        color={filters.type && filters.type.value == type._id ? theme.colors.primary : theme.colors.lightText}
                        size={30}
                        key={type._id}
                      />
                    )
                  }
                })
            }
          </View>
          { getRegularInput('family') }
          { getRegularInput('group') }
          { getRegularInput('depth') }
          { getRegularInput('feed') }
          { getRegularInput('behavior', 'checkbox') }
          { getRegularInput('color', 'checkbox') }

        <Subheader style={styles.header}>{i18n.t('general.property.other')}</Subheader>
          <View style={styles.row}>
            <MaterialCommunityIcons size={24} style={styles.leftSwitch} name="spray-bottle"/>
            <Subheader style={[styles.subheader, styles.centerSwitch]}>{i18n.t('general.cleanupCrew')}</Subheader>
            <Switch style={styles.rightSwitch}
              value={filters.cleaning ? filters.cleaning.value : false}
              onValueChange={useCallback(() => { 
                changeFilter('cleaning', { displayValue: i18n.t('general.cleanupCrew'), value: filters.cleaning ? !filters.cleaning.value : true })
              })}
            />
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons size={24} style={styles.leftSwitch} name="paw"/>
            <Subheader style={[styles.subheader, styles.centerSwitch]}>{i18n.t('general.wild')}</Subheader>
            <Switch style={styles.rightSwitch}
              value={filters.wild ? filters.wild.value : false}
              onValueChange={useCallback(() => { 
                changeFilter('wild', { displayValue: i18n.t('general.wild'), value: filters.wild ? !filters.wild.value : true })
              })}
            />
          </View>
          {/* <View style={styles.row}>
            <MaterialCommunityIcons size={24} style={styles.leftSwitch} name="shaker"/>
            <Subheader style={[styles.subheader, styles.centerSwitch]}>{i18n.t('general.salt')}</Subheader>
            <Switch style={styles.rightSwitch}
              value={filters.salt ? filters.salt.value : false}
              onValueChange={useCallback(() => { 
                changeFilter('salt', { displayValue: i18n.t('general.salt'), value: filters.salt ? !filters.salt.value : true })
              })}
            />
          </View> */}

        <Subheader style={styles.header}>{i18n.t('general.measures')}</Subheader>
          <Subheader style={styles.subheader}>{i18n.t('general.speciesSize')} {getParamUnit('length')}</Subheader>
          { getParamInput('Length', ['ruler','ruler'], 'length') }
          
          <Subheader style={styles.subheader}>{i18n.t('general.minTank')} {getParamUnit('volume')}</Subheader>
          { getParamInput('MinTank', ['cube-outline','cube'], 'volume') }

      </Dialog>

      <Dialog
        isVisible={!!isModalVisible}
        setVisible={() => setModalVisible()}
        cancelButton={i18n.t('general.cancel')}
        actions={getActions(setModalVisible, false)}
        scrollable={true}
      >
        { getModalContent(isModalVisible) }
      </Dialog>
    </>
  );
}