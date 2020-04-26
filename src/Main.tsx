import React, { ChangeEvent, FC, useEffect, useReducer, useState } from 'react';
import io from 'socket.io-client';
import classes from './App.module.scss';
import Input from './Input';
import moment from 'moment';
import { CLIENT_ID } from './Authenticate';
import ChatList, { messageData } from './ChatList';
import { useMedia } from 'react-use';

export interface Message {
  recipient: string;
  sender: string;
  id: string | number;
  text: string;
  createdAt: string;
  delivered?: boolean;
  sent?: boolean;
}

const UPDATE = 'add or update message';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          [action.payload.id]: {
            ...action.payload,
          },
        },
      };
    case '':
      return state;
    default:
      return state;
  }
};

const colors: string[] = ['red', '#0050c8', '#000', 'yellow', 'orange', 'limegreen', 'indigo', 'violet'];

const Main: FC<{}> = () => {
  const [value, setValue] = useState<string>('');
  const [socket, setSocket] = useState(() => io('http://127.0.0.1:5000'));
  const [id] = useState<string | null>(() => localStorage.getItem(CLIENT_ID));
  const [currentChat, setCurrentChat] = useState<string>('');

  useEffect(() => {
    setSocket(io('http://127.0.0.1:5000', { query: {id} }))
  }, [id]);

  const [data, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem(messageData) || '{}'));

  useEffect(() => {
    window.history.pushState({}, document.title, '/');
  }, []);

  useEffect(() => {
    const sock = socket.on(`${id}`, (payload: Message) => {
      dispatch({
        type: UPDATE,
        payload: { ...payload, key: id !== payload.sender ? payload.sender : payload.recipient },
      });
      if (payload.sender !== id && !payload.delivered) {
        socket.emit(`deliver`, { ...payload, delivered: true });
      }
    });
    return () => {
      sock.off(`${id}`);
    };
  });

  useEffect(() => {
    localStorage.setItem(messageData, JSON.stringify(data));
  }, [data]);

  const [online, setOnline] = useState<any>({});

  useEffect(() => {
    socket.on('status', (res:any) => {
      setOnline((users: any) => ({...users, [res.id]: res.online}))
    });
    return () => {
      socket.off('status')
    }
  }, [socket]);

  const messages: Message[] = Object.values(data[currentChat] || {});
  useEffect(() => {
    const list = document.getElementById('list');
    if(list) {
      // @ts-ignore
      list.scrollTop = list?.scrollHeight;
    }
  }, [messages.length]);

  const onSend = () => {
    const newMessage: Message = {
      text: value,
      id: Math.random(),
      recipient: currentChat,
      sender: `${id}`,
      createdAt: moment().format(),
    };
    dispatch({ type: UPDATE, payload: { ...newMessage, key: currentChat } });
    setValue('');
    socket.emit('send', newMessage);
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    socket.emit('typing', { recipient: currentChat, text: e.target.value });
  };
  const isMobile = useMedia('(max-width: 575px)');
  const [listPageVisible, setListPageVisible] = useState(true);

  useEffect(() => {
    if (!isMobile) {
      setListPageVisible(true);
    }
  }, [isMobile]);

  return (
    <div className={classes.app}>
      {(!isMobile || listPageVisible) && (
        <ChatList
          onClick={(val: string) => {
            setCurrentChat(val);
            setListPageVisible(false);
          }}
          active={currentChat}
          data={data}
        />
      )}
      {(!isMobile || !listPageVisible) && (
        <div className={classes.chat}>
          <div className={classes.head}>
            {!listPageVisible && isMobile && (
              <i onClick={() => setListPageVisible(true)} className="material-icons">
                arrow_back
              </i>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{ backgroundColor: colors[Object.keys(data).length % colors.length] }}
                className={classes.img}
              >
                {currentChat.substr(0, 2)}
              </div>
            </div>
            <div style={{ marginLeft: 8, color: isMobile ? '#fff' : '' }}>
              <div className={classes.name}>{currentChat}</div>
              <div>
                {
                  online[currentChat] ? 'online' : 'offline'
                }
              </div>
            </div>
          </div>
          <div id="list" className={classes.list}>
            {messages.map((message: Message, index: number) => (
              <div className={message.sender !== `${id}` ? classes.received : classes.sent} key={index}>
                <span>{message.text}</span>
                <span className={classes.time}>
                  {moment(message.createdAt).format('HH:mm')}
                  {message.sender === `${id}` && (
                    <i
                      style={{
                        marginLeft: 2,
                        fontSize: 16,
                        verticalAlign: 'middle',
                        color: message.delivered ? '#2196F3' : '',
                      }}
                      className="material-icons"
                    >
                      {message.delivered ? 'done_all' : !message.sent ? 'access_time' : 'done'}
                    </i>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className={classes.flex}>
            <div className={isMobile ? classes.mobileEmoji : ''} style={{ width: '100%' }}>
              {isMobile && <i className={`material-icons ${classes.i}`}>mood</i>}
              <Input emoji={!isMobile} value={value} onChange={onChange} />
            </div>
            <button onClick={value ? onSend : undefined} className={classes.button}>
              <i
                style={{
                  fontSize: 16,
                }}
                className="material-icons"
              >
                {value ? 'send' : 'keyboard_voice'}
              </i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
