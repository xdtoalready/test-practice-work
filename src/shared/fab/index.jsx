import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import Icon from '../Icon';

const FabComponent = ({onClick,icon,text,children,...props}) => {
  return (
    <Fab
      alwaysShowTitle={false}
      icon={icon}
      event="click"
      mainButtonStyles={{
        // bottom:-36,
        // right:-36,
        backgroundColor: '#FF6A55',
        width: 48,
        height: 48,
      }}
      onClick={onClick}
      text={text}

      {...props}
    >
      {children}
    </Fab>
  );
}
export default FabComponent;