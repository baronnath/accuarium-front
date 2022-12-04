// src/components/SpeciesList.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { View, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Subheader from '../../../components/Subheader';
import Paragraph from '../../../components/Paragraph';
import OptionsMenu from '../../../components/OptionsMenu';
import Searchbar from '../../../components/Searchbar';
import FixedAlert from '../../../components/FixedAlert';
import SpeciesSearchFilter from './SpeciesSearchFilter';
import Tag from '../../../components/Tag';
import SpeciesCard from './SpeciesCard';
import Spinner from '../../../components/Spinner';
import { actions as tankActions } from '../../../ducks/tank';
import { ucFirst } from '../../../helpers/helpers';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';


export default function SpeciesSearch({ route, navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);

  const [isLoading, setLoading] = useState(true);
  const [grid, setGrid] = useState(true);
  const [page, setPage] = useState(null);
  const [isFinalPage, setFinalPage] = useState(false);
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'ascending'
  });
  const [main, setMain] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [areFiltersVisible, setFiltersVisible] = useState(false);
  const dispatch = useDispatch();

  const tagFilters = [
    'tank',
    'cleaning',
    'wild',
    'salt',
    'type',
    'family',
    'depth',
    'group',
    'feed',
    'behavior',
    'color',
  ];

  const menuButton = <MaterialCommunityIcons size={24} name="dots-vertical" color={theme.colors.text} onPress={() => {openMenu()}} />;

    // const onChangeSort = field => {
  //   let newDirection;
  //   if(sort.direction == 'ascending')
  //     newDirection = 'descending';
  //   else
  //     newDirection = 'ascending';

  //   setSort({
  //       field: field,
  //       direction: newDirection
  //   });
  // }

  useEffect(() => {
    clearFilter(); // Initial filters
    dispatchSearch(); // Initial search dispatch
  },[]);

  useEffect(() =>{
    dispatch(tankActions.getTankByUser(user._id));
  },[user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      resetSearch();
    }, 1000);
    return () => clearTimeout(timer);
  },[query]);

  // Search is triggered when page state is state
  useEffect(() => {
    if (isFinalPage) {
      return;
    }
    if(page !== null && !isLoading) // check the useEffect dependency to avoid been triggeren on mount (on screen load)
      dispatchSearch();
  },[page]);

  useEffect(()=>{
    if(main){
      // changeFilter('tank', {id: tank._id, name: tank.name});
    }
  },[main]);

  useEffect(() => {
    if(route.params){
      setMain(route.params.setMainSpeciesTank);
    }
  },[route]);

  // useEffect with page as dependency won't trigger if same value is assigned to page: value is assigned as integer to force the state change
  function resetSearch() {
    setFinalPage(false);
    setResults([]);
    setPage(page === 0 ? '0' : 0);
  }
  
  function dispatchSearch(){
    setLoading(true);
    
    // Extract values from filters
    let filterValues = {};
    Object.entries(filters).map(([key, filter]) => {
      filterValues[key] = filter.value;
    });

    const params = {
      ...filterValues,
      sort: sort.field,
      direction: sort.direction,
      page: page,
    }

    if(!!query)
      params['keyword'] = query;

    axios.get(backend.url + '/species/search', {params: params})
      .then(res => {
          const newResults = res.data.species;
          if(!!newResults.length)
            setResults(oldResults => [...oldResults, ...newResults]);
          else {
            setFinalPage(true);
          }
          setTotalResults(res.data.total);
          setLoading(false);
      })
      .catch(err => {
          handleAlert(err);  
          setLoading(false);
      });
  }

  function onScrollEnd() {
    if(!isLoading)
      setPage(parseInt(page) + 1); // for next call
  }

  function openMenu () { setMenuVisible(true); }
  function closeMenu () { setMenuVisible(false); }

  function switchGrid(speciesId){
    setGrid(!grid);
  }

  async function changeFilter(key, value, array = false) {
    if(array) {
      let index = filters[key] ? filters[key].value.indexOf(value.value) : -1;

      if(index >= 0) // found: remove item
        removeFilter(key, value.value);
      else {  // not found: add item
        setFilters(prevFilters => {
          let filters = { ...prevFilters };
          if(!filters[key]){
            filters[key] = { value: [], displayValue: [] };
          }
          filters[key].value.push(value.value);
          filters[key].displayValue.push(value.displayValue);

          return filters;
        });
      }
    }
    else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [key]: value
      }));
    }
  }

  async function removeFilter(key, id = null) {
    if(id){ // remove id from array of values
      setFilters(prevFilters => {
        let filters = { ...prevFilters };
        let index = filters[key].value.indexOf(id ? String(id) : key);
        filters[key].value.splice(index,1);
        filters[key].displayValue.splice(index,1);
        return filters;
      });
    }
    else{ // no array value
      setFilters(prevFilters => {
        let filters = { ...prevFilters };
        delete filters[key];
        return filters;
      });
    }
  }

  async function clearFilter() {
    setFilters({});
    // changeFilter('cleaning', { displayValue: i18n.t('general.cleanupCrew'), value: true });
    // changeFilter('wild', { displayValue: i18n.t('general.wild'), value: true });
  }

  function getTag(key, label, id = null) {
    // return <Tag onClose={() => removeFilter(key, id)}>{label}</Tag>;
    return <Tag style={styles.tag}>{label}</Tag>;
  }

  return (
    <>
      <Background justify="top">

        <View style={styles.container}>
          <Header>
            {i18n.t('speciesSearch.title')}
          </Header>

          <OptionsMenu>
            <Menu
              visible={isMenuVisible}
              onDismiss={closeMenu}
              anchor={menuButton}
              style={styles.topRight}
            >
              <Menu.Item
                icon="filter-outline"
                onPress={ () => {
                  setMenuVisible(false),
                  setFiltersVisible(true)
                }}
                title={i18n.t('general.filter.other')}
              />
              <Menu.Item
                icon={grid ? "view-list-outline" : "view-grid-outline"}
                onPress={ () => {
                  setMenuVisible(false),
                  switchGrid()
                }}
                title={i18n.t(grid ? 'general.listView' : 'general.gridView')}
              />
            </Menu>
          </OptionsMenu>
        </View>

        { main && 
         <FixedAlert visible={true} onClose={() => setMain(null)} type="warning" wrapperStyle={styles.wrapperAlert}>Add main species to your new tank {main.name}</FixedAlert>
        }
        
        <Searchbar
          placeholder={i18n.t('general.search')}
          onChangeText={searchKey => setQuery(searchKey)}
          value={query}
        />
       
        <View style={styles.tagContainer}>
          { true && 
              Object.entries(filters).map(([key, filter]) => {
                if(tagFilters.includes(key) && filter.value !== false){
                  if(Array.isArray(filter.displayValue))
                    return filter.displayValue.map((f) => {
                      return getTag(key, f, filter.value)
                    })
                  else
                    return getTag(key, filter.displayValue)
                }
              })
          }
        </View>

        <FlatList
          style={styles.flatList}
          theme={theme}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => (
              <SpeciesCard species={item} grid={grid} main={main ? main._id : null} setMain={setMain}/>
          )}
          onEndReached={onScrollEnd}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isLoading
              ? <Spinner />
              : isFinalPage &&
                <Paragraph style={{paddingVertical: 20}}>{i18n.t('speciesSearch.noMore')}</Paragraph> 
          }
          ListFooterComponentStyle={styles.listFootStyle}
        />
      </Background>
      
      <SpeciesSearchFilter visible={areFiltersVisible} setVisible={setFiltersVisible} filters={filters} changeFilter={changeFilter} removeFilter={removeFilter} clearFilter={clearFilter} resetSearch={resetSearch}/>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  subheader: {
    lineHeight: 18,
    marginBottom: 20,
    color: theme.colors.primary,
  },
  topRight: {
    justifyContent: 'flex-end',
  },
  wrapperAlert: {
    marginBottom: 20,
  },
  tagContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: theme.container.padding,
  },
  tag: {
    marginBottom: theme.container.padding / 4,
    marginRight: theme.container.padding / 2,
  },
  flatList:{
    width: '100%',
  },
  flatListContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  listFootStyle: {
    paddingBottom: Dimensions.get('window').height / 5,
  },
});