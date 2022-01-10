import React from "react";
import { View, Text } from "react-native";

const ChoiceAnswer = ({ answer, backColor, fontColor }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: 55,
        borderRadius: 20,
        width: 115,
        backgroundColor: backColor,
      }}
    >
      <Text
        style={{
          fontWeight: "800",
          color: fontColor,
          fontSize: 15,
        }}
      >
        {answer}
      </Text>
    </View>
  );
};

export default ChoiceAnswer;
