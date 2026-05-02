import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { getListings } from '../services/api';
import ListingCard from '../components/ListingCard';

export default function ResultsScreen({ navigation, route }) {
  const { category, title } = route.params;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: title || 'Resultados' });
    load(1);
  }, [category]);

  const load = async (p = 1) => {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await getListings({ category, page: p, limit: 20 });
      if (p === 1) {
        setListings(data.data);
      } else {
        setListings(prev => [...prev, ...data.data]);
      }
      setTotal(data.total);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && listings.length < total) {
      load(page + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={listings}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ListingCard
          listing={item}
          onPress={() => navigation.navigate('Listing', { id: item.id })}
        />
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={
        <Text style={styles.count}>{total} resultado{total !== 1 ? 's' : ''}</Text>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={48} color={colors.border} />
          <Text style={styles.emptyText}>Nenhum anúncio encontrado</Text>
          <Text style={styles.emptySubText}>
            Seja o primeiro a anunciar nesta categoria!
          </Text>
        </View>
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator color={colors.primary} style={{ margin: spacing.lg }} />
        ) : null
      }
      contentContainerStyle={{ paddingVertical: spacing.sm, paddingBottom: 80 }}
      style={{ backgroundColor: colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  count: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textSecondary,
    fontSize: 12,
  },
  empty: { alignItems: 'center', marginTop: 80, gap: spacing.sm, paddingHorizontal: spacing.lg },
  emptyText: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptySubText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});
