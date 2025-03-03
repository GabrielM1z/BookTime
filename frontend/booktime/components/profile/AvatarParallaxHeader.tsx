import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolate, Extrapolation } from 'react-native-reanimated';

import { Appbar } from 'react-native-paper';

const { height: screenHeight } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = screenHeight * 0.4;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const StickyParallaxHeader: React.FC = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
    //   height: interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], Extrapolate.CLAMP),
      transform: [{
        translateY: interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [0, -HEADER_SCROLL_DISTANCE], Extrapolation.CLAMP),
      }],
    };
  });

  const headerBarStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE], [0, 0.5, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.scrollViewContent}>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet...</Text>
          {/* Add more content here to enable scrolling */}
        </View>
      </Animated.ScrollView>
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Sticky Parallax Header</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.headerBar, headerBarStyle]}>
        <Text style={styles.headerBarText}>Header Bar</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: HEADER_MAX_HEIGHT,
  },
  scrollViewContent: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6200EE',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StickyParallaxHeader;