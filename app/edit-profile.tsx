import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Camera, X, Check, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import i18n from '@/i18n';

export default function EditProfileScreen() {
  const router = useRouter();
  const { currentUser, updateProfile } = useUserStore();
  const { theme } = useThemeStore();
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      setBio(currentUser.bio || '');
      setAvatar(currentUser.avatar);
      // Use a default cover image if not set
      setCoverImage('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80');
    }
  }, [currentUser]);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = i18n.t('nameRequired');
    }
    
    if (!username.trim()) {
      newErrors.username = i18n.t('usernameRequired');
    } else if (username.includes(' ')) {
      newErrors.username = i18n.t('usernameNoSpaces');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePickAvatar = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert(i18n.t('mediaPermissionRequired'));
        return;
      }
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  const handlePickCoverImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert(i18n.t('mediaPermissionRequired'));
        return;
      }
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCoverImage(result.assets[0].uri);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, you would upload images to a server here
      // and get back URLs to store in the user profile
      
      // For now, we'll just update the local state
      await updateProfile({
        name,
        username,
        bio,
        avatar,
        // In a real app, you would also update coverImage
      });
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate back to profile
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ general: i18n.t('updateProfileFailed') });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: i18n.t('editProfile'),
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave} 
              style={styles.headerButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Check size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
            contentFit="cover"
          />
          <TouchableOpacity 
            style={[styles.editCoverButton, { backgroundColor: theme.colors.primary }]}
            onPress={handlePickCoverImage}
          >
            <Camera size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarWrapper, { borderColor: theme.colors.background }]}>
            <Avatar 
              source={avatar} 
              size="large" 
              isVerified={currentUser.isVerified}
            />
            <TouchableOpacity 
              style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary }]}
              onPress={handlePickAvatar}
            >
              <Camera size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {i18n.t('name')}
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  color: theme.colors.text,
                  borderColor: errors.name ? theme.colors.error : theme.colors.border,
                  backgroundColor: theme.colors.card
                }
              ]}
              value={name}
              onChangeText={setName}
              placeholder={i18n.t('enterName')}
              placeholderTextColor={theme.colors.textSecondary}
            />
            {errors.name && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.name}
              </Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {i18n.t('username')}
            </Text>
            <View style={styles.usernameInputContainer}>
              <Text style={[styles.usernamePrefix, { color: theme.colors.textSecondary }]}>
                @
              </Text>
              <TextInput
                style={[
                  styles.usernameInput, 
                  { 
                    color: theme.colors.text,
                    borderColor: errors.username ? theme.colors.error : theme.colors.border,
                    backgroundColor: theme.colors.card
                  }
                ]}
                value={username}
                onChangeText={setUsername}
                placeholder={i18n.t('enterUsername')}
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
              />
            </View>
            {errors.username && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.username}
              </Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {i18n.t('bio')}
            </Text>
            <TextInput
              style={[
                styles.bioInput, 
                { 
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card
                }
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder={i18n.t('enterBio')}
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={160}
            />
            <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
              {bio.length}/160
            </Text>
          </View>
          
          {errors.general && (
            <Text style={[styles.generalError, { color: theme.colors.error }]}>
              {errors.general}
            </Text>
          )}
          
          <Button
            title={i18n.t('saveChanges')}
            onPress={handleSave}
            isLoading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  coverImageContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  avatarWrapper: {
    position: 'relative',
    borderWidth: 4,
    borderRadius: 999,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  usernameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernamePrefix: {
    fontSize: 16,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  generalError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});