"use client"
import get from "lodash/get";
import useSWR from "swr";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import CartSummaryDeliveryItem from "@/modules/cart/components/summary/CartSummaryDeliveryItem";

import {
  DELIVERY_OPERATION_UNIT_ID,
  UTC_OFFSET_MINUTES,
} from "constants/AppConstants";

import styles from "./CartSummaryDeliveryDates.module.scss";

dayjs.extend(utc); // use UTC + offset 120min (Europe/Bratislava) because of different timezones

const dayIndexComplementCalculator = (duration) => {
  const now = dayjs().utc().utcOffset(UTC_OFFSET_MINUTES);
  let defautDateAfter = 1;
  let defautDateBefore = 0;
  if(duration){
    defautDateAfter = Number(duration) + 1;
  }
  if(duration){
    defautDateBefore = Number(duration)
  }
  const dayCommplement = now.format("HH:mm") > "15:00" ? defautDateAfter : defautDateBefore;

  return (index) => {
    return index + dayCommplement;
  };
};

const CartSummaryDelivery = ({delivery}) => {
  dayjs.locale('en')
  const duration = delivery?.duration;

  const daysCount = 7;

  const { data: days } = useSWR(
    `/api/pages/operation-unit/${DELIVERY_OPERATION_UNIT_ID}/opening-hours-next-days?daysCount=${daysCount}`,
    (url) => fetch(url).then((r) => r.json())
  );

  const getDayIndex = dayIndexComplementCalculator(duration);

  const fakeStart= {
    "date": "2024-07-16",
    "dateFormatted": "16.07.2024",
    "time": "00:00",
    "dayTranslated": "Utorok",
    "alternativeDayTranslated": "Zajtra",
    "value": "2024-07-16"
  }

  const fakeEnd = {
    "date": "2024-07-19",
    "dateFormatted": "19.07.2024",
    "time": "00:00",
    "dayTranslated": "Piatok",
    "alternativeDayTranslated": "Piatok",
    "value": "2024-07-19"
  }

  return (
    <div className={styles.dates}>
      {/*<CartSummaryDeliveryItem*/}
      {/*  day={get(days, [getDayIndex(1), "alternativeDayTranslated"])}*/}
      {/*  date={get(days, [getDayIndex(1), "dateFormatted"])}*/}
      {/*/>*/}
      {/*<CartSummaryDeliveryItem*/}
      {/*  day={get(days, [getDayIndex(2), "alternativeDayTranslated"])}*/}
      {/*  date={get(days, [getDayIndex(2), "dateFormatted"])}*/}
      {/*/>*/}
      <CartSummaryDeliveryItem
        day={get(fakeStart, "alternativeDayTranslated")}
        date={get(fakeStart, "dateFormatted")}
      />
      <CartSummaryDeliveryItem
        day={get(fakeEnd, "alternativeDayTranslated")}
        date={get(fakeEnd, "dateFormatted")}
      />
    </div>
  );
};

export default CartSummaryDelivery;
