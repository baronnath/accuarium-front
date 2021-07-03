// src/screens/dashboard/species/SpeciesSearch.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { StyleSheet, View, FlatList } from 'react-native';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import Searchbar from '../../../components/Searchbar';
import SpeciesCard from '../../client/species/SpeciesCard';
// import { Searchbar } from 'react-native-paper';
import Spinner from '../../../components/Spinner';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';

export default function SpeciesSearch({ navigation }) {

  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();

  let timeout;
  const onChangeSearch = searchKey => {
    clearTimeout(timeout);
    setResults([]);
    setPage(0);
    setQuery(searchKey);
  }

  useEffect(()=>{
    if (query && query.length >= 1) {
      timeout = setTimeout(() => dispatchSearch(query), 400);
    }
  },[query, page]);

  function onScrollEnd() {
    setPage(page + 1);
  }

  function dispatchSearch(searchKey){
    setLoading(true);
    axios.get(backend.url + '/species/search/'+searchKey+'/'+page)
      .then(res => {
          setResults(prevResults => [...prevResults, ...res.data.species]);
          setLoading(false);
      })
      .catch(err => {
          handleAlert(err);  
          setLoading(false);
      });
  }

  return (
    <Background justify="top">
      <MenuButton />
      <Header>
        Species search
      </Header>
      <Searchbar
        placeholder="Search"
        onChangeText={searchKey => onChangeSearch(searchKey)}
        value={query}
      />
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
        data={results}
        keyExtractor={result => result._id}
        renderItem={({item}) => (
            <SpeciesCard species={item} />
        )}
        onEndReached={onScrollEnd}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ isLoading && <Spinner /> }
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  background: {
  },
  flatList:{
    width: '100%',
  },
  flatListContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  flatContainer: {
    marginTop: 20,
    width: '100%',
  }
});