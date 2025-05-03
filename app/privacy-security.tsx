import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  UserX, 
  Bell, 
  Database, 
  Shield, 
  LogOut,
  Trash2
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { usePrivacySecurityStore } from '@/store/usePrivacySecurityStore';
import i18n from '@/i18n';
import Button from '@/components/common/Button';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { 
    privateAccount,
    showOnlineStatus,
    allowTagging,
    allowMentions,
    showReadReceipts,
    dataSharing,
    togglePrivateAccount,
    toggleOnlineStatus,
    toggleAllowTagging,
    toggleAllowMentions,
    toggleReadReceipts,
    toggleDataSharing,
    blockedUsers
  } = usePrivacySecurityStore();

  const handleGoBack = () => {
    router.back();
  };

  const handleViewBlockedUsers = () => {
    router.push('/blocked-users');
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handleDeleteAccount = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      i18n.t('deleteAccount'),
      i18n.t('deleteAccountConfirmation'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('delete'),
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert(i18n.t('accountDeleted'), i18n.t('accountDeletedMessage'));
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      i18n.t('logout'),
      i18n.t('logoutConfirmation'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('logout'),
          onPress: () => {
            // In a real app, this would clear auth tokens and redirect to login
            Alert.alert(i18n.t('loggedOut'), i18n.t('loggedOutMessage'));
          },
        },
      ]
    );
  };

  const handleToggleWithHaptic = (toggle: () => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggle();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('privacyAndSecurity'),
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            {i18n.t('privacy')}
          </Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingIconContainer}>
              <Eye size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('privateAccount')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('privateAccountDescription')}
              </Text>
            </View>
            <Switch
              value={privateAccount}
              onValueChange={() => handleToggleWithHaptic(togglePrivateAccount)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('showOnlineStatus')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('showOnlineStatusDescription')}
              </Text>
            </View>
            <Switch
              value={showOnlineStatus}
              onValueChange={() => handleToggleWithHaptic(toggleOnlineStatus)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingIconContainer}>
              <UserX size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('blockedUsers')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {blockedUsers.length > 0 
                  ? i18n.t('blockedUsersCount', { count: blockedUsers.length }) 
                  : i18n.t('noBlockedUsers')}
              </Text>
            </View>
            <TouchableOpacity onPress={handleViewBlockedUsers}>
              <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                {i18n.t('view')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Interactions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            {i18n.t('interactions')}
          </Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingIconContainer}>
              <UserX size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('allowTagging')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('allowTaggingDescription')}
              </Text>
            </View>
            <Switch
              value={allowTagging}
              onValueChange={() => handleToggleWithHaptic(toggleAllowTagging)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingIconContainer}>
              <UserX size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('allowMentions')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('allowMentionsDescription')}
              </Text>
            </View>
            <Switch
              value={allowMentions}
              onValueChange={() => handleToggleWithHaptic(toggleAllowMentions)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingIconContainer}>
              <Eye size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('readReceipts')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('readReceiptsDescription')}
              </Text>
            </View>
            <Switch
              value={showReadReceipts}
              onValueChange={() => handleToggleWithHaptic(toggleReadReceipts)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            {i18n.t('security')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.settingIconContainer}>
              <Lock size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('changePassword')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('changePasswordDescription')}
              </Text>
            </View>
            <ArrowLeft size={20} color={theme.colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingIconContainer}>
              <Database size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('dataSharing')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('dataSharingDescription')}
              </Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={() => handleToggleWithHaptic(toggleDataSharing)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        {/* Account Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            {i18n.t('accountActions')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingIconContainer}>
              <LogOut size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {i18n.t('logout')}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {i18n.t('logoutDescription')}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.dangerZone}>
            <Text style={[styles.dangerZoneTitle, { color: theme.colors.error }]}>
              {i18n.t('dangerZone')}
            </Text>
            <Text style={[styles.dangerZoneDescription, { color: theme.colors.textSecondary }]}>
              {i18n.t('dangerZoneDescription')}
            </Text>
            <Button
              title={i18n.t('deleteAccount')}
              variant="outline"
              style={[styles.deleteButton, { borderColor: theme.colors.error }]}
              textStyle={{ color: theme.colors.error }}
              onPress={handleDeleteAccount}
              leftIcon={<Trash2 size={16} color={theme.colors.error} />}
            />
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 128, 240, 0.1)', // Light version of primary color
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dangerZone: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.05)', // Light version of error color
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dangerZoneDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  deleteButton: {
    marginTop: 8,
  },
});