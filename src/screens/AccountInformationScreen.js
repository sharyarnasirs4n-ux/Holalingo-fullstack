import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useState } from 'react';
import { deleteAccount } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Context/ThemeContext'; 
import { useProgress } from '../Context/ProgressContext';

export default function AccountInformationScreen({
  navigation,
  onAccountDeleted,
}) {
  const { user } = useProgress();
  const {colors}=useTheme()
  const styles=createStyles(colors)
 const [loading,setLoading]=useState(false)
  const userName =
    user?.name ||
    user?.email?.split('@')[0] ||
    'Not provided';

  const email =
    user?.email ||
    'Not provided';

  const level =
    user?.level ||
    'A0';

  function formatDate(dateString) {
    if (!dateString) {
      return 'Not available';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return 'Not available';
    }

    return date.toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  }
  function handleDeleteAccount() {
  Alert.alert(
    'Delete Account',
    'Are you sure you want to permanently delete your account? This action cannot be undone.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: performAccountDeletion,
      },
    ]
  );
}
async function performAccountDeletion() {
  try {
    setLoading(true)
    await deleteAccount();

    onAccountDeleted();

   setLoading(false)
  } catch (error) {
    setLoading(false)
    console.log('ACCOUNT DELETION ERROR:', error);

    Alert.alert(
      'Deletion Failed',
      'We could not delete your account. Please try again.'
    );
  }
}


  return (
    
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
      >

        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Account Information
          </Text>

          <View style={styles.headerSpacer} />
        </View>


        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileName}>
            {userName}
          </Text>

          <Text style={styles.profileEmail}>
            {email}
          </Text>
        </View>


        <Text style={styles.sectionTitle}>
          Account Details
        </Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text>👤</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Name
              </Text>

              <Text style={styles.detailValue}>
                {userName}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text>📧</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Email
              </Text>

              <Text style={styles.detailValue}>
                {email}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text>📚</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Current Level
              </Text>

              <Text style={styles.detailValue}>
                {level}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text>🇪🇸</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Learning Language
              </Text>

              <Text style={styles.detailValue}>
                Spanish
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text>📅</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Member Since
              </Text>

              <Text style={styles.detailValue}>
                {formatDate(
                  user?.created_at
                )}
              </Text>
            </View>
          </View>
        </View>


        <Pressable
          onPress={() =>
            navigation.navigate(
              'EditProfile'
            )
          }
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>
        </Pressable>
        <Pressable
  onPress={handleDeleteAccount}
  style={styles.deleteButton}
>
  <Text style={styles.deleteButtonText}>
    Delete Account
  </Text>
</Pressable>
      </ScrollView>
    </SafeAreaView>

  );
}

const createStyles=(colors)=>({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  headerSpacer: {
    width: 42,
  },

  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: colors.border,
    marginBottom: 30,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
  },

  profileName: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 5,
  },

  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },

  detailsCard: {
  backgroundColor: colors.card,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.border,
  paddingHorizontal: 18,
},

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
  },

  editButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  deleteButton: {
  marginTop: 12,
  height: 52,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#D9534F',
  justifyContent: 'center',
  alignItems: 'center',
},

deleteButtonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#D9534F',
},
});