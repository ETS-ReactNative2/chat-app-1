import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';

import axios from 'axios';
import { StackActions, NavigationActions } from 'react-navigation';

import { ChatConsumer } from '../components/Context';
import AppInput from '../components/AppInput';
import Logo from '../components/Logo';
import AppButton from '../components/AppButton';

export default class LoginScreen extends Component {

    emailRef = React.createRef();
    passwordRef = React.createRef();

    handleLogin = (email, password, updateUserInfo, setRootNavigation, navigate) => {
        let data = {
            email: email || '',
            password: password || ''
        };

        axios.post('http://localhost:8000/api/v1/login/', data).then( res => {
            updateUserInfo(res.data);
            setRootNavigation('Home');
            navigate('Home');
        }).catch(err => {
            console.warn(err.response.data);
        });
    }

    // TODO: Move this to navigation Provider
    handleSetRootNavigation = (route) => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: route })]
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <ChatConsumer>
                { context => {

                    let updateUserInfo = context.actions.updateUserInfo;

                    return(
                        <SafeAreaView style={styles.safeViewContainer}>
                            <KeyboardAvoidingView
                                style={styles.container}
                                behavior = "padding"
                                enabled
                            >
                                <View style={styles.logoContainer}>
                                    <Logo/>
                                </View>
                                <View style={styles.inputContainer}>
                                    <AppInput ref={this.emailRef} placeholder={'Email'}/>
                                    <AppInput ref={this.passwordRef} secureTextEntry={true} placeholder={'Password'}/>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <AppButton
                                        type={"primary"}
                                        style={{marginBottom: 5}}
                                        onPress={() => this.handleLogin(
                                            this.emailRef.current._lastNativeText,
                                            this.passwordRef.current._lastNativeText,
                                            updateUserInfo,
                                            this.handleSetRootNavigation('Home'),
                                            navigate
                                        )}
                                    >
                                        Login
                                    </AppButton>
                                    <AppButton
                                        type={"secondary"}
                                        style={{marginBottom: 5}}
                                        onPress={() => navigate('SignUp')}
                                    >
                                        Sign Up
                                    </AppButton>
                                </View>
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    )
                }}
            </ChatConsumer>
        );
    }
}

const styles = StyleSheet.create({
    safeViewContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    logoContainer: {
    },
    inputContainer: {
        marginBottom: 15,
        alignSelf: 'stretch'
    },
    buttonContainer: {
        alignSelf: 'stretch',
        alignItems: 'center'
    }
});
