import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { NotificationTwitt } from './components/notificationTwitt';
import { notificationTweets } from './data';

type NotificationTwittProps = React.ComponentProps<typeof NotificationTwitt>;

const renderItem = ({ item }: { item: NotificationTwittProps }) => (
  <NotificationTwitt {...item} />
);

const keyExtractor = (item: NotificationTwittProps) => item.id.toString();

export const AllNotifications = () => {
  const theme = useTheme();

  return (
    <FlatList
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
      style={{ backgroundColor: theme.colors.background }}
      data={notificationTweets}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={() => (
        <View style={{ height: StyleSheet.hairlineWidth }} />
      )}
    />
  );
};
