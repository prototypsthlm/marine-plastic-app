import React, { useCallback } from "react";
import { Pressable, Modal, StyleSheet, TouchableWithoutFeedback, View, Text } from "react-native";
import { theme } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking"





export const ModalComponent = (props: {
  visibilityState: boolean;
  setVisibilityFunction: any;
  popupTitle: string;
  popupText: string;
}) => {
  const onPress = useCallback( async () => {
    Linking.openURL('https://www.oceanscan.org/faqs')
  }, []);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visibilityState}
        onRequestClose={() => props.setVisibilityFunction(!props.visibilityState)}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <HelperPopup 
              title={props.popupTitle}
              text={props.popupText}
              ></HelperPopup> 
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.setVisibilityFunction(!props.visibilityState)}
              >
              <Text style={styles.textStyle}>Thanks!</Text>
            </Pressable>
            <Text style={{marginTop: 20, textAlign: "left"}}>Read more: <Text style={styles.link} onPress={onPress}>https://www.oceanscan.org/faqs</Text></Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const HelperPopup = (props: {
  title: string;
  text: string;
}) => {
  return(
    <View>
      <Text style={styles.modalTitle}>{props.title}</Text>
      <Text style={styles.modalText}>{props.text}</Text>
    </View>
  )
}


export const HelperButton = (props: {
  onPress: any;
}) => {
  const { onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Ionicons
        size={20}
        style={{ color: theme.color.palette.curiousBlue }}
        name="help-circle-outline"
      />
    </TouchableWithoutFeedback>
  );
}



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: theme.color.palette.curiousBlue,
    borderStyle: "solid",
    borderWidth: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 20,
    textAlign: "left"
  },
  link: {
    color: "#2196F3"
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "left",
    fontSize: 22
  },
  helperButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    color: theme.color.palette.curiousBlue,
  },
  helperButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: theme.color.palette.curiousBlue,

  }
});



