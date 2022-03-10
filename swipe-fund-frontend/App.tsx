import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { persistCache } from 'apollo3-cache-persist';
import AppLoading from 'expo-app-loading';
import { useEffect, useState } from 'react';
import Contact from './components/screens/ContactScreen';
import Daily from './components/screens/DailyScreen';
import Demo from './components/screens/DemoScreen';
import HomeScreen from './components/screens/HomeScreen';
import Login from './components/screens/LoginScreen';
import Logout from './components/screens/LogoutScreen';
import Ranking from './components/screens/RankingScreen';
import Signup from './components/screens/SignupScreen';
import User from './components/screens/UserScreen';

const stack = createNativeStackNavigator();
const drawer = createDrawerNavigator();
const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
});

export default function App() {
  const [loadingCache, setLoadingCache] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    })
      .then(() => setLoadingCache(false))
      .catch((e) => console.log(e));
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
          <drawer.Navigator initialRouteName="Home">
            {isLoggedIn ? (
              // Screens for logged in users
              <stack.Group>
                <stack.Screen name="Profile" component={User} />
                <stack.Screen name="Daily" component={Daily} />
                <stack.Screen name="Ranking" component={Ranking} />
                <stack.Screen name="Logout" component={Logout} />
              </stack.Group>
            ) : (
              // Auth screens for NOT logged in users
              <stack.Group>
                <stack.Screen name="Home" component={HomeScreen} />
                <stack.Screen name="Login" component={Login} />
                <stack.Screen name="Signup" component={Signup} />
                <stack.Screen name="Demo" component={Demo} />
              </stack.Group>
            )}
            {/* Common modal screens */}
            <stack.Group screenOptions={{ presentation: 'modal' }}>
              <stack.Screen name="Contact" component={Contact} />
            </stack.Group>
          </drawer.Navigator>
        </stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
