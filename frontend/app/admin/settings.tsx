import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/services/api';

interface SiteSettings {
  site_name: { nl: string; fr: string; en: string; tr: string };
  site_logo: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  about_text: { nl: string; fr: string; en: string; tr: string };
  social_facebook: string;
  social_instagram: string;
  primary_color: string;
}

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { isSuperAdmin } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: { nl: '', fr: '', en: '', tr: '' },
    site_logo: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    about_text: { nl: '', fr: '', en: '', tr: '' },
    social_facebook: '',
    social_instagram: '',
    primary_color: '#e67e22',
  });

  useEffect(() => {
    if (!isSuperAdmin) {
      Alert.alert('Access Denied', 'Super admin access required');
      router.back();
      return;
    }
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const pickLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSettings({
        ...settings,
        site_logo: `data:image/jpeg;base64,${result.assets[0].base64}`,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e67e22" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Site Logo</Text>
          <TouchableOpacity style={styles.logoContainer} onPress={pickLogo}>
            {settings.site_logo ? (
              <Image source={{ uri: settings.site_logo }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="image-outline" size={40} color="#ccc" />
                <Text style={styles.logoText}>Tap to upload</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Site Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Site Name</Text>
          <Text style={styles.inputLabel}>English</Text>
          <TextInput
            style={styles.input}
            value={settings.site_name.en}
            onChangeText={(text) =>
              setSettings({ ...settings, site_name: { ...settings.site_name, en: text } })
            }
            placeholder="Hardware Store"
          />
          <Text style={styles.inputLabel}>Nederlands</Text>
          <TextInput
            style={styles.input}
            value={settings.site_name.nl}
            onChangeText={(text) =>
              setSettings({ ...settings, site_name: { ...settings.site_name, nl: text } })
            }
            placeholder="Hardware Store"
          />
          <Text style={styles.inputLabel}>Français</Text>
          <TextInput
            style={styles.input}
            value={settings.site_name.fr}
            onChangeText={(text) =>
              setSettings({ ...settings, site_name: { ...settings.site_name, fr: text } })
            }
            placeholder="Quincaillerie"
          />
          <Text style={styles.inputLabel}>Türkçe</Text>
          <TextInput
            style={styles.input}
            value={settings.site_name.tr}
            onChangeText={(text) =>
              setSettings({ ...settings, site_name: { ...settings.site_name, tr: text } })
            }
            placeholder="Hırdavat Dükkanı"
          />
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={settings.contact_email}
            onChangeText={(text) => setSettings({ ...settings, contact_email: text })}
            placeholder="info@hardwarestore.be"
            keyboardType="email-address"
          />
          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            value={settings.contact_phone}
            onChangeText={(text) => setSettings({ ...settings, contact_phone: text })}
            placeholder="+32 XXX XXX XXX"
            keyboardType="phone-pad"
          />
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={settings.contact_address}
            onChangeText={(text) => setSettings({ ...settings, contact_address: text })}
            placeholder="Street, City, Postal Code"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <Text style={styles.inputLabel}>Facebook URL</Text>
          <TextInput
            style={styles.input}
            value={settings.social_facebook}
            onChangeText={(text) => setSettings({ ...settings, social_facebook: text })}
            placeholder="https://facebook.com/yourpage"
          />
          <Text style={styles.inputLabel}>Instagram URL</Text>
          <TextInput
            style={styles.input}
            value={settings.social_instagram}
            onChangeText={(text) => setSettings({ ...settings, social_instagram: text })}
            placeholder="https://instagram.com/yourpage"
          />
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <Text style={styles.inputLabel}>Primary Color</Text>
          <View style={styles.colorRow}>
            {['#e67e22', '#3498db', '#27ae60', '#e74c3c', '#9b59b6'].map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  settings.primary_color === color && styles.colorSelected,
                ]}
                onPress={() => setSettings({ ...settings, primary_color: color })}
              >
                {settings.primary_color === color && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bulk Email Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Bulk Email</Text>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => router.push('/admin/bulk-email')}
          >
            <Ionicons name="mail-outline" size={24} color="#fff" />
            <Text style={styles.emailButtonText}>Send Email to All Users</Text>
          </TouchableOpacity>
        </View>

        {/* User Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Management</Text>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => router.push('/admin/users')}
          >
            <Ionicons name="people-outline" size={24} color="#fff" />
            <Text style={styles.emailButtonText}>Manage Users & Roles</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  logoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9b59b6',
    paddingVertical: 14,
    borderRadius: 10,
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#e67e22',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
