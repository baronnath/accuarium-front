// src/components/Livestock.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../helpers/axios';
import { ucFirst } from '../../helpers/helpers';
import { backend } from '../../../app.json';
import { Text, StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { DataTable } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Fab from './Fab';
import Background from '../../components/Background';
import Header from '../../components/Header';
import MenuButton from '../../components/MenuButton';
import Searchbar from '../../components/Searchbar';
import SpeciesCard from '../../components/SpeciesCard';
import Spinner from '../../components/Spinner';
import { actions as alertActions } from '../../ducks/alert';
import { handleAlert } from '../../helpers/global';
import { theme } from '../../theme';
import { preferences } from '../../../app.json';

export default function Livestock({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'ascending'
  });
  const [types, setTypes] = useState(null);
  const [families, setFamilies] = useState(null);
  const [depths, setDepths] = useState(null);
  const [behaviors, setBehaviors] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [query, setQuery] = useState([]);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const dispatch = useDispatch();

  const from = Math.min((page * preferences.pagination) + 1, totalResults);
  const to = Math.min((page + 1) * preferences.pagination, totalResults);

  let timeout;
  const onChangeSearch = searchKey => {
    clearTimeout(timeout);
    setResults([]);
    setPage(0);
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
    timeout = setTimeout(() => dispatchSearch(query), 400);
  },[query, page, sort]);
  
  useFocusEffect(
    React.useCallback(() => {
      dispatchSearch();
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
          setResults(res.data.species);
          setTotalResults(res.data.total);
          setLoading(false);
      })
      .catch(err => {
          handleAlert(err);  
          setLoading(false);
      });
  }

  function onRowPress(speciesId){
    navigation.navigate('Species', {speciesId: speciesId});
  }

  return (
    <>
      <Background justify="top">
        <MenuButton />
        <Header>
          Livestock
        </Header>
        
        <Searchbar
          placeholder="Search"
          onChangeText={searchKey => onChangeSearch(searchKey)}
          value={query}
        />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title sortDirection={sort.direction} onPress={() => onChangeSort('name')} style={styles.columnFirst}>
                <Text>Name</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.columnSecond}>
                <Text>
                  Family
                </Text>
              </DataTable.Title>
              <DataTable.Title style={styles.columnActions}>
                <Text>
                  Actions
                </Text>
              </DataTable.Title>
            </DataTable.Header>

              { isLoading ?
                  <Spinner />
                :
                  results.map(species => {     
                    return (
                      <DataTable.Row>
                        <DataTable.Cell
                          style={styles.columnFirst}
                          onPress={() => onRowPress(species._id)}
                        >
                          <Text>
                            {species.name[locale]}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={styles.columnSecond}
                          onPress={() => onRowPress(species._id)}
                        >
                          <Text>
                            {species.family ? ucFirst(species.family.name[locale]) : '-'}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnActions}>
                          <MaterialCommunityIcons name="pencil-outline" size={24} />
                          <MaterialCommunityIcons name="delete-outline" color={theme.colors.secondary} size={24} />
                        </DataTable.Cell>
                      </DataTable.Row>
                    )
                  })
              }

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(totalResults / preferences.pagination)}
              onPageChange={page => {
                setPage(page);
              }}
              label={`${from}-${to} of ${totalResults}`}
            />
          </DataTable>
        </ScrollView>

      </Background>
      <Fab />
    </>
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
  },
  scroll: {
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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