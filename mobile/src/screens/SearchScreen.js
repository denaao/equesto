import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import { getListings, getCategories } from '../services/api';
import ListingCard from '../components/ListingCard';

const TYPES = [
  { label: 'Todos', value: '' },
  { label: 'Profissional', value: 'profissional' },
  { label: 'Empresa', value: 'empresa' },
  { label: 'Fornecedor', value: 'fornecedor' },
];

export default function SearchScreen({ navigation, route }) {
  const initialQuery = route.params?.query || '';
  const [search, setSearch] = useState(initialQuery);
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || '');
  const inputRef = useRef(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    if (initialQuery || route.params?.category) {
      doSearch({ query: initialQuery, category: route.params?.category || '' });
    }
  }, []);

  const doSearch = async (overrides = {}) => {
    setLoading(true);
    try {
      const params = {
        search: overrides.query !== undefined ? overrides.query : search,
        category: overrides.category !== undefined ? overrides.category : selectedCategory,
        city,
        type,
      };
      const data = await getListings(params);
      setResults(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (slug) => {
    const newVal = selectedCategory === slug ? '' : slug;
    setSelectedCategory(newVal);
    doSearch({ category: newVal });
  };

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar no turfe..."
            placeholderTextColor={colors.textLight}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => doSearch()}
            returnKeyType="search"
            autoFocus={!initialQuery}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); setResults([]); }}>
              <Ionicons name="close-circle" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={() => doSearch()}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros tipo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
      >
        {TYPES.map(t => (
          <TouchableOpacity
            key={t.value}
            style={[styles.chip, type === t.value && styles.chipActive]}
            onPress={() => { setType(t.value); doSearch(); }}
          >
            <Text style={[styles.chipText, type === t.value && styles.chipTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Filtro cidade */}
        <View style={styles.cityInput}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <TextInput
            style={styles.cityText}
            placeholder="Cidade"
            placeholderTextColor={colors.textLight}
            value={city}
            onChangeText={setCity}
            onSubmitEditing={() => doSearch()}
          />
        </View>
      </ScrollView>

      {/* Categorias rápidas */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catsRow}
        contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
      >
        {categories.slice(0, 10).map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.catChip, selectedCategory === c.slug && styles.catChipActive]}
            onPress={() => handleCategorySelect(c.slug)}
          >
            <Text style={[styles.catChipText, selectedCategory === c.slug && styles.catChipTextActive]}>
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resultados */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => navigation.navigate('Listing', { id: item.id })}
            />
          )}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={styles.resultCount}>{total} resultado{total !== 1 ? 's' : ''}</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.border} />
              <Text style={styles.emptyText}>
                {search || selectedCategory
                  ? 'Nenhum resultado encontrado'
                  : 'Digite algo para buscar'}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingVertical: spacing.sm, paddingBottom: 80 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.primary,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 10 },
  searchBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  filtersRow: { maxHeight: 48, paddingTop: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  cityInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  cityText: { fontSize: 12, color: colors.text, minWidth: 80, paddingVertical: 6 },
  catsRow: { maxHeight: 42, paddingVertical: spacing.sm },
  catChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  catChipText: { fontSize: 11, color: colors.textSecondary },
  catChipTextActive: { color: '#fff', fontWeight: '700' },
  resultCount: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textSecondary,
    fontSize: 12,
  },
  empty: { alignItems: 'center', marginTop: 60, gap: spacing.sm },
  emptyText: { color: colors.textSecondary, fontSize: 15 },
});
