// src/screens/client/tank/Tank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import TankDeleteModal from './TankDeleteModal';
import TankMenu from './TankMenu';
import Background from '../../../components/Background';
import OptionsMenu from '../../../components/OptionsMenu';
import Header from '../../../components/Header';
import Paragraph from '../../../components/Paragraph';
import Warning from '../../../components/Warning';
import GraphicTank from './GraphicTank';
import Modal from '../../../components/Modal';
import Surface from '../../../components/Surface';
import Subheader from '../../../components/Subheader';
import Spinner from '../../../components/Spinner';
import GroupIcon from '../../../components/GroupIcon';
import Separator from '../../../components/Separator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import unitConverter from '../../../helpers/unitConverter';
import { findMainSpecies } from '../../../helpers/tank';
import { ucFirst, isEmpty, round } from '../../../helpers/helpers';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function Tank({ route, navigation }) {
  const { tankId } = route.params;

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const tank = useSelector(state => state.tanks.tank);
  const isLoading = useSelector(state => state.tanks.isLoading);
  const dispatch = useDispatch();

  const [mainSpecies, setMainSpecies] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [tankParameters, setTankParameters] = useState({});
  const [image, setImage] = useState(null);
  const [freeSpace, setFreeSpace] = useState(100);
  const [cleanupCrew, setCleaningCrew] = useState(0);
  
  useFocusEffect(
    React.useCallback(() => {
      if(tankId){
        dispatch(tankActions.getTank(tankId));
        getImage(`${backend.imagesUrl}tank/${tankId}.jpeg`);
      }
    }, [])
  );

  useEffect(() => {
    if(!isEmpty(tank) && tank._id.toString() == tankId){ // Check that tank data in redux has been updated with last id received

      if(tank.species.length){
        setMainSpecies(findMainSpecies(tank.species));
      }

      if(!!tank.liters){
        calculateDetails();
      }
    }
    
  }, [tank]);

  useEffect(() => {
    if(mainSpecies){
      dispatch(tankActions.getCompatibility(tankId));

      // Set tank parameters from main species
      const temp = mainSpecies.species.parameters.temperature;
      const ph = mainSpecies.species.parameters.ph;
      const gh = mainSpecies.species.parameters.gh;
      const kh = mainSpecies.species.parameters.kh;
      const tankParams = {
        temperature: !!temp.min && !!temp.max ? unitConverter((temp.min + temp.max) / 2, 'temperature', 'base', user.units.temperature) : null,
        ph: !!ph.min && !!ph.max ? (ph.min + ph.max) / 2 : null,
        gh: !!gh.min && !!gh.max ? unitConverter((gh.min + gh.max) / 2, 'hardness', 'base', user.units.hardness) : null,
        kh: !!kh.min && !!kh.max ? unitConverter((kh.min + kh.max) / 2, 'hardness', 'base', user.units.hardness) : null,
      }
      setTankParameters(tankParams);
    }
  },[mainSpecies])

  // Calculate free space and cleaning crew
  function calculateDetails() {
    let occupied = 0;
    let cleaning = 0;
     
    tank.species.forEach(species => {
      occupied += species.species.volumeSpecimen * species.quantity;
      if(species.species.cleaning)
        cleaning += species.species.volumeSpecimen * species.quantity;
    });

    let freeSpace = 100 - (occupied * 100 / tank.liters);
    setFreeSpace(round.round(freeSpace));

    let cleaningCrew = cleaning * 100 / tank.liters;
    setCleaningCrew(round.round(cleaningCrew));

    return;
  }

  function getMeasure(measure) {
    return(
      <View style={styles.measure}>
        <Paragraph fontWeight='bold'>
          { tank.measures[measure] ?
              `${unitConverter(tank.measures[measure], 'length', 'base', user.units.length)} ${user.units.length}`
            :
              '?'
          }
        </Paragraph>
        <Paragraph style={styles.paramDesc}>
          {ucFirst(i18n.t(`general.${measure}`))}
        </Paragraph>
      </View>
    )
  }

  function getImage(uri) {
    axios.get(uri)
      .then(res => {
         if (res.status != 404) {
          setImage(
            <Image
              source={{ uri: uri + '?' + new Date()}} // Date is added to avoid image to cache
              style={styles.image}
              // defaultSource={{ uri: 'https://www.animalespeligroextincion.org/wp-content/uploads/2019/03/pez-betta.jpg' }} // TO BE FIXED: imageDefault not working in Android for debug built. Image default to be changed
            />
          );
        }
      })
      .catch((err) => {});
  }

  function getParam(param, measure, icon) {
    if(tankParameters[param]) {
      return(
        <Surface elevation={9} style={[styles.surface, {flex:1}]}>
          <View>
            { icon }
            <View style={styles.row}>
              { param != 'ph' ?
                  <>
                    <Subheader style={styles.waterParam}>
                      { `${unitConverter(tankParameters[param], measure, 'base', user.units[measure])}` }
                    </Subheader>
                    <Subheader style={styles.waterParamUnit}>
                      { i18n.t(`measures.${user.units[measure]}Abbr`) }
                    </Subheader>
                  </>
                :
                  <>
                    <Subheader style={styles.waterParam}>
                      { tankParameters[param] }
                    </Subheader>
                  </>
              }
            </View>
            <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
              {ucFirst(i18n.t(`general.${measure}`))}
            </Paragraph>
          </View>
        </Surface>
      );
    }
  }

  function mainSpeciesRoute() {
    let nav = 'SpeciesNav';
    let params;

    if(!!mainSpecies)
      params = { screen: 'Species', params: { speciesId : mainSpecies.species._id } };
    else if(tank.species.length){
      nav = 'TankNav';
      params = { screen: 'EditTank', params: { tankId: tank._id } };
    }
    else 
      params = { screen: 'SpeciesSearch', params: { setMainSpeciesTank: tank } };

    navigation.navigate(nav, params);
  }

  return (
      <Background justify="top">
        { isLoading ?

            <Spinner/>
            :

            !isEmpty(tank) &&
              <View style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                  <MaterialCommunityIcons
                    name="fishbowl-outline"
                    size={36}
                    color={theme.colors.lightText}
                    style={{marginTop: theme.container.padding}}
                  />
                  <Header style={styles.header}>
                    {tank.name}
                  </Header>
                </View>
                
                <OptionsMenu>
                  <TankMenu tankId={tank._id}  deleteTank={setDeleteModalVisible}/>
                </OptionsMenu>

                {/* Volumen, measures and main species */}
                <View style={styles.row}>
                  <View style={{flex:1,justifyContent:'flex-start'}}>
                    {/* Volume */}
                    <Surface
                      elevation={12}
                      style={styles.surface}
                      color={theme.colors.quaternary}
                    >
                      <View style={styles.row}>
                        { tank.liters ?
                            <>
                              <Subheader style={styles.param}>{unitConverter(tank.liters, 'volume', 'base', user.units['volume'])}</Subheader>
                              <Subheader style={styles.paramUnit}>{i18n.t('measures.' + user.units.volume + 'Abbr')}</Subheader>
                            </>
                          :
                            <Subheader>?</Subheader>
                        }
                      </View>
                      <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
                        { ucFirst(i18n.t('general.volume')) }
                      </Paragraph>
                    </Surface>
                    {/* Main species */}
                    <TouchableOpacity onPress={() => mainSpeciesRoute() }>
                      <Surface
                        elevation={12}
                        style={styles.surface}
                        color={!!mainSpecies ? null : theme.colors.warning}
                      >
                        { !!mainSpecies ?
                            <>
                              <GroupIcon
                                name={mainSpecies.species.group.icon} 
                                color={theme.colors.accent}
                                size={30}
                              />
                              <Subheader style={styles.mainSpecies}>{ ucFirst(mainSpecies.species.name[locale]) }</Subheader>
                              <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
                                <MaterialCommunityIcons name="star-circle" size={8} /> {ucFirst(i18n.t('general.mainSpecies.one'))}
                              </Paragraph>
                            </>
                          :
                              <Paragraph style={styles.warningSurface} fontWeight="bold">
                                <MaterialCommunityIcons name="star-circle" size={18} color={theme.colors.background} /> {i18n.t('tank.warning.subtitle')}
                              </Paragraph>

                        }
                      </Surface>
                   </TouchableOpacity>
                  </View>
                  {/* Measures */}
                  <Surface style={[styles.surface, styles.smallSurface]}>
                    { getMeasure('length') }
                    { getMeasure('height') }
                    { getMeasure('width') }
                  </Surface>
                </View>

                {/* Image */}
                { image && image }

                {/* Params */}
                { !!mainSpecies &&
                  <>
                    <Subheader>{i18n.t('general.waterChemistry')}</Subheader>
                    <View style={styles.row}>
                      {/* Temperature */}
                      { getParam('temperature', 'temperature', <MaterialCommunityIcons name="thermometer-low" color={theme.colors.text} size={18} style={{marginLeft:'-10%'}} />) }
                      {/* pH */}
                      { getParam('ph', 'ph', <Subheader style={styles.waterParam}>pH</Subheader>) }
                      {/* gh */}
                      { getParam('gh', 'hardness', <MaterialCommunityIcons name="focus-field" color={theme.colors.text} size={18} style={{marginLeft:'-3%'}} />) }
                      {/* kh */}
                      { getParam('kh', 'hardness', <MaterialCommunityIcons name="focus-field-horizontal" color={theme.colors.text} size={18} style={{marginLeft:'-3%'}} />) }
                    </View>
                  </>
               }

                
                {/* Graphic tank with species split by swimming area */}
                <Subheader>{i18n.t('general.graphicTank')}</Subheader>
                { tank.species &&
                  <GraphicTank style={{marginTop: 5}}/>
                }
                
                {/* Free space and cleaning */}
                { tank.liters &&
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={{flex:1}}
                      onPress={() => {
                        setModalVisible(true);
                        setModalContent('tank.modalFreeSpace');
                      }}
                    >
                      <Surface
                        style={[styles.smallSurface,styles.smallSurfaceHorizontal]}
                        color={ freeSpace > 0 ? theme.colors.primary : theme.colors.warning }
                      >
                        <View style={styles.row}>
                          <MaterialCommunityIcons name="water-percent" size={36} />
                          <View style={{flex: 1}}>
                            <Paragraph style={styles.smallSurfaceHorizontalText} fontWeight="bold">
                              { freeSpace }%
                            </Paragraph>
                            <Paragraph style={styles.smallSurfaceHorizontalText}>
                              {i18n.t('general.freeSpace')}
                            </Paragraph>
                          </View>
                        </View>
                      </Surface>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{flex:1}}
                      onPress={() => {
                        setModalVisible(true);
                        setModalContent('tank.modalCleanupCrew');
                      }}
                    >
                      <Surface
                        style={[styles.smallSurface,styles.smallSurfaceHorizontal]}
                        color={ cleanupCrew >= 15 ? theme.colors.primary : theme.colors.warning }
                      >
                        <View style={styles.row}>
                          <MaterialCommunityIcons name="spray-bottle" size={36} />
                          <View style={{flex: 1}}>
                            <Paragraph style={styles.smallSurfaceHorizontalText} fontWeight="bold">
                              { cleanupCrew }%
                            </Paragraph>
                            <Paragraph style={styles.smallSurfaceHorizontalText}>
                              {i18n.t('general.cleanupCrew')}
                            </Paragraph>
                          </View>
                        </View>
                      </Surface>
                    </TouchableOpacity>
                  </View>
                }
              </View>
        }
      <Modal isVisible={isModalVisible} setVisible={setModalVisible}>
        <MaterialCommunityIcons name="information-outline" size={60} color={theme.colors.primary} />
        <Paragraph style={styles.modalParagraph}>{i18n.t(modalContent)}</Paragraph>
      </Modal>
      <TankDeleteModal tankId={tankId} isVisible={isDeleteModalVisible} setVisible={setDeleteModalVisible} /> 
    </Background>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection:'column',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingBottom: theme.container.padding * 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  header: {
    alignSelf: 'stretch',
    paddingLeft: theme.container.padding,
    paddingRight: theme.container.padding * 2,
    fontSize: 22,
    color: theme.colors.lightText,
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  surface: {
    margin: 0,
    marginBottom: theme.container.padding / 2,
    marginRight: theme.container.padding / 2,
    // justifyContent: 'flex-start',
    paddingTop: theme.container.padding * 1.3,
  },
  smallSurface: {
    alignItems:'center',
    marginRight: 0,
    paddingHorizontal: theme.container.padding * .25,
    paddingVertical: theme.container.padding,
    marginBottom: theme.container.padding / 2,
  },
  smallSurfaceHorizontal:{
    margin:0,
    marginRight: theme.container.padding / 4
  },
  smallSurfaceHorizontalText:{
    paddingLeft: theme.container.padding / 8,
    color: theme.colors.surface,
    textAlign: 'left',
    marginBottom: 0,
  },
  warningSurface: {
    fontSize: 18,
    lineHeight: 20,
    color: theme.colors.surface,
  },
  tankName: {
    fontSize: 14,
    // color: theme.colors.text,
    marginBottom: 0,
    lineHeight: 30,
  },
  volume: {
    fontSize: 48,
    lineHeight: 42,
    paddingBottom: 0,
    marginTop: 0,
  },
  mainSpecies: {
    alignSelf: 'flex-start',
    marginVertical: 0,
  },
  rowContainer: {
    flexDirection:'row',
    justifyContent: 'center',
  },
  box: {
    flex:1,
    position: 'relative',
    width: '80%',
    marginVertical: theme.container.padding * 2,
    padding: theme.container.padding ,
    paddingTop: theme.container.padding * 2,
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    borderRadius: theme.roundness,
  },
  param: {
    textAlign: 'left',
    fontSize: 50,
    lineHeight: 50,
  },
  paramUnit: {
    textAlign: 'left',
    marginLeft: 8,
  },
  paramDesc: {
    color: theme.colors.primary,
    fontSize: 9,
    lineHeight: 9,
    // textAlign: 'left',
  },
  measure: {
    flex: 1,
    justifyContent: 'center',
  },
  parameters: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  values: {
    flex:1,
    fontSize: 12
    ,
  },
  image: {
    flex:1,
    width: '100%',
    resizeMode: "stretch",
    aspectRatio: 1.25,
    marginBottom: theme.container.padding / 2,
    borderRadius: theme.roundness,
  },
  waterParam: {
    textAlign: 'left',
    fontSize: 12,
    lineHeight: 12,
  },
  waterParamUnit: {
    fontSize: 6,
    lineHeight: 6,
    textAlign: 'left',
    marginLeft: 2,
  },
  infoIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  titleContainer: {
    flex:3,
    alignItems:'flex-start',
  },
  moreDetailsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  moreDetail: {
    alignItems:'center',
  },  
  modalTitle: {
    fontSize: 30,
    lineHeight: 30,
  },
  modalParagraph: {
    // color: theme.colors.text,
  },
});
