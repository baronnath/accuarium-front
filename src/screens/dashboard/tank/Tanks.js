// src/screens/dashboard/tank/Tanks.js
// Tank view with tank search feature (tank name, user name and user email criteria)

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker, Text, ScrollView } from 'react-native';
import { ToggleButton, DataTable } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import Searchbar from '../../../components/Searchbar';
import Fab from '../Fab';
import Paragraph from '../../../components/Paragraph';
import SpeciesCard from '../../../components/SpeciesCard';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import { preferences } from '../../../../app.json';

export default function Tanks({ navigation }) {

  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState([]);
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'ascending'
  });
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [tanks, setTanks] = useState(false);
  const user = useSelector(state => state.user.data);

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
    axios.get(backend.url + '/tank/search', {params: params})
      .then(res => {
          setResults(res.data.tanks);
          setTotalResults(res.data.total);
          setLoading(false);
      })
      .catch(err => {
          handleAlert(err);  
          setLoading(false);
      });
  }

  function onRowPress(tankId){
    navigation.navigate('Tank', {tankId: tankId});
  }

  return (
    <>
      <Background justify="top">
        <MenuButton />

            <Header>
              Tanks
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
                  <Text>Tank</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.columnSecond}>
                  <Text>
                    User
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
                  results.map(tank => {     
                    return (
                      <DataTable.Row>
                        <DataTable.Cell
                          style={styles.columnFirst}
                          onPress={() => onRowPress(tank._id)}
                        >
                          <Text>
                            {tank.name}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={styles.columnSecond}
                          onPress={() => onRowPress(tank._id)}
                        >
                          <Text>
                            {tank.user.name ? ucFirst(tank.user.name) : '-'}
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
    flex: 1,
    width: '100%',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginVertical: 10,
    width: '100%',
    height: 200
  },
  tagContainer: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    paddingTop: 8,
    width: '100%',
    justifyContent: 'center',

  },
  row: {
    flex: 1,
    marginVertical: 10,
    marginLeft: '50%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listIcon: {
    marginRight: 8,
  },
  parameters: {
    position: 'absolute',
    left: 45,
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