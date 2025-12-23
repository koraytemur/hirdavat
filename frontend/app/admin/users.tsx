import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersScreen() {
  const { isSuperAdmin } = useAuthStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleRoleChange = (user: User) => {
    if (!isSuperAdmin) {
      Alert.alert('Access Denied', 'Only super admin can change user roles');
      return;
    }

    const roles = ['user', 'admin', 'superadmin'];
    Alert.alert(
      'Change Role',
      `Select new role for ${user.name}`,
      [
        ...roles.map((role) => ({
          text: role.charAt(0).toUpperCase() + role.slice(1),
          onPress: async () => {
            try {
              await api.patch(`/admin/users/${user.id}/role?role=${role}`);
              loadUsers();
              Alert.alert('Success', `User role updated to ${role}`);
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.detail || 'Failed to update role');
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleToggleStatus = async (user: User) => {
    Alert.alert(
      user.is_active ? 'Deactivate User' : 'Activate User',
      `Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await api.patch(`/admin/users/${user.id}/status`);
              loadUsers();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.detail || 'Failed to update status');
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return '#9b59b6';
      case 'admin':
        return '#e67e22';
      default:
        return '#3498db';
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userAvatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <TouchableOpacity
            style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}
            onPress={() => handleRoleChange(item)}
          >
            <Text style={styles.roleText}>{item.role}</Text>
            {isSuperAdmin && <Ionicons name="chevron-down" size={12} color="#fff" />}
          </TouchableOpacity>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.is_active ? '#e8f8f0' : '#ffebee' },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.is_active ? '#27ae60' : '#e74c3c' },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: item.is_active ? '#27ae60' : '#e74c3c' },
              ]}
            >
              {item.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => handleToggleStatus(item)}
      >
        <Ionicons
          name={item.is_active ? 'toggle' : 'toggle-outline'}
          size={32}
          color={item.is_active ? '#27ae60' : '#ccc'}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#e67e22']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>{users.length} Users</Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    color: '#666',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e67e22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  roleText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  toggleButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});
