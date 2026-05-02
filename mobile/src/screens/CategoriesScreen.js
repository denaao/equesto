import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SectionList, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import { getCategoriesGrouped } from '../services/api';

export default function CategoriesScreen({ navigation }) {
  const [grouped, setGrouped] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoriesGrouped()
      .then(data => {
        const sections = Object.entries(data).map(([title, data]) => ({ title, data }));
        setGrouped(sections);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SectionList
      sections={grouped}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>{title}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Results', { category: item.slug, title: item.name })}
          activeOpacity={0.7}
        >
          <Text style={styles.itemText}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { backgroundColor: colors.background },
  groupHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  itemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md,
  },
});
