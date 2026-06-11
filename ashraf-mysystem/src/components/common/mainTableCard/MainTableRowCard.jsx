
import React from 'react'
import styles from "./mainTableRowCard.module.css"

function MainTableRowCard({title, value}) {
  return (
    <div className={styles.rowCard}>
      <p className={styles.rowCardTitle}>{title}</p>
      <h2 className={styles.rowCardValue}>{value}</h2>
    </div>
  )
}

export default MainTableRowCard