import styles from "../winterMode.module.css"

const Snowflake = (props) => {
  return(
      <p className={styles.snowflake} id={`item${props.id}`} style={props.style}>
          *
      </p>
  )
}

export default Snowflake;