import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronRight, User, Bell, Moon, Globe, Shield, LogOut } from 'lucide-react-native';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import Avatar from '@/components/common/Avatar';
import i18n from '@/i18n';

export default function SettingsScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { isDarkMode, themeMode, setThemeMode } = useThemeStore();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const { theme } = useThemeStore();
  
  const [notifications, setNotifications] = React.useState(true);

  const toggleDarkMode = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  const navigateToLanguageSettings = () => {
    router.push('/language-settings');
  };
  
  const navigateToPrivacySecurity = () => {
    router.push('/privacy-security');
  };

  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{i18n.t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('settings'),
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text }],
        }}
      />
      
      <ScrollView>
        {/* Profile Section */}
        <TouchableOpacity 
          style={[styles.profileSection, { 
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border 
          }]}
          onPress={() => router.push(`/profile/${currentUser.id}`)}
          activeOpacity={0.7}
        >
          <Avatar source={currentUser.avatar} size="large" isVerified={currentUser.isVerified} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>{currentUser.name}</Text>
            <Text style={[styles.profileUsername, { color: theme.colors.textSecondary }]}>@{currentUser.username}</Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        {/* Settings Sections */}
        <View style={[styles.section, { 
          borderTopColor: theme.colors.border,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            {i18n.t('account')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]} 
            activeOpacity={0.7}
            onPress={() => router.push('/edit-profile')}
          >
            <User size={20} color={theme.colors.primary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{i18n.t('editProfile')}</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} style={styles.chevron} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]} 
            activeOpacity={0.7}
            onPress={navigateToPrivacySecurity}
          >
            <Shield size={20} color={theme.colors.primary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{i18n.t('privacyAndSecurity')}</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} style={styles.chevron} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { 
          borderTopColor: theme.colors.border,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            {i18n.t('preferences')}
          </Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <Bell size={20} color={theme.colors.primary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{i18n.t('notifications')}</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
              style={styles.switch}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <Moon size={20} color={theme.colors.primary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{i18n.t('darkMode')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
              style={styles.switch}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]} 
            activeOpacity={0.7}
            onPress={navigateToLanguageSettings}
          >
            <Globe size={20} color={theme.colors.primary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{i18n.t('language')}</Text>
            <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
              {currentLanguage === 'en' ? i18n.t('english') : i18n.t('amharic')}
            </Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} style={styles.chevron} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { 
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderBottomColor: theme.colors.border
        }]}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <LogOut size={20} color={theme.colors.error} />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>{i18n.t('logout')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>{i18n.t('appName')}</Text>
          <Text style={[styles.footerVersion, { color: theme.colors.textSecondary }]}>{i18n.t('version')} 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileUsername: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    marginRight: 4,
  },
  chevron: {
    marginLeft: 4,
  },
  switch: {
    marginLeft: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerVersion: {
    fontSize: 12,
    marginTop: 4,
  },
});