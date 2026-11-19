import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#2b6cb0',
        tabBarInactiveTintColor: '#a0aec0',
      }}
    >
      {/* 1. Home Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Terminal / Bays List */}
      <Tabs.Screen
        name="terminals"
        options={{
          title: 'Terminal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="battery-charging" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Connect Vehicle */}
      <Tabs.Screen
        name="ConnectScreen"
        options={{
          title: 'Connect',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Map */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />

      {/* 5. User Profile */}
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
        
      />
    </Tabs>
    
  );
}