import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const { theme } = useThemeStore();

  const languages = [
    { code: 'en', name: i18n.t('english') },
    { code: 'am', name: i18n.t('amharic') },
  ];

  const handleLanguageChange = async (languageCode: string) => {
    await setLanguage(languageCode);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('languageSettings'),
          headerTitleStyle: { color: theme.colors.text },
          headerTintColor: theme.colors.text,
        }}
      />
      
      <ScrollView>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {i18n.t('selectLanguage')}
        </Text>
        
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              { 
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.border 
              }
            ]}
            onPress={() => handleLanguageChange(language.code)}
            activeOpacity={0.7}
          >
            <Text style={[styles.languageName, { color: theme.colors.text }]}>
              {language.name}
            </Text>
            
            {currentLanguage === language.code && (
              <Check size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  languageName: {
    fontSize: 16,
  },
});