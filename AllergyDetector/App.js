import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [upc, setUpc] = useState(null);

  

  async function sendApiRequest(){
   

    let APP_ID ="30823efb";
    let API_KEY = "f8e4435b29ffee39a8bd30189d9948a3";
    console.log(upc);
    return fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${API_KEY}&upc=${upc}&nutrition-type=cooking`, {
      method: 'GET',
      cache: 'no-cache',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  };


  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setUpc(`${data}`);

  
    alert(`${upc}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }



  return (
    <View style={styles.container}>
    <BarCodeScanner 
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
    {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    {<Button title={'Tap to Scan Again1'} onPress={() => sendApiRequest().then(data => {console.log(data.hints[0].food.nutrients);})} />}

  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
