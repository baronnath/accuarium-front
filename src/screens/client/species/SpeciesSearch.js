// src/components/SpeciesList.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { View, StyleSheet, FlatList } from 'react-native';
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
  const [page, setPage] = useState(0);
  const [isFinalPage, setFinalPage] = useState(false);
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'ascending'
  });
  const [main, setMain] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
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
    // Initial filters
    clearFilter();
  },[]);

  useEffect(() => {
    setPage(0);
    setFinalPage(false);
    setResults([]);
    const timer = setTimeout(() => dispatchSearch(query), 1200);
    return () => clearTimeout(timer);
  },[query, filters]);


  useEffect(()=>{
    if(main){
      // changeFilter('tank', {id: tank._id, name: tank.name});
    }
  },[main]);

  useEffect(() => {
    if(route.params){
      setMain(route.params.setMainSpeciesTank);
    }
  },[route])
  
  function dispatchSearch(searchKey){
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
          setPage(page + 1); // for next call
      })
      .catch(err => {
          handleAlert(err);  
          setLoading(false);
      });
  }

  function onScrollEnd() {
    if (isFinalPage) {
      return;
    }
    if(!isLoading)
      dispatchSearch(query);
  }

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
        let index = filters[key].value.indexOf(key);
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
    return <Tag onClose={() => removeFilter(key, id)}>{label}</Tag>;
  }

  return (
    <>
      <Background justify="top">
        <Header>
          {i18n.t('speciesSearch.title')}
        </Header>

        { main && 
         <FixedAlert visible={true} onClose={() => setMain(null)} type="warning" wrapperStyle={styles.wrapperAlert}>Add main species to your new tank {main.name}</FixedAlert>
        }

        <OptionsMenu>
          <MaterialCommunityIcons size={26} color={theme.colors.lightText} name="filter-outline" onPress={() => setFiltersVisible(true)} />
          <MaterialCommunityIcons size={26} color={theme.colors.lightText} name={ grid ? 'view-list-outline' : 'view-grid-outline' } onPress={() => {switchGrid()}} />
        </OptionsMenu>
        
        <Searchbar
          placeholder={i18n.t('general.search')}
          onChangeText={searchKey => setQuery(searchKey)}
          value={query}
        />
       
        <View style={styles.tagContainer}>
          { filters &&
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
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => (
              <SpeciesCard species={item} grid={grid} main={main ? main._id : null} setMain={setMain}/>
          )}
          onEndReached={onScrollEnd}
          onEndReachedThreshold={0.9}
          ListFooterComponent={
            isLoading
              ? <Spinner />
              : isFinalPage &&
                <Paragraph style={{paddingVertical: 20}}>{i18n.t('speciesSearch.noMore')}</Paragraph> 
          }
          ListFooterComponentStyle={styles.listFootStyle}
        />  
      </Background>
      
      <SpeciesSearchFilter visible={areFiltersVisible} setVisible={setFiltersVisible} filters={filters} changeFilter={changeFilter} removeFilter={removeFilter} clearFilter={clearFilter} />
    </>
  );
}

const styles = StyleSheet.create({
  background: {
  },
  subheader: {
    lineHeight: 18,
    marginBottom: 20,
    color: theme.colors.primary,
  },
  wrapperAlert: {
    marginBottom: 20,
  },
  tagContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  flatList:{
    width: '100%',
  },
  flatListContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  listFootStyle: {
    paddingBottom: 150,

  },
  flatContainer: {
    marginTop: 20,
    width: '100%',
  },
  columnFirst: {
      flex: 4,
  },
  columnSecond: {
    flex: 4,
  },
  columnActions: {
    flex: 2,
  },
});