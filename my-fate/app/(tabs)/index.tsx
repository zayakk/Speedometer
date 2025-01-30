import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Svg, Circle } from 'react-native-svg';

export default function App() {
  const [speed, setSpeed] = useState(0);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
      }
    };

    getLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermission) {
      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
        },
        (location) => {
          // The speed is in meters per second, so convert to km/h
          const speedInKmh = location.coords.speed * 3.6; // meters/sec to km/h
          setSpeed(speedInKmh);
        }
      );

      return () => subscription.remove();
    }
  }, [locationPermission]);

  const renderSpeedometer = () => {
    const maxSpeed = 180; // Max speed for the gauge (km/h)
    const radius = 100;
    const strokeWidth = 20;

    const angle = (speed / maxSpeed) * 180;

    const x1 = radius + radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y1 = radius + radius * Math.sin((angle - 90) * (Math.PI / 180));

    return (
      <Svg height={radius * 2} width={radius * 2}>
        <Circle cx={radius} cy={radius} r={radius} stroke="#ddd" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke="green"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * Math.PI * radius * 2}, ${Math.PI * radius * 2}`}
          fill="none"
        />
        <Text style={styles.speedText}>{speed.toFixed(1)} km/h</Text>
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      {renderSpeedometer()}
      <Text style={styles.speed}>{`${speed.toFixed(1)} km/h`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  speed: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
  speedText: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});
