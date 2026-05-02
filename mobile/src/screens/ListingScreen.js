import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Linking, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import { getListingById, buildWhatsAppUrl } from '../services/api';

export default function ListingScreen({ route, navigation }) {
  const { id } = route.params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListingById(id)
      .then(data => {
        setListing(data);
        navigation.setOptions({ title: data.name });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Anúncio não encontrado</Text>
      </View>
    );
  }

  const openWhatsApp = () => {
    const url = buildWhatsAppUrl(listing.whatsapp, listing.name);
    Linking.openURL(url);
  };

  const openPhone = () => Linking.openURL(`tel:${listing.phone}`);
  const openSite = () => {
    const url = listing.website.startsWith('http')
      ? listing.website
      : `https://${listing.website}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Foto */}
        {listing.photo_url ? (
          <Image source={{ uri: listing.photo_url }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="image-outline" size={64} color={colors.border} />
          </View>
        )}

        {/* Info principal */}
        <View style={styles.card}>
          {listing.featured && (
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.badgeText}>DESTAQUE</Text>
            </View>
          )}

          <Text style={styles.name}>{listing.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color={colors.accent} />
              <Text style={styles.metaText}>{listing.category_name}</Text>
            </View>
            {listing.type && (
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.metaTextGray}>{listing.type}</Text>
              </View>
            )}
            {listing.city && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.metaTextGray}>
                  {listing.city}{listing.state ? `, ${listing.state}` : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Descrição */}
        {listing.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        )}

        {/* Serviços */}
        {listing.services && listing.services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serviços</Text>
            {listing.services.map((s, i) => (
              <View key={i} style={styles.serviceItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.serviceText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Contato adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          {listing.phone && (
            <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
              <Text style={styles.contactText}>{listing.phone}</Text>
            </TouchableOpacity>
          )}
          {listing.website && (
            <TouchableOpacity style={styles.contactItem} onPress={openSite}>
              <Ionicons name="globe-outline" size={18} color={colors.primary} />
              <Text style={styles.contactText}>{listing.website}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* CTA fixo: WhatsApp */}
      {listing.whatsapp && (
        <View style={styles.ctaBar}>
          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            <Text style={styles.whatsappText}>Falar no WhatsApp</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: colors.textSecondary, fontSize: 16 },
  photo: { width: '100%', height: 220, backgroundColor: colors.border },
  photoPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#E8E8E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...shadow.small,
  },
  badge: {
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
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metaRow: { gap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: colors.accent, fontWeight: '600' },
  metaTextGray: { fontSize: 13, color: colors.textSecondary },
  section: {
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  description: { fontSize: 14, color: colors.text, lineHeight: 22 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 6 },
  serviceText: { fontSize: 14, color: colors.text },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    ...shadow.medium,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whatsapp,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  whatsappText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
