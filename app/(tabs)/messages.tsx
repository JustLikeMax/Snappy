import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MessagesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Nachrichten</ThemedText>
      <ThemedText>Your conversations will appear here!</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
