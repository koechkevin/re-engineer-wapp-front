import React, { ChangeEvent, FC } from 'react';
import classes from './App.module.scss';
import TextareaAutosize from 'react-textarea-autosize';

const Input: FC<any> = (props) => {
  const { value, onChange, emoji } = props;
  const onInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.persist();
    onChange(e);
  };
  return (
    <div className={classes.withEmoji} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {emoji && <i className="material-icons">
        mood
      </i>}
      <TextareaAutosize
        maxRows={6}
        style={{ width: 'calc(100% - 8px)' }}
        placeholder="Type a message"
        value={value}
        onChange={onInput}
        className={classes.input}
      />
    </div>
  );
};

export default Input;
