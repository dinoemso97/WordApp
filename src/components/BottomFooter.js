import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BottomFooter = ({
  visible,
  backColor,
  answerText,
  buttonTextColor,
  onPress,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          width: "100%",
          height: 150,
          backgroundColor: backColor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          alignItems: "center",
          position: "absolute",
          bottom: 0,
        }}
      >
        <View
          style={{
            width: "75%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
            }}
          >
            {answerText}
          </Text>
          <Ionicons name="flag" size={18} color="#fff" />
        </View>
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: "80%",
            height: 55,
            borderRadius: 25,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              color: buttonTextColor,
              fontSize: 13,
            }}
          >
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default BottomFooter;
