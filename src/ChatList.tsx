import React, { FC } from 'react';
import classes from './App.module.scss';
import moment from "moment";

export const messageData = 'data';

const colors: string[] = ['red', '#0050c8', '#000', 'yellow', 'orange', 'limegreen', 'indigo', 'violet'];
const ChatList: FC<any> = (props) => {
  const { data, onClick, active } = props;

  return (
    <div className={classes.chatList}>
      <div className={classes.chatHead}>
        <input placeholder="Search or start a new Chat" className={classes.input} />
      </div>
      <div className={classes.dataList}>
        {Object.keys(data).map((e: any, i) => (
          <div key={i} className={[classes.user, e === active ? classes.active:''].join(' ')}>
            <div className={classes.image}>
              <div
                style={{ backgroundColor: colors[i % colors.length] }}
                className={classes.img}
              >
                {e.substr(0, 2)}
              </div>
            </div>
            <div onClick={() => onClick(e)} className={classes.data}>
              <div style={{ lineHeight: '18px' }} className={classes.name}>
                {e}
              </div>
              {
                // @ts-ignore
                <div className={classes.text}>{Object.values(data[e])[Object.values(data[e]).length - 1]?.text}</div>
              }
            </div>
            <div className={classes.content}>
              <div style={{ lineHeight: '18px' }}>
                {
                  // @ts-ignore
                  moment(Object.values(data[e])[Object.values(data[e]).length - 1]?.createdAt).fromNow()
                }
              </div>
              <div>
                <i
                  style={{
                    marginLeft: 2,
                    fontSize: 16,
                    verticalAlign: 'middle',
                    color: '',
                  }}
                  className="material-icons"
                >
                  {''}
                </i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
