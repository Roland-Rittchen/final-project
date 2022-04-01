import 'react-native-gesture-handler';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { persistCache } from 'apollo3-cache-persist';
import React, { useEffect, useState } from 'react';
import Contact from './components/screens/ContactScreen';
import Daily from './components/screens/DailyScreen';
import Demo from './components/screens/DemoScreen';
import HomeScreen from './components/screens/HomeScreen';
import Login from './components/screens/LoginScreen';
import Ranking from './components/screens/RankingScreen';
import Signup from './components/screens/SignupScreen';
import User from './components/screens/UserScreen';
import { userContext } from './util/Context';
import { navigationRef } from './util/RootNavigation';

export type RootStackParams = {
  Home: undefined;
  Profile: undefined;
  Daily: undefined;
  Ranking: undefined;
  Demo: undefined;
  Logout: undefined;
  Login: undefined;
  Signup: undefined;
  Contact: undefined;
};

type UserType = {
  id: number;
  username: String;
  userlevel: number;
  sessionId: number;
};
// const drawer = createNativeStackNavigator();
const drawer = createDrawerNavigator();
const cache = new InMemoryCache();
const link = createHttpLink({
  uri: 'http://10.0.2.2:4000/', // '/graphql',
  credentials: 'same-origin', // 'include',
});
const client = new ApolloClient({
  // uri: 'http://10.0.2.2:4000/',
  cache,
  link,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'ignore',
      fetchPolicy: 'network-only',
    },
  },
});

export default function App() {
  // const [loadingCache, setLoadingCache] = useState(true);
  const [user, setUser] = useState<UserType | undefined>();

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    })
      // .then(() => setLoadingCache(false))
      .catch((e) => console.log(e));
  }, []);

  return (
    <userContext.Provider
      // export variables/functions to child components using context
      value={{ setUser, user }}
    >
      <ApolloProvider client={client}>
        <NavigationContainer ref={navigationRef}>
          <drawer.Navigator
            useLegacyImplementation={true}
            initialRouteName="Home"
            screenOptions={{
              drawerActiveTintColor: '#fff',
              drawerActiveBackgroundColor: '#416006',
              drawerStyle: {
                backgroundColor: '#6DA10B',
                width: 240,
              },
              headerStyle: {
                backgroundColor: '#6DA10B',
              },
            }}
          >
            {user ? (
              // Screens for logged in users
              <drawer.Group>
                <drawer.Screen name="Home" component={HomeScreen} />
                <drawer.Screen name="Profile" component={User} />
                <drawer.Screen name="Daily" component={Daily} />
                <drawer.Screen name="Ranking" component={Ranking} />
                {/* <DrawerItem label="Logout" onPress={() => logout()} /> */}
                <drawer.Screen name="Demo" component={Demo} />
              </drawer.Group>
            ) : (
              // Auth screens for NOT logged in users
              <drawer.Group>
                <drawer.Screen name="Home" component={HomeScreen} />
                <drawer.Screen name="Login" component={Login} />
                <drawer.Screen name="Signup" component={Signup} />
              </drawer.Group>
            )}
            {/* Common modal screens */}
            <drawer.Group>
              <drawer.Screen name="Contact" component={Contact} />
            </drawer.Group>
          </drawer.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </userContext.Provider>
  );
}
