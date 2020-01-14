import React, { Component } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, SafeAreaView, Dimensions } from 'react-native';

export default class HomeScreen extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <SafeAreaView style={styles.safeViewContainer}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.item}>
                        <Image source={{ uri: "http://via.placeholder.com/150x150"}} style={styles.userImage} />
                        <View>
                            <Text>James</Text>
                            <Text>Hello World</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeViewContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        padding: 15
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 200,
        marginRight: 10
    }
});
