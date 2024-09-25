import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import TrackPlayer, { Capability } from 'react-native-track-player';

const AudioPlayer = () => {
  useEffect(() => {
    // Function to setup Track Player
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer();

      // Define capabilities
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });

      // Adding a track
      await TrackPlayer.add({
        id: 'trackId',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Replace with your audio URL
        title: 'Track Title',
        artist: 'Track Artist',
        artwork: 'https://example.com/artwork.jpg', // Replace with your artwork URL
      });
    };

    setupPlayer();

    // Clean up on unmount
    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  const play = async () => {
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const stop = async () => {
    await TrackPlayer.stop();
  };

  return (
    <View style={styles.container}>
      <Button title="Play" onPress={play} />
      <Button title="Pause" onPress={pause} />
      <Button title="Stop" onPress={stop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioPlayer;
