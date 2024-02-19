import React, {useState} from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {Button, HelperText, TextInput} from "react-native-paper";
import {useLoginHandler} from "../../authentication/LoginHandler";
import {useWixSession} from "../../authentication/session";

export function CustomLoginScreen({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {sessionLoading} = useWixSession();
    const {login} = useLoginHandler();

    const loginHandler = async () => {
        setError(false);
        try {
            await login(email, password);
            navigation.navigate("Home");
        } catch (e) {
            setErrorMessage(e);
            setError(true);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputView}>
                <TextInput
                    theme={{colors: {primary: '#403F2B'}}}
                    style={styles.input}
                    value={email}
                    mode={'outlined'}
                    onChangeText={(text) => {
                        setEmail(text);
                        setError(false);
                    }}
                    autoCorrect={false}
                    autoCapitalize='none'
                    label={'Email Or Username'}
                />
                <TextInput
                    theme={{colors: {primary: '#403F2B'}}}
                    mode={'outlined'}
                    style={styles.input}
                    secureTextEntry value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setError(false);
                    }}
                    autoCorrect={false}
                    autoCapitalize='none'
                    label={'Password'}
                />
                <Button style={styles.loginButton} mode="contained" onPress={loginHandler} loading={sessionLoading}>
                    Login
                </Button>
                <HelperText type="error" visible={error}>
                    {errorMessage}
                </HelperText>
            </View>

            {/*<TextInput*/}
            {/*    label="Email"*/}
            {/*    value={email}*/}
            {/*    onChangeText={(text) => setEmail(text)}*/}
            {/*/>*/}
            {/*<TextInput*/}
            {/*    label="Password"*/}
            {/*    value={password}*/}
            {/*    secureTextEntry={true}*/}
            {/*    onChangeText={(text) => setPassword(text)}*/}
            {/*/>*/}
            {/*<Button*/}
            {/*    mode="contained"*/}
            {/*    onPress={async () => {*/}
            {/*        await login(email, password);*/}
            {/*        navigation.navigate("Home");*/}
            {/*    }}*/}
            {/*    loading={sessionLoading}*/}
            {/*>*/}
            {/*    Login*/}
            {/*</Button>*/}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    title: {
        fontSize: 40,
        fontWeight: "normal",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "#403F2B",
        fontFamily: "Fraunces-Regular",
        letterSpacing: 2,
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 50,
    },
    input: {
        minWidth: "100%",
        paddingHorizontal: 20,
        backgroundColor: "transparent",
    },
    loginButton: {
        backgroundColor: '#403F2B'
    }
})