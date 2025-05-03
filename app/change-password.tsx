import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import Button from '@/components/common/Button';
import i18n from '@/i18n';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = i18n.t('currentPasswordRequired');
    }
    
    if (!newPassword) {
      newErrors.newPassword = i18n.t('newPasswordRequired');
    } else if (newPassword.length < 8) {
      newErrors.newPassword = i18n.t('passwordTooShort');
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = i18n.t('confirmPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = i18n.t('passwordsDoNotMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChangePassword = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        i18n.t('passwordChanged'),
        i18n.t('passwordChangedMessage'),
        [
          {
            text: i18n.t('ok'),
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };
  
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('changePassword'),
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {i18n.t('changePasswordDescription')}
        </Text>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {i18n.t('currentPassword')}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.text,
                    borderColor: errors.currentPassword ? theme.colors.error : theme.colors.border,
                    backgroundColor: theme.colors.card
                  }
                ]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder={i18n.t('enterCurrentPassword')}
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('current')}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.currentPassword && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.currentPassword}
              </Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {i18n.t('newPassword')}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.text,
                    borderColor: errors.newPassword ? theme.colors.error : theme.colors.border,
                    backgroundColor: theme.colors.card
                  }
                ]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={i18n.t('enterNewPassword')}
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('new')}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.newPassword ? (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.newPassword}
              </Text>
            ) : (
              <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
                {i18n.t('passwordRequirements')}
              </Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {i18n.t('confirmNewPassword')}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.text,
                    borderColor: errors.confirmPassword ? theme.colors.error : theme.colors.border,
                    backgroundColor: theme.colors.card
                  }
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={i18n.t('confirmNewPassword')}
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('confirm')}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>
          
          <Button
            title={i18n.t('updatePassword')}
            onPress={handleChangePassword}
            isLoading={isLoading}
            style={styles.submitButton}
          />
          
          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              {i18n.t('forgotPassword')}
            </Text>
          </TouchableOpacity>
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
  contentContainer: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  forgotPasswordLink: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
});