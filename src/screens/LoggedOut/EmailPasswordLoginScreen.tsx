import React, { useCallback } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { InputField } from "../../components/InputField";
import { loginWithEmailAndPassword } from "../../store/slices/session";
import styled from "../../styled";
import { RootState, useThunkDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { Image, View } from "react-native";

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

  return (
    <View style={{ width: '100%', height: '100%'}}>
      <View style={{ flex: 1, justifyContent: 'flex-start', width: '100%'}}>
        <Image resizeMode={'contain'} source={require('../../assets/images/icon_w_background.png')} style={{ maxWidth:'90%' }} />
      </View>
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
                touched.password && errors.password ? errors.password : undefined
              }
            />
            <Button
              title="Log in"
              disabled={isAuthPending || !(isValid && dirty)}
              // TODO: Get rid of any
              onPress={handleSubmit as any}
            />
          </InputWrapper>
        )}
      </Formik>
    </View>
  );
};

const InputWrapper = styled.View`
  justify-content: flex-start;
  flex: 2;
  padding: 0 32px;
  paddingTop: 94px;
  width: 100%;
`;

const Button = styled.Button`
  margin-bottom: ${(props) => props.theme.spacing.small}px;
`;

export default EmailPasswordLoginScreen;
