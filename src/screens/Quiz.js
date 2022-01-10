import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import data from "../data/QuizData";
import { Ionicons } from "@expo/vector-icons";
import BottomFooter from "../components/BottomFooter";
import ChoiceAnswer from "../components/ChoiceAnswer";
import db from "../firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const Quiz = () => {
  const allQuestions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [unanswerQuestion, setUnanswerQuestion] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [words, setWords] = useState([]);
  const wordsCollectionRef = collection(db, "words");
  const [progress, setProgress] = useState(new Animated.Value(0));

  const getData = async () => {
    const data = await getDocs(wordsCollectionRef);
    setWords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const allQuestion = words.map((word) => word);
  const engSentence = words.map((word) => word.engSentence);
  const engWord = words.map((word) => word.engWord);
  const gerSentence = words.map((word) => word.gerSentence);
  const question = words.map((word) => word.question);
  const optionsOne = words.map((word) => word.optionsOne);
  const optionsTwo = words.map((word) => word.optionsTwo);

  const progressAnim = progress.interpolate({
    inputRange: [0, allQuestion.length],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    getData();
  }, []);

  const validateAnswer = (selectedOption) => {
    let correct_option = words.map((word) => word.correct_option);
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option[currentQuestionIndex]);
    setIsOptionsDisabled(true);
    if (selectedOption !== correct_option) {
      setScore(score + 1);
    }
    setShowNextButton(true);
  };

  console.log("scoree", score);

  const handleNext = () => {
    if (currentQuestionIndex === allQuestion.length - 1) {
      setShowScoreModal(true);
      setModalVisible(false);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionsDisabled(false);
      setShowNextButton(false);
      setModalVisible(false);
    }
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const restartQuiz = (resetQuestion) => {
    setUnanswerQuestion(resetQuestion);
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionsDisabled(false);
    setShowNextButton(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const correctWords = () => {
    if (currentQuestionIndex + 1) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#f2f2f2",
              fontSize: 22,
              marginTop: 20,
              textAlign: "center",
            }}
          >
            {engSentence[currentQuestionIndex]}
          </Text>
          <Text
            style={{
              textDecorationLine: "underline",
              fontWeight: "700",
              color: "#f2f2f2",
              fontSize: 22,
              marginTop: 20,
              textAlign: "center",
              marginLeft: 5,
            }}
          >
            {engWord[currentQuestionIndex]}
          </Text>
        </View>
      );
    }
  };

  const correctAnswers = () => {
    if (currentQuestionIndex + 1) {
      if (currentOptionSelected === null) {
        return (
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              marginTop: 55,
              width: "85%",
              textAlign: "center",
            }}
          >
            {question[currentQuestionIndex]}
          </Text>
        );
      } else if (currentOptionSelected !== null) {
        if (modalVisible) {
          return (
            <View
              style={{
                color: "#fff",
                fontSize: 17,
                marginTop: 40,
                textAlign: "center",
                width: "85%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {correctOption === currentOptionSelected ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 17,
                      marginRight: 5,
                    }}
                  >
                    {gerSentence[currentQuestionIndex]}
                  </Text>
                  <ChoiceAnswer
                    answer={currentOptionSelected}
                    backColor={"#20b2aa"}
                    fontColor={"#fff"}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 17,
                      marginRight: 5,
                    }}
                  >
                    {gerSentence[currentQuestionIndex]}
                  </Text>
                  <ChoiceAnswer
                    answer={currentOptionSelected}
                    backColor={"#ff4d4d"}
                    fontColor={"#fff"}
                  />
                </View>
              )}
            </View>
          );
        } else {
          return (
            <View
              style={{
                color: "#fff",
                fontSize: 17,
                marginTop: 40,
                textAlign: "center",
                width: "85%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  marginRight: 5,
                }}
              >
                {gerSentence[currentQuestionIndex]}
              </Text>
              <ChoiceAnswer
                answer={currentOptionSelected}
                backColor={"#ccc"}
                fontColor={"rgba(0, 30, 52, 0.9)"}
              />
            </View>
          );
        }
      }
    }
  };

  const renderQuestion = () => {
    return (
      <View
        style={{
          alignItems: "center",
          width: "100%",
          height: 200,
          marginTop: -20,
        }}
      >
        <Text
          style={{
            color: "#f2f2f2",
            fontSize: 12,
            marginTop: 15,
          }}
        >
          Fill in the missing word
        </Text>
        {correctWords()}
        {correctAnswers()}
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "75%",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          {currentOptionSelected === null
            ? optionsOne[currentQuestionIndex]?.map((option) => (
                <TouchableOpacity
                  onPress={() => validateAnswer(option)}
                  disabled={isOptionsDisabled}
                  key={option}
                  style={{
                    backgroundColor: "#ccc",
                    height: 55,
                    borderRadius: 20,
                    width: 115,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "rgba(0, 30, 52, 0.9)",
                      fontWeight: "800",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))
            : optionsOne[currentQuestionIndex]?.map((option) =>
                option !== currentOptionSelected ? (
                  <TouchableOpacity
                    onPress={() => validateAnswer(option)}
                    disabled={isOptionsDisabled}
                    key={option}
                    style={{
                      backgroundColor: "#ccc",
                      height: 55,
                      borderRadius: 20,
                      width: 115,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      flexDirection: "row",
                      paddingHorizontal: 20,
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(0, 30, 52, 0.9)",
                        fontWeight: "800",
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => validateAnswer(option)}
                    disabled={isOptionsDisabled}
                    key={option}
                    style={{
                      backgroundColor: "#003366",
                      height: 55,
                      borderRadius: 20,
                      width: 115,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      flexDirection: "row",
                      paddingHorizontal: 20,
                      marginVertical: 10,
                    }}
                  ></TouchableOpacity>
                )
              )}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "75%",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          {currentOptionSelected === null
            ? optionsTwo[currentQuestionIndex]?.map((option) => (
                <TouchableOpacity
                  onPress={() => validateAnswer(option)}
                  disabled={isOptionsDisabled}
                  key={option}
                  style={{
                    backgroundColor: "#ccc",
                    height: 60,
                    borderRadius: 20,
                    width: 120,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "rgba(0, 30, 52, 0.9)",
                      fontWeight: "800",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))
            : optionsTwo[currentQuestionIndex]?.map((option) =>
                option !== currentOptionSelected ? (
                  <TouchableOpacity
                    onPress={() => validateAnswer(option)}
                    disabled={isOptionsDisabled}
                    key={option}
                    style={{
                      backgroundColor: "#ccc",
                      height: 60,
                      borderRadius: 20,
                      width: 120,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      flexDirection: "row",
                      paddingHorizontal: 20,
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(0, 30, 52, 0.9)",
                        fontWeight: "800",
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => validateAnswer(option)}
                    disabled={isOptionsDisabled}
                    key={option}
                    style={{
                      backgroundColor: "#003366",
                      height: 60,
                      borderRadius: 20,
                      width: 120,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      flexDirection: "row",
                      paddingHorizontal: 20,
                      marginVertical: 10,
                    }}
                  ></TouchableOpacity>
                )
              )}
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    if (showNextButton) {
      return (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            width: "80%",
            height: 55,
            borderRadius: 25,
            backgroundColor: "#22c3bb",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              color: "#fff",
              fontSize: 13,
            }}
          >
            CHECK ANSWER
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={handleNext}
          style={{
            width: "80%",
            height: 55,
            borderRadius: 25,
            backgroundColor: "#003366",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontWeight: "700", color: "#fff", fontSize: 13 }}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderProgressBar = () => {
    return (
      <View
        style={{
          width: "65%",
          height: 25,
          borderRadius: 20,
          backgroundColor: "#00000020",
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={[
            {
              height: 18,
              borderRadius: 20,
              backgroundColor: "#136c68",
              marginLeft: 5,
            },
            {
              width: progressAnim,
            },
          ]}
        ></Animated.View>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#22c3bb",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 120,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {renderProgressBar()}
      </View>
      <View
        opacity={0.8}
        style={{
          width: "100%",
          height: 550,
          paddingVertical: 40,
          backgroundColor: "#00264d",
          position: "relative",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        {renderQuestion()}
        {renderOptions()}

        <View
          style={{
            width: "100%",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          {renderNextButton()}
        </View>
        {correctOption === currentOptionSelected ? (
          <BottomFooter
            visible={modalVisible}
            backColor={"#20b2aa"}
            answerText={"Great job!"}
            buttonTextColor={"#20b2aa"}
            onPress={handleNext}
          />
        ) : (
          <BottomFooter
            visible={modalVisible}
            backColor={"#ff4d4d"}
            answerText={`Answer: ${correctOption}`}
            buttonTextColor={"#ff4d4d"}
            onPress={handleNext}
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showScoreModal}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#252c4a",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "90%",
                borderRadius: 20,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {score > allQuestion.length / 2
                  ? "Congratulations! Game over"
                  : "Oops!"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    color:
                      score > allQuestion.length / 2 ? "#00C851" : "#ff4444",
                  }}
                >
                  {score}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: "#111",
                  }}
                >
                  / {allQuestion.length}
                </Text>
              </View>

              <TouchableOpacity
                onPress={restartQuiz}
                style={{
                  backgroundColor: "#3498db",
                  padding: 20,
                  width: "100%",
                  borderRadius: 35,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 20,
                  }}
                >
                  Retry Quiz
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
export default Quiz;
