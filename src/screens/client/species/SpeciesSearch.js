// src/components/SpeciesList.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Paragraph from '../../../components/Paragraph';
import OptionsMenu from '../../../components/OptionsMenu';
import Searchbar from '../../../components/Searchbar';
import SpeciesCard from './SpeciesCard';
import Spinner from '../../../components/Spinner';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';


export default function SpeciesSearch({ navigation }) {
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
  const [types, setTypes] = useState(null);
  const [families, setFamilies] = useState(null);
  const [depths, setDepths] = useState(null);
  const [behaviors, setBehaviors] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const dispatch = useDispatch();

  let timeout;
  const onChangeSearch = searchKey => {
    clearTimeout(timeout);
    setResults([]);
    setPage(0);
    setFinalPage(false);
    setQuery(searchKey);
  }

  const onChangeSort = field => {
    let newDirection;
    if(sort.direction == 'ascending')
      newDirection = 'descending';
    else
      newDirection = 'ascending';

    setSort({
        field: field,
        direction: newDirection
    });
  }
  
  useEffect(()=>{
    timeout = setTimeout(() => dispatchSearch(query), 800);
  },[query, page, sort]);
  
  useFocusEffect(
    React.useCallback(() => {
      // dispatchSearch();
      // dispatch(tankActions.getTankByUser(user._id));
    }, [])
  );

  function dispatchSearch(searchKey){
    setLoading(true);
    const params = {
      keyword: query,
      sort: sort.field,
      direction: sort.direction,
      page: page
    }
    axios.get(backend.url + '/species/search', {params: params})
      .then(res => {
          const newResutls = res.data.species;
          if(!!newResutls.length)
            setResults(newResutls);
          else
            setFinalPage(true);
          setTotalResults(res.data.total);
          setLoading(false);
      })
      .catch(err => {
          handleAlert(err);  
          setLoading(false);
      });
  }

  function onScrollEnd() {
    setPage(page + 1);
  }

  function switchGrid(speciesId){
    setGrid(!grid);
  }

  function filter(speciesId){
    alert('FILTERS')
  }

  return (
    <>
      <Background justify="top">
        <Header>
          {i18n.t('speciesSearch.title')}
        </Header>
        <OptionsMenu>
          <MaterialCommunityIcons size={26} color={theme.colors.lightText} name="filter-outline" onPress={() => {filter()}} />
          <MaterialCommunityIcons size={26} color={theme.colors.lightText} name={ grid ? 'view-list-outline' : 'view-grid-outline' } onPress={() => {switchGrid()}} />
        </OptionsMenu>
        
        <Searchbar
          placeholder={i18n.t('general.search')}
          onChangeText={searchKey => onChangeSearch(searchKey)}
          value={query}
        />

        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => (
              <SpeciesCard species={item} grid={grid} />
          )}
          onEndReached={isFinalPage ? null : onScrollEnd}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading
              ? <Spinner />
              : isFinalPage &&
                <Paragraph style={{paddingVertical: 20}}>{i18n.t('speciesSearch.noMore')}</Paragraph> 
          }
        />  
      </Background>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flatList:{
    width: '100%',
  },
  flatListContainer: {
    flexDirection: 'column',
    width: '100%',
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