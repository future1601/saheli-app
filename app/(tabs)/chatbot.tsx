import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CHAT_HISTORY_KEY = 'chat_history';

// Update API URLs to match your server
const API_URLS = [
  'http://192.168.160.147:5000',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your financial assistant. How can I help you today?", isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState(API_URLS[0]);
  const scrollViewRef = useRef();

  useEffect(() => {
    loadChatHistory();
    checkServerConnection();
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const checkServerConnection = async () => {
    for (const url of API_URLS) {
      try {
        // Try to connect with a timeout of 3 seconds
        const response = await axios.get(`${url}/health`, { timeout: 3000 });
        if (response.status === 200) {
          console.log(`Connected successfully to ${url}`);
          setCurrentApiUrl(url);
          return;
        }
      } catch (error) {
        console.log(`Failed to connect to ${url}: ${error.message}`);
      }
    }
    
    // If we get here, none of the URLs worked
    Alert.alert(
      "Connection Error",
      "Could not connect to the chatbot server. Please check your network connection and server status.",
      [{ text: "OK" }]
    );
  };

  const loadChatHistory = async () => {
    try {
      const chatHistory = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (chatHistory) {
        setMessages(JSON.parse(chatHistory));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const resetChatHistory = () => {
    Alert.alert(
      "Reset Chat",
      "Are you sure you want to clear the chat history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            const initialMessage = { 
              id: Date.now(), 
              text: "Hi there! I'm your financial assistant. How can I help you today?", 
              isUser: false 
            };
            setMessages([initialMessage]);
            await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify([initialMessage]));
          }
        }
      ]
    );
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Call the FinChatbot API
      console.log('Sending request to:', `${currentApiUrl}/ask`);
      
      // Use a timeout to prevent hanging requests
      const response = await axios.post(`${currentApiUrl}/ask`, {
        question: userMessage.text,
        user_id: 'anonymous'
      }, { 
        timeout: 30000,  // Increased timeout to 30 seconds
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Response received:', response.data);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isUser: false,
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      console.error('Error getting response from chatbot:', error);
      
      // More detailed error logging
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      
      // Try to provide a more specific error message
      let errorText = "Sorry, I'm having trouble connecting to my financial knowledge. Please try again later.";
      
      if (error.code === 'ECONNABORTED') {
        errorText = "The request timed out. The server might be overloaded or unavailable.";
      } else if (error.message.includes('Network Error')) {
        errorText = "Network error. Please check your internet connection and make sure the server is running.";
        
        // Try to reconnect to a different server
        checkServerConnection();
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Assistant</Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetChatHistory}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.botBubble,
            ]}
          >
            {!message.isUser && (
              <View style={styles.botAvatarContainer}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#FF3B5C" />
              </View>
            )}
            <View
              style={[
                styles.messageContent,
                message.isUser ? styles.userMessageContent : styles.botMessageContent,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.botMessageText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View style={[styles.messageBubble, styles.botBubble]}>
            <View style={styles.botAvatarContainer}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#FF3B5C" />
            </View>
            <View style={[styles.messageContent, styles.botMessageContent, styles.loadingContainer]}>
              <ActivityIndicator size="small" color="#FF3B5C" />
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me about finance..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.disabledSendButton,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={(!inputText.trim() || isLoading) ? "#CCC" : "#FF3B5C"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  resetButtonText: {
    color: '#FF3B5C',
    fontSize: 14,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  botBubble: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  botAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botAvatar: {
    width: 24,
    height: 24,
  },
  messageContent: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userMessageContent: {
    backgroundColor: '#FF3B5C',
  },
  botMessageContent: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFF',
  },
  botMessageText: {
    color: '#333',
  },
  loadingContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#FF3B5C',
  },
  disabledSendIcon: {
    tintColor: '#CCC',
  },
}); 