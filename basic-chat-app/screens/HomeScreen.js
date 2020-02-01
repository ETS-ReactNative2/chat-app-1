import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import axios from 'axios';

import { ChatConsumer, ChatConsumer } from '../components/Context';
import ChatMenuItem from '../components/ChatMenuItem';
import AddNewButton from '../components/AddNewButton';

class HomeScreen extends Component {

    componentDidMount() {
        this.handleGetRooms(
            this.props.context.user.authToken,
            this.props.context.actions.addChatUsers
        );
    }

    handleGetRooms = (authToken, addChatUsers) => {
        let opts = {
            headers: {
                Authorization: `Token ${authToken}`
            }
        }

        axios.get('http://localhost:8000/api/v1/chats/', opts).then(res => {
            addChatUsers(res.data);
        }).catch(err => {
            console.warn(err.response.data.detail);
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        const chatUsers = this.props.context.chatUsers;
        return (
            <SafeAreaView style={styles.safeViewContainer}>
                <AddNewButton onPress={() => navigate('AddNewChat')}/>
                <ScrollView style={styles.container}>
                    { chatUsers.map((item, index) =>
                        <ChatåMenuItem
                            key={index}
                            name={item.name}
                            latestMessage={item.latestText || 'Add New Message Here'}
                            image={item.avatar || 'https://www.publicdomainpictures.net/pictures/200000/velka/plain-red-background.jpg'}
                            onPress={() => navigate('Chat', {
                                chatUser: item
                            })}
                        />
                    )}
                </ScrollView>
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
    }
});


export default React.forwardRef((props, ref) => (
    <ChatConsumer>
        { context =>
            <HomeScreen {...props} context={context} ref={ref} />
        }
    </ChatConsumer>
));