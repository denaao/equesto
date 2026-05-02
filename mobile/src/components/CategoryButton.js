import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import { CATEGORY_ICON_MAP } from './CategoryIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
// 3 colunas, descontando padding lateral (16×2) e gaps (8×2)
const CARD_SIZE = Math.floor((SCREEN_WIDTH - 32 - 16) / 3);

// Fallback por campo icon do banco
const IONICON_BY_FIELD = {
  stethoscope:    'medkit',
  hammer:         'hammer',
  'user-check':   'person-circle',
  briefcase:      'briefcase',
  'file-text':    'document-text',
  truck:          'bus',
  'plus-circle':  'add-circle',
  activity:       'pulse',
  award:          'ribbon',
  home:           'home',
  'map-pin':      'location',
  users:          'people',
  star:           'star',
  package:        'cube',
  'shopping-bag': 'bag',
  box:            'archive',
  leaf:           'leaf',
  layers:         'layers',
  wind:           'cloudy',
  scissors:       'cut',
  'trending-up':  'trending-up',
  mic:            'mic',
  'dollar-sign':  'cash',
  flag:           'flag',
  shield:         'shield',
  'bar-chart-2':  'bar-chart',
};

export default function CategoryButton({ category, onPress, size = 'md' }) {
  const isSmall = size === 'sm';
  const cardSize = isSmall ? 76 : CARD_SIZE;
  const iconSize = isSmall ? 24 : Math.floor(CARD_SIZE * 0.46);

  // Lookup pelo slug primeiro
  const iconDef = CATEGORY_ICON_MAP[category.slug];
  const iconName = iconDef
    ? iconDef.name
    : (IONICON_BY_FIELD[category.icon] || 'apps');
  const iconColor = iconDef && iconDef.color === 'accent'
    ? colors.accent
    : colors.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { width: cardSize }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { width: cardSize, height: cardSize }]}>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </View>
      <Text style={[styles.label, isSmall && styles.labelSmall]} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    borderRadius: radius.lg,
    backgroundColor: '#F2EDD7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E0C4',
    ...shadow.small,
  },
  label: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 10,
  },
});
