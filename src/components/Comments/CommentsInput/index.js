import React, { useRef, useState, createContext, useContext } from 'react';
import FileUpload from '../../../shared/File/Input';
import { loadAvatar } from '../../../pages/Clients/clients.mocks';
import styles from './CommentsInput.module.sass';
import FileElement from '../../../shared/File/Element';
import TextInput from '../../../shared/TextInput';
import Icon from '../../../shared/Icon';
import Tooltip from '../../../shared/Tooltip';
import { EditorContext } from '../../../shared/Editor/context/editor.context';
const CommentsInput = ({ onSendMessage, currentUser, commentsLength }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const comment = useRef('');
  const commentFiles = useRef([]);
  const { clearEditor } = useContext(EditorContext);
  const handleTextChange = event => {
    setText(event.target.value);
  };
  const handleTextCommentChange = event => {
    comment.current = event.target.value;
  };
  const handleSendMessage = () => {
    if (text.trim() || files.length > 0) {
      const newMessage = {
        id: commentsLength,
        date: new Date(),
        sender: currentUser,
        value: {
          text: text === '' || text === ' ' ? '⠀' : text,
          files: files.map(file => ({
            id: file.id,
            name: file.name,
            extension: file.extension,
            blob: file ?? null,
          })),
        },
      };
      onSendMessage(newMessage);
      setText('');
      setFiles([]);
    }
  };
  const handleSendMessageComment = () => {

    if (comment.current.trim() || commentFiles.current.length > 0) {
      const newMessage = {
        id: commentsLength,
        date: new Date(),
        sender: currentUser,
        value: {
          text: comment.current === '' || comment.current === ' ' ? '⠀' : comment.current,
          files: commentFiles.current.map(file => ({
            id: file.id,
            name: file.name,
            extension: file.extension,
            blob: file ?? null,
          })),
        },
      };
      onSendMessage(newMessage).then(()=>{

        comment.current = '';
        commentFiles.current = [];
        setText('')
        setFiles([]);
        clearEditor();
      });


    }
  }
  
  const handleFileUpload = (uploadedFiles) => {
    const processedFiles = Array.from(uploadedFiles).map((file) => ({
      id: Math.random().toString(36).substring(2, 10) + file.name + file.lastModified + new Date().toISOString(), // Временный ID для UI
      name: file.name.split('.')[0],
      extension: `.${file.name.split('.').pop()}`,
      blob: file, // Сохраняем сам файл для отправки
    }));
    commentFiles.current = [...commentFiles.current, ...processedFiles]
    setFiles(prevFiles => [...prevFiles, ...processedFiles]);
  };

  const handleDeleteFile = (deletedFileId) => {
    setFiles(prev => {
      const updated = prev.filter(el => el.id !== deletedFileId);
      return updated;
    });
    commentFiles.current = commentFiles.current.filter(el => el.id !== deletedFileId)
  };


  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <div className={styles.input_attach}>
          <Tooltip title={'Вставить файлы'}>
            <FileUpload onFileUpload={handleFileUpload} />
          </Tooltip>
        </div>
        <div className={styles.input_field}>
          <TextInput
            height={100}
            edited={true}
            name={'comment'}
            type="editor"
            className={styles.comment_input}
            value={text}
            comment={comment}
            onChange={handleTextChange}
            onChangeComment={handleTextCommentChange}
            handleEnter={handleSendMessageComment}
            onFileUpload={handleFileUpload}
            placeholder="Ваше сообщение"
          />
        </div>
        <div className={styles.input_send}>
          <Icon
            className={styles.send}
            viewBox={'0 0 20 20'}
            size={20}
            fillRule={'evenodd'}
            fill={'#6F767E'}
            name={'send'}
            onClick={handleSendMessageComment}
          >
            Send
          </Icon>
        </div>
      </div>
      <div className={styles.files}>
        {files.map((el) => (
          <FileElement
            onDelete={(id) => handleDeleteFile(id)}
            key={el.id}
            file={el}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsInput;
