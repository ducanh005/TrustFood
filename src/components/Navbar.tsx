// CustomTabBar.tsx (ý tưởng)
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export const CustomTabBar = ({ state, navigation }: any) => {
  return (
    <View style={styles.bar}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}
          >
            <Text style={{ color: focused ? '#FFC727' : '#999' }}>
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#EEE',
  },
  item: { alignItems: 'center' },
});
