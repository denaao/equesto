import React from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import { buildWhatsAppUrl } from '../services/api';

export default function ListingCard({ listing, onPress }) {
  const handleWhatsApp = () => {
    if (!listing.whatsapp) return;
    const url = buildWhatsAppUrl(listing.whatsapp, listing.name);
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {listing.featured && (
        <View style={styles.featuredBadge}>
          <Ionicons name="star" size={10} color="#fff" />
          <Text style={styles.featuredText}>DESTAQUE</Text>
        </View>
      )}

      <View style={styles.row}>
        {listing.photo_url ? (
          <Image source={{ uri: listing.photo_url }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="image-outline" size={28} color={colors.border} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{listing.name}</Text>

          <View style={styles.categoryRow}>
            <Ionicons name="pricetag-outline" size={11} color={colors.accent} />
            <Text style={styles.category}>{listing.category_name}</Text>
          </View>

          {listing.city && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.location}>
                {listing.city}{listing.state ? `, ${listing.state}` : ''}
              </Text>
            </View>
          )}
        </View>
      </View>

      {listing.whatsapp && (
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={18} color="#fff" />
          <Text style={styles.whatsappText}>Falar no WhatsApp</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    ...shadow.small,
    overflow: 'hidden',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
    gap: 4,
  },
  featuredText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whatsapp,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    gap: 6,
  },
  whatsappText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
