import React from "react";
import cn from "classnames";
import styles from "./Theme.module.sass";
import Icon from "../Icon";
import {observer} from "mobx-react";
import useStore from "../../hooks/useStore";
import {themes} from "../../stores/theme.store";

const Theme = observer(({ className, visibleSidebar }) => {

  const {themeStore} = useStore()

  return (
    <label
      className={cn(className, styles.theme, { [styles.wide]: visibleSidebar })}
    >
      <input
        className={styles.input}
        defaultChecked={false}
        onChange={()=>themeStore.setTheme()}
        type="checkbox"
      />
      <span className={styles.inner}>
        <span className={styles.box}>
          <Icon name="sun" size="24" />
          Light
        </span>
        <span className={styles.box}>
          <Icon name="moon" size="24" />
          Dark
        </span>
      </span>
    </label>
  );
});

export default Theme;
