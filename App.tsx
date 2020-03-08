import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';

import { Main } from './src/main';
import { Store } from './src/store/store';

export default function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <AppearanceProvider>
          <Main />
        </AppearanceProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

// import Data from './training/dataRegister';

// export default function App() {
//   return <Data />;
// }
