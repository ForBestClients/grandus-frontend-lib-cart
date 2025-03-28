'use client';

import dayjs from "dayjs";
import {useEffect, useMemo} from "react";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";

const calculateSubscriptionFromValue = () => {
  let dateFrom = dayjs().startOf('month');
  const dateTo = dayjs().endOf('year');
  const availableDates = [];

  while (dateFrom.isBefore(dateTo)) {
    const obj = {
      value: dateFrom.format('YYYY-MM-DD'),
      label: dateFrom.format('M/YYYY'),
    };

    let i = 1;

    if (dateFrom.month() === 0) {
      i = i + 1;
      obj.label = '1-2/' + dateFrom.format('YYYY');
    }

    if (dateFrom.month() === 6) {
      i = i + 1;
      obj.label = '7-8/' + dateFrom.format('YYYY');
    }

    dateFrom = dateFrom.add(i, 'month');
    availableDates.push(obj);
  }

  return availableDates;
}


const SubscriptionFromForm = ({setDeliveryStartFrom, deliveryStartFrom}) => {
  const dateFrom = dayjs().startOf('month');

  const availableMonths = useMemo(() => {
    return calculateSubscriptionFromValue();
  }, [dateFrom]);

  useEffect(() => {
    if (isEmpty(deliveryStartFrom)) {
      setDeliveryStartFrom(availableMonths[0].value);
    }
  }, []);

  const onChange = (e) => {
    setDeliveryStartFrom(e.target.value);
  }


  return (
    <>
      <select
        name="subscription-from"
        id="subscription-from"
        className={'rounded border border-text text-[14px] w-[100%] md:w-auto'}
        onChange={onChange}
        value={deliveryStartFrom}
      >
        {map(availableMonths, (option, i) => {
          return <option key={`subscription-from-option-${i}`} value={option.value}>{option.label}</option>;
        })}
      </select>
    </>
  )
}

export default SubscriptionFromForm;