import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, UserX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { usePrivacySecurityStore } from '@/store/usePrivacySecurityStore';
import { useUserStore } from '@/store/useUserStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import i18n from '@/i18n';

export default function BlockedUsersScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { blockedUsers, unblockUser } = usePrivacySecurityStore();
  const { users } = useUserStore();
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleUnblock = (userId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      i18n.t('unblockUser'),
      i18n.t('unblockUserConfirmation'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('unblock'),
          onPress: () => {
            unblockUser(userId);
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  };
  
  // Get full user objects for blocked users
  const blockedUserObjects = blockedUsers.map(id => 
    users.find(user => user.id === id)
  ).filter(Boolean);
  
  const renderItem = ({ item }: { item: any }) => {
    if (!item) return null;
    
    return (
      <View style={[styles.userItem, { borderBottomColor: theme.colors.border }]}>
        <Avatar source={item.avatar} size="medium" isVerified={item.isVerified} />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.userUsername, { color: theme.colors.textSecondary }]}>@{item.username}</Text>
        </View>
        <Button
          title={i18n.t('unblock')}
          variant="outline"
          size="small"
          onPress={() => handleUnblock(item.id)}
        />
      </View>
    );
  };
  
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <UserX size={64} color={theme.colors.textSecondary} style={styles.emptyIcon} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {i18n.t('noBlockedUsers')}
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
        {i18n.t('blockedUsersEmptyDescription')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('blockedUsers'),
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <FlatList
        data={blockedUserObjects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userUsername: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
});