import React, { useCallback } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { InputField } from "../../components/InputField";
import { loginWithEmailAndPassword } from "../../store/slices/session";
import styled from "../../styled";
import { RootState, useThunkDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { Image, KeyboardAvoidingView, Platform, Linking, Text } from "react-native";

interface InitialFormValues {
  email: string;
  password: string;
}

const initialFormValues: InitialFormValues = {
  email: "",
  password: "",
};

const loginValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const EmailPasswordLoginScreen = () => {
  const authStatus = useSelector<RootState, string>(
    (state) => state.session.status
  );
  const isAuthPending = authStatus === "PENDING";
  const dispatch = useThunkDispatch();

  const onSubmit = useCallback((values) => {
    dispatch(loginWithEmailAndPassword(values));
  }, []);

  const onRegisterPress = useCallback( async () => {
    Linking.openURL('https://www.oceanscan.org/register')
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ width: "100%", height: "100%", flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <Formik
        initialValues={initialFormValues}
        onSubmit={onSubmit}
        validateOnBlur
        validationSchema={loginValidation}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          isValid,
          dirty,
          errors,
          touched,
        }) => (
          <InputWrapper>
            <Image
                resizeMode={"contain"}
                source={require("../../assets/images/icon_w_background.png")}
                style={{ flex: 1, justifyContent: "flex-start", maxWidth: "90%" }}
              />
            <InputField
              invertColors
              label="Email"
              onChangeText={handleChange("email")}
              preset="email"
              stylePreset="rounded"
              onBlur={handleBlur("email")}
              value={values.email}
              error={touched.email && errors.email ? errors.email : undefined}
            />
            <InputField
              invertColors
              label="Password"
              onChangeText={handleChange("password")}
              preset="password"
              stylePreset="rounded"
              onBlur={handleBlur("password")}
              value={values.password}
              error={
                touched.password && errors.password
                  ? errors.password
                  : undefined
              }
            />
            <Button
              title="Log in"
              disabled={isAuthPending || !(isValid && dirty)}
              // TODO: Get rid of any
              onPress={handleSubmit as any}
            />
            <Text style={{color: "#2196F3", textAlign: "center", marginTop: 10}} onPress={onRegisterPress}>No account? Register on the website</Text>
          </InputWrapper>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const InputWrapper = styled.View`
  justify-content: flex-start;
  flex: 1;
  padding: 0 32px;
  padding-top: 10%;
  padding-bottom: 20%;
  height: 100%;
  width: 100%;
`;

const Button = styled.Button`
  margin-bottom: ${(props) => props.theme.spacing.small}px;
`;

export default EmailPasswordLoginScreen;
