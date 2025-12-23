import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/services/api';

export default function BulkEmailScreen() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendTo, setSendTo] = useState<'all' | 'active'>('all');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please enter subject and message');
      return;
    }

    Alert.alert(
      'Confirm Send',
      `Are you sure you want to send this email to ${sendTo === 'all' ? 'all users' : 'active users'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            setSending(true);
            try {
              const response = await api.post('/admin/send-email', {
                subject,
                message,
                send_to: sendTo,
              });
              Alert.alert(
                'Success',
                `Email queued for ${response.data.recipients_count} recipients`,
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.detail || 'Failed to send email');
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed" size={64} color="#ccc" />
          <Text style={styles.errorText}>Admin access required</Text>
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
        {/* Recipients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipients</Text>
          <View style={styles.recipientOptions}>
            <TouchableOpacity
              style={[
                styles.recipientOption,
                sendTo === 'all' && styles.recipientOptionActive,
              ]}
              onPress={() => setSendTo('all')}
            >
              <Ionicons
                name="people"
                size={24}
                color={sendTo === 'all' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.recipientOptionText,
                  sendTo === 'all' && styles.recipientOptionTextActive,
                ]}
              >
                All Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.recipientOption,
                sendTo === 'active' && styles.recipientOptionActive,
              ]}
              onPress={() => setSendTo('active')}
            >
              <Ionicons
                name="person-circle"
                size={24}
                color={sendTo === 'active' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.recipientOptionText,
                  sendTo === 'active' && styles.recipientOptionTextActive,
                ]}
              >
                Active Users
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Email subject"
            placeholderTextColor="#999"
          />
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Write your message here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.noteText}>
            Note: Emails will be queued and sent to all registered users.
            In production, integrate with a real email service (SendGrid, SES, etc.).
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Send Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.sendButton, sending && styles.buttonDisabled]}
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send Email</Text>
            </>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recipientOptions: {
    flexDirection: 'row',
  },
  recipientOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  recipientOptionActive: {
    backgroundColor: '#3498db',
  },
  recipientOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  recipientOptionTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  messageInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  noteContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
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
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
