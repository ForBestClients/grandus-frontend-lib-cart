import styles from "./CartSummaryDeliveryItem.module.scss";

const CartSummaryDeliveryItem = ({ day, date }) => {
  return (
    <>
      {day ? (
        <div className={styles.item}>
          {day}
          <small>{date}</small>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default CartSummaryDeliveryItem;
