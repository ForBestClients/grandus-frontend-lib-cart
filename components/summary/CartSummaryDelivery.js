import get from "lodash/get";

import CartSummaryDeliveryDates from "@/modules/cart/components/summary/CartSummaryDeliveryDates";

import styles from "./CartSummaryDelivery.module.scss";

const CartSummaryDelivery = ({ className = "", options = {}, delivery = {} }) => {

  return (
    <div className={`${styles.deliveryDate} ${className}`}>
      {get(options, "useMessage", false) && get(options, "message") ? (
        <>
          <p>Doručíme za</p>
          <strong
            className={
              get(options, "isAvailable") ? styles.avail : styles.unavail
            }
          >
            {get(options, "message")}
          </strong>
        </>
      ) : (
        <>
          <p>Môžete mať už</p>
          <CartSummaryDeliveryDates delivery={delivery} />
        </>
      )}
    </div>
  );
};

export default CartSummaryDelivery;
