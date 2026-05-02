import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, FlatList, ActivityIndicator, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import { getCategories, getFeaturedListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import CategoryButton from '../components/CategoryButton';

const GRID_CATEGORIES = [
  'veterinarios',
  'ferradores',
  'transporte-de-cavalos',
  'treinadores',
  'haras',
  'garanhoes',
  'agencias-de-leilao',
  'venda-de-cavalos',
  'clinicas-veterinarias',
  'criadores',
  'selaria',
  'centro-de-doma',
];

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, feat] = await Promise.all([
        getCategories(),
        getFeaturedListings(),
      ]);
      setCategories(cats);
      setFeatured(feat);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigation.navigate('Search', { query: searchText.trim() });
    setSearchText('');
  };

  const mainCats = GRID_CATEGORIES
    .map(slug => categories.find(c => c.slug === slug))
    .filter(Boolean);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Barra de busca */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="O que você procura no turfe?"
            placeholderTextColor={colors.textLight}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleSearch}>
              <View style={styles.searchBtn}>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 60 }}
          />
        ) : (
          <>
            {/* Categorias principais — grid 3x2 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Buscar por <Text style={{ fontWeight: '800' }}>categoria:</Text>
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                  <Text style={styles.seeAll}>Ver todas</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.categoriesGrid}>
                {mainCats.map(cat => (
                  <CategoryButton
                    key={cat.id}
                    category={cat}
                    onPress={() =>
                      navigation.navigate('Results', { category: cat.slug, title: cat.name })
                    }
                  />
                ))}
              </View>
            </View>

            {/* CTA Divulgue seu serviço */}
            <View style={styles.ctaSection}>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate('Search')}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaIcon}>📣</Text>
                <Text style={styles.ctaText}>Divulgue seu serviço</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Destaques */}
            {featured.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>⭐ Destaques</Text>
                </View>
                {featured.map(item => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    onPress={() => navigation.navigate('Listing', { id: item.id })}
                  />
                ))}
              </View>
            )}

            {/* Mais buscados */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Mais buscados</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsRow}
              >
                {['Veterinários', 'Ferradores', 'Transporte', 'Treinadores', 'Haras', 'Garanhões', 'Leilões'].map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tag}
                    onPress={() => navigation.navigate('Search', { query: tag })}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: '80%',
    height: 132,
    marginBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    alignSelf: 'stretch',
    ...shadow.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    rowGap: spacing.md,
    columnGap: spacing.sm,
    justifyContent: 'space-between',
  },
  ctaSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2EDD7',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8E0C4',
  },
  ctaIcon: {
    fontSize: 22,
  },
  ctaText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  tagsRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
  },
  tagText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
});
