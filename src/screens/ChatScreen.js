import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatbotResponse } from '../services/OpenAIService';
import { PaperAirplaneIcon, ArrowPathIcon } from 'react-native-heroicons/solid';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

const darkColors = {
    background: '#121212',
    text: '#EAEAEA',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    surface: '#1E1E1E',
    userBubble: '#5A428D', // A deeper, more distinct purple
    botBubble: '#2A2A2A',
};

const CHAT_HISTORY_KEY = 'chat_history';
const initialMessage = { role: 'assistant', content: "Hello! I'm your mindful eating assistant. How can I help you today?" };

export default function ChatScreen() {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const headerHeight = useHeaderHeight();
    const flatListRef = useRef(null);

    const handleNewChat = () => {
        Alert.alert(
            "Start New Chat",
            "Are you sure? Your current conversation history will be permanently deleted.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Start New", 
                    onPress: async () => {
                        await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
                        setMessages([initialMessage]);
                    },
                    style: "destructive" 
                },
            ]
        );
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleNewChat} style={{ marginRight: 15 }}>
                    <ArrowPathIcon color={darkColors.primary} size={24} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // Load chat history on component mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const savedHistory = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
                if (savedHistory !== null) {
                    setMessages(JSON.parse(savedHistory));
                }
            } catch (error) {
                console.error('Failed to load chat history.', error);
            }
        };
        loadHistory();
    }, []);

    // Save chat history whenever messages change
    useEffect(() => {
        const saveHistory = async () => {
            try {
                // We don't save the initial message if it's the only one
                if (messages.length > 1) {
                    await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
                }
            } catch (error) {
                console.error('Failed to save chat history.', error);
            }
        };
        saveHistory();
        
        // Automatically scroll to the end when new messages are added
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (input.trim().length === 0) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const conversation = newMessages.map(({ role, content }) => ({ role, content }));
        const response = await getChatbotResponse(conversation);

        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
    }, [input, messages]);

    const renderMessage = ({ item }) => (
        <View style={[
            styles.messageContainer,
            item.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer
        ]}>
            <Text style={styles.messageText}>{item.content}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={headerHeight}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item, index) => `${item.role}-${index}`}
                    style={styles.messageList}
                    contentContainerStyle={{ paddingVertical: 10 }}
                />

                {isLoading && <ActivityIndicator size="small" color={darkColors.primary} style={styles.loadingIndicator} />}
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask a question..."
                        placeholderTextColor="#888"
                        multiline
                        keyboardAppearance="dark"
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
                        <PaperAirplaneIcon color={darkColors.primary} size={24} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: darkColors.background,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    messageList: {
        flex: 1,
    },
    messageContainer: {
        padding: 15,
        borderRadius: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    userMessageContainer: {
        backgroundColor: darkColors.userBubble,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 5,
    },
    botMessageContainer: {
        backgroundColor: darkColors.botBubble,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 5,
    },
    messageText: {
        color: darkColors.text,
        fontSize: 16,
    },
    loadingIndicator: {
        marginVertical: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: darkColors.surface,
        backgroundColor: darkColors.background,
    },
    input: {
        flex: 1,
        backgroundColor: darkColors.surface,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: darkColors.text,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: darkColors.surface,
        borderRadius: 25,
        padding: 10,
    },
}); 