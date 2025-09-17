import React from 'react'
import { router, Stack } from 'expo-router'
import StackHeader from '@/components/StackHeader'

export type RootStackParamList = {
  'sign-in': undefined,
  'check-password': undefined,
  'register-customer': { cpfCnpj: string},
  'not-registered': undefined,
  'register-password': undefined,
}

const AuthLayout = () => {
  return (
    <Stack
      initialRouteName='not-registered'
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_bottom'
      }}
    >

      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="check-password"
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="register-customer"
        options={{
          headerShown: true,
          header: () => <StackHeader left={true} lurl={() => router.back()} />
        }}
      />

      <Stack.Screen
        name="not-registered"
        options={{
          headerShown: true,
          header: () => <StackHeader right={true} rurl={() => router.push('/')} />
        }}
      />

      <Stack.Screen
        name="register-password"
        options={{
          headerShown: true,
          header: () => <StackHeader right={true} rurl={() => router.push('/')} />
        }}
      />

      <Stack.Screen
        name="registered"
        options={{
          headerShown: true,
          header: () => <StackHeader right={true} rurl={() => router.push('/')} />
        }}
      />

      <Stack.Screen
        name="password-changed"
        options={{
          headerShown: true,
          header: () => <StackHeader right={true} rurl={() => router.push('/')} />
        }}
      />

    </Stack>
  )
}

export default AuthLayout