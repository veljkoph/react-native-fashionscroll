import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const MIN_HEIGHT = 128;
export const MAX_HEIGHT = height / 2;

interface Item {
  title: string;
  subtitle: string;
  image: string;
}
interface ItemProps {
  index: number;
  y: Animated.SharedValue<number>;
  item: Item;
}

const Item = ({ y, index, item: { title, subtitle, image } }: ItemProps) => {
  const inputRange = [(index - 1) * MAX_HEIGHT, index * MAX_HEIGHT];
  const containerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      -y.value,
      inputRange,
      [MIN_HEIGHT, MAX_HEIGHT],
      Extrapolate.CLAMP
    ),
    top: y.value,
  }));
  const subtitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      -y.value,
      [(index - 1) * MAX_HEIGHT, index * MAX_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });
  const pictureStyle = useAnimatedStyle(() => ({
    height: MAX_HEIGHT,

    top: interpolate(
      y.value,
      [(index - 1) * MAX_HEIGHT, index * MAX_HEIGHT],
      [-0, 0]
    ),
  }));
  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Image
        source={{ uri: image }}
        style={[pictureStyle, styles.picture]}
        resizeMode="cover"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <View style={styles.mainTitle}>
          <Animated.View style={subtitleStyle}>
            <Text style={styles.subtitle}>{subtitle.toUpperCase()}</Text>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    width,
    height: MIN_HEIGHT,
    justifyContent: "flex-end",
  },
  picture: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  title: {
    color: "white",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "500",
    fontFamily: "Cormorant-Bold",
  },
  titleContainer: {
    maxHeight: MAX_HEIGHT * 0.61,
    justifyContent: "center",
    flex: 1,
  },
  mainTitle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    padding: 32,
    transform: [{ translateY: 64 }],
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Cormorant-Medium",
  },
});

export default Item;
