import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { userService } from '../service';
import { useTheme } from '@/hooks/useTheme';

export default function Login() {
  const [mode, setMode] = useState('LOGIN')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [error, setError] = useState('')
  
  const { colors } = useTheme();

  const validate = (): boolean => {
    if (error) {
      setError('');
    }

    if (!email || !password) {
      setError('You are missing required information');
      return false;
    }

    if (mode === 'SIGNUP') {
      if (!name) {
        setError('You are missing required information');
        return false;
      }

      if (password !== passwordRepeat) {
        setError('Passwords do not match');
        return false;
      }
    }

    setError('');
    return true;
  }

  const onPressLogin = async () => {
    if (!validate()) {
      return;
    }

    await userService.signIn(email, password);
  };
  
  const onPressSignUp = async () => {
    if (!validate()) {
      return;
    }

    await userService.signUp(email, password, name);
  };

  const getButtonText = (): string => {
    switch (mode) {
      case 'LOGIN': return 'Login';
      case 'SIGNUP': return 'Sign Up';
    }

    return 'Login';
  }

  const onPressAuth = async () => {
    setError('');
    try {
      switch (mode) {
        case 'LOGIN': await onPressLogin(); break;
        case 'SIGNUP': await onPressSignUp(); break;
      }
    } catch (e : any) {
      setError(e.message);
    }
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Habit Tracker</Text>

        <View style={styles.inputView}>
          {mode === 'SIGNUP' && 
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder='NAME'
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              onBlur={() => { if (error) validate(); }}
              autoCorrect={false}
              autoCapitalize='none'
            />
          }
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder='EMAIL'
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            onBlur={() => { if (error) validate(); }}
            autoCorrect={false}
            autoCapitalize='none'
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder='PASSWORD'
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onBlur={() => { if (error) validate(); }}
            autoCorrect={false}
            autoCapitalize='none'
          />
          {mode === 'SIGNUP' && 
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder='REPEAT PASSWORD'
              placeholderTextColor="#aaa"
              secureTextEntry
              value={passwordRepeat}
              onChangeText={setPasswordRepeat}
              onBlur={() => { if (error) validate(); }}
              autoCorrect={false}
              autoCapitalize='none'
            />
          }
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={styles.buttonView}>
          <Button title={getButtonText()} onPress={onPressAuth} />
        </View>

        {mode === 'SIGNUP' ? 
          <Text style={styles.footerText}>Have an Account already?<Pressable onPress={() => { setMode('LOGIN'); setPasswordRepeat(''); setName(''); setError('')}}><Text style={styles.link}> Log In</Text></Pressable></Text>
          :<Text style={styles.footerText}>Don't Have an Account?<Pressable onPress={() => { setMode('SIGNUP'); setError('')}}><Text style={styles.link}> Sign Up</Text></Pressable></Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    flex: 1,
    alignItems: 'center',
  },
  container: {
    width: 400,
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize : 30,
    fontWeight : "bold",
    textTransform : "uppercase",
    paddingVertical : 20,
    paddingHorizontal: 40,
  },
  inputView: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 5
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 20,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 7,
  },
  error: {
    color: 'red'
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 50,
    marginVertical: 20
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 13
  },
  link: {
    color: 'blue',
    marginBottom: -4,
  }
})
