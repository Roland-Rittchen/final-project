import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { persistCache } from 'apollo3-cache-persist';
import AppLoading from 'expo-app-loading';
import { useEffect, useState } from 'react';
import HomeScreen from './components/screens/HomeScreen';
import Login from './components/screens/LoginScreen';
import Register from './components/screens/RegisterScreen';

const stack = createNativeStackNavigator();
const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
});

export default function App() {
  const [loadingCache, setLoadingCache] = useState(true);

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []);

  if (loadingCache) {
    return <AppLoading />;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <stack.Screen name="Home" component={HomeScreen} />
          <stack.Screen name="Register" component={Register} />
          <stack.Screen name="Login" component={Login} />
        </stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
