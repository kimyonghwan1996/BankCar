import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { TextField } from '@mui/material';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import './css/ChattingRoom.css';
import Modal from 'react-modal';
import { FaExclamationCircle } from "react-icons/fa";


const ChattingRoom = () => {
    const { roomSeq } = useParams();
    // const [messageRoom, setMessageRoom] = useState({ roomSeq: null });
    const navigate = useNavigate();
    const deletenavigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [profileImage, setProfileImage] = useState('');
    const [userName, setUserName] = useState('');
    const stompClient = useRef(null);
    const messageEndRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const connectStompClient = () => {
        const socket = new SockJS('https://dongwoossltest.shop/api/chat');
        // const socket = new SockJS('http://localhost:8080/ws');
        
        stompClient.current = Stomp.over(socket);
        stompClient.current.heartbeat.outgoing = 10000; 
        stompClient.current.heartbeat.incoming = 10000; 
        stompClient.current.connect({}, () => {
            console.log("stomp연결 완료");
            setIsConnected(true);
            stompClient.current.subscribe('/topic/public/' + roomSeq, (message) => {
                const receivedMessage = JSON.parse(message.body);
               
                    console.log('받은 메시지:', receivedMessage);
                    if (receivedMessage.sender !== null) {
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    }
                
            });
        }, (error) => {
            console.error('Connection error:', error);
            setIsConnected(false);
            setTimeout(connectStompClient, 5000); // 5초 후에 재연결 시도
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('https://dongwoossltest.shop/api/messages/userInfo', { withCredentials: true });
                // const userResponse = await axios.get('http://localhost:8080/api/messages/userInfo', { withCredentials: true })
                const userData = userResponse.data;
                console.log('loginName='+userData.name);
                setUserName(userData.name);
                setProfileImage(userData.profile_image.replace('http://', 'https://'));

                const messagesResponse = await axios.get(`https://dongwoossltest.shop/api/messages/roomseq/${roomSeq}`);
                //    const messagesResponse = await axios.get(`http://localhost:8080/api/messages/roomseq/${roomSeq}`)
                setMessages(messagesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        connectStompClient();
        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log('WebSocket 연결 해제');
                });
            }
        };
    }, [roomSeq]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = () => {
        try {

            if (!message.trim()) {
                return;
            }
            const messageObj = {
                sender: userName,
                content: message,
                timestamp: new Date().toISOString(),
                messageRoom: { roomSeq: Number(roomSeq) }
            };
            
            console.log('보내는 sender:', messageObj.sender);
    
            // Ensure stompClient is connected before sending message
            if (stompClient.current && isConnected) { // 연결 상태를 확인
                stompClient.current.send("/app/sendMessage", {}, JSON.stringify(messageObj));
                
                console.log('웹소켓으로 보내는 정보:', messageObj);
                setMessage('');
            } else {
                console.error('웹소켓 연결 안됨');
            }
        } catch (error) {
            console.error('웹소켓 전송 에러:', error);
        }
    };

    const handleChatRoomDelete = async () => {
        setModalIsOpen(true);
    };

    const confirmDelete = () => {
        try {
            // 채팅방 삭제 요청을 서버로 보냅니다.
            const response = axios.delete(`https://dongwoossltest.shop/api/messagesroom/delete/${roomSeq}`, { withCredentials: true });
            // const response = axios.delete(`http://localhost:8080/api/messagesroom/delete/${roomSeq}`, { withCredentials: true });
            console.log('채팅방 삭제 요청 성공:', response.data);
            alert('채팅방 삭제가 완료되었습니다.');
            window.location.replace('/ChattingList');
        } catch (error) {
            console.error('채팅방 삭제 요청 실패:', error);
            // 에러 처리 로직을 추가할 수 있습니다
        }
      };
    const formatTimestamp = (sentTime) => {
        const date = moment.utc(sentTime).toDate();
        const formattedDate = moment(date).local().format('Ahh:mm').replace('AM','오전').replace('PM','오후');
        return formattedDate;
    };

    
      const closeModal = () => {
        setModalIsOpen(false);
      };
    return (
        <div className="chat-room">
            <header style={{marginBottom: -10, width: '200px'}}>
            <div className="chat-headernav" >
            <GoArrowLeft style={{width:'30px', height:'30px',
                marginTop:'4%', marginLeft:'20px'
            }}onClick={()=>{navigate(-1)}}
            />
            {/* <h1 style={{textAlign:'center', 
                            font:'apple SD Gothic Neo',
                            fontSize:'18px',
                            marginTop:'-6%'
                           }}>BankCarChat
            </h1> */}
            <img src={`${process.env.PUBLIC_URL}/image/nullImage2.png`} alt="clip" className="headerprofile"/>
            </div>
            </header>
            <div className="message-container">
                {messages.map((msg, index) => {
                    if (msg.sender === userName) {
                        return (
                            <div key={index} className="message-box-send">
                                <div className="message-info">
                                    
                                    <strong>{msg.sender}</strong>
                                    <img src={`${process.env.PUBLIC_URL}/image/nullImage2.png`} alt="clip" className="profile-image" />
                                </div>
                                <div className="message-content">
                                    {msg.content}
                                </div>
                                <div className="message-timestamp">
                                    {formatTimestamp(msg.sentTime)}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className="message-box-receive">
                                <div className="message-info">
                                {/* <img src={profileImage} alt="Profile Image" className="profile-image" /> */}
                                <img src={`${process.env.PUBLIC_URL}/image/nullImage2.png`} alt="clip" className="profile-image" />
                                    <strong>{msg.sender}</strong> 
                                </div>
                                
                                <div className="message-content">
                                    {msg.content} 
                                </div>
                                <div className="message-timestamp">
                                    {formatTimestamp(msg.sentTime)}
                                </div>
                            </div>
                        );
                    }
                })}
                <div ref={messageEndRef} /> {/* 메시지 끝 부분에 ref 추가 */}
            </div>
            
            <div className="input-area">
                <TextField
                    fullWidth
                    variant="outlined"
                    label="메시지를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
                />
                <button 
                    variant="contained"
                    onClick={handleSend}
                    disabled={!message}//값 없을때 못보냄 
                >
                    전송
                </button>
                <img className="image-clip"src={`${process.env.PUBLIC_URL}/image/clip.png`} alt="clip" />
                <img className="image-emog"src={`${process.env.PUBLIC_URL}/image/emog.png`} alt="emog" />
                <img className="image-setting"src={`${process.env.PUBLIC_URL}/image/setting.png`} alt="setting" />
                <img className="image-out"src={`${process.env.PUBLIC_URL}/image/logout.png`} alt="out" 
                onClick={handleChatRoomDelete}/>
                 {/* 모달 */}
       {/* Modal */}
       <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Confirmation Modal"
        className="chat-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
        <div className="icon-container">
      <FaExclamationCircle className="FaExclamationCircle" />
    </div>
          <p className='real-out'>정말로 채팅방을 나가시겠습니까?</p>
          <div className="chat-button-container">
            <button onClick={closeModal} className="cancel-button"><span>취소</span></button>
            <button onClick={confirmDelete} className="confirm-button"><span>확인</span></button>
          </div>
        </div>
      </Modal>
            </div>  
        </div>
    );
};

export default ChattingRoom;
