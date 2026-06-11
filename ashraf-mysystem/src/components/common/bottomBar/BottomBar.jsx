import { useNavigate } from "react-router-dom";
import BottomBarItem from "./BottomBarItem";
import styles from "./bottomBar.module.css";

export default function BottomBar({ items = [] }) {
  /* Navigate */
  const navigate = useNavigate();

  /* Handle navigate */
  const handleNavigate = (path) => {
    if (!path) return;

    navigate(path);
  };

  return (
    <ul className={styles.navbar}>
      {items?.map((item) => (
        <BottomBarItem
          key={item.path}
          onNavigate={handleNavigate}
          to={item?.path}
          tooltipTitle={item?.tooltipTitle}
          icon={item?.icon}
          title={item?.title}
          notifCount={item?.notifCount}
        />
      ))}
    </ul>
  );
}
