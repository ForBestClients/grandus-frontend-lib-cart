'use client';

import useCart from "grandus-lib/hooks/useCart";
import CartSummaryItems from "@/modules/cart/components/CartSummaryItems";
import {useState} from "react";
import CheckboxInput from "components/_other/form/CheckboxInput";
import get from "lodash/get";
import Link from "next/link";
import isEmpty from "lodash/isEmpty";
import forEach from "lodash/forEach";
import Button from "components/_other/button/Button";
import Box from "@/components/_other/box/Box";
import map from "lodash/map";
import Alert from "components/_other/alert/Alert";
import dayjs from "dayjs";
import includes from "lodash/includes";
import Divider from "@/components/_other/divider/Divider";
import {useTranslation} from "@/app/i18n/client";

const OMIT_ERROR_FIELDS = [
  'deliveryType',
];

const CartSummary = ({webInstance, contactFormRef, deliveryStartFrom}) => {
  const {t} = useTranslation();

  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState(false);
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {cart, createOrder, removeContact, cartDestroy, isLoading} = useCart();

  const settings = get(webInstance, 'globalSettings');

  const handleSubmit = async e => {
    e.preventDefault();

    if (contactFormRef.current) {
      if (contactFormRef?.current) {
        Object.keys(contactFormRef.current.values).forEach(key => {
          contactFormRef.current.setFieldTouched(key);
        });

        await contactFormRef.current.validateForm();

        if (!contactFormRef.current.isValid) {
          return;
        }
      }
    }

    if (contactFormRef.current) {
      await contactFormRef.current.handleSubmit();
    }

    setErrors({});
    const errors = {};

    if (!termsAndConditionsAccepted) {
      errors.termsAndConditions = t('cart_summary.privacy_policy.required_validation');
    }

    if (!isEmpty(errors)) {
      setErrors(errors);
      return;
    }

    setIsSubmitting(true);

    let params = {
      DELIVERY_START_FROM: deliveryStartFrom,
    };

    const intervalType = settings?.recurring_orders_subscription_interval_type;
    const intervalValue = settings?.recurring_orders_subscription_interval_value;

    const orderDeliveryAt = deliveryStartFrom && intervalType && intervalValue
      ? dayjs(deliveryStartFrom).add(intervalValue, intervalType).startOf('day').format('YYYY-MM-DD')
      : null;

    const values = {
      ...{params: params},
      privacyPolicy: false,
      termsAndConditions: termsAndConditionsAccepted,
      deliveryAt: orderDeliveryAt
    };

    await createOrder(values, response => {
      response
        .then(async order => {
          if (!isEmpty(order) && get(order, 'accessToken')) {
            try {
              await Promise.all([
                removeContact(),
                cartDestroy(),
              ]);
            } catch (err) {
              console.error(err);
            }

            const paymentUrl = get(order, 'paymentUrl');
            if (paymentUrl) {
              window.location.replace(paymentUrl);
            } else {
              window.location.replace(
                `/objednavka/dakujeme?orderToken=${get(
                  order,
                  'accessToken',
                )}`,
              );
            }
          } else if (order?.messages) {
            const orderErrors = {};
            forEach(get(order, 'messages', []), (error, key) => {
              if (includes(OMIT_ERROR_FIELDS, error?.field)) {
                return;
              }

              if (error?.field) {
                orderErrors[error?.field] = error?.message;
              } else {
                orderErrors[key] = error?.message;
              }
            });
            setErrors(orderErrors);
            setIsSubmitting(false);
          }
        })
        .catch(error => {
          setIsSubmitting(false);
        });
    });
  };

  return (
    <>
      <Box>
        <h3>{t('cart_summary.title')}</h3>

        <CartSummaryItems cart={cart}/>

        <Divider />

        <CheckboxInput
          label={t('cart_summary.marketing_agreement.label')}
          error={errors?.marketingAgreement}
          inputProps={{
            id: 'marketingAgreement',
            name: 'marketingAgreement',
            onChange: e => {
              setMarketingAgreement(e.target.checked);
            },
            value: 1,
            checked: marketingAgreement,
          }}
        />

        <CheckboxInput
          label={
            <>
              {t('cart_summary.terms_and_conditions.label')} (
              <Link
                className="underline"
                href={get(
                  settings,
                  'terms_and_conditions_link',
                  '#',
                )}
                target='_blank'
                passHref
              >
                {t('cart_summary.terms_and_conditions.read_more')}
              </Link>)
            </>
          }
          error={errors?.termsAndConditions}
          inputProps={{
            id: 'termsAndConditions',
            name: 'termsAndConditions',
            onChange: e => {
              setTermsAndConditionsAccepted(e.target.checked);
            },
            value: 1,
            checked: termsAndConditionsAccepted,
            groupClassName: 'indent-label',
          }}
        />
      </Box>

      {!isEmpty(errors) ? (
        <>
          {map(errors, (error, index) => (
            <Alert
              key={`order-error-${index}`}
              message={error}
              className='mt-2'
            />
          ))}
        </>
      ) : null}

      <div className={'mt-4 text-center'}>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting || isLoading}
        >
          <span>{t('cart_summary.pay_btn')}</span>
        </Button>
      </div>
    </>
  )
}

export default CartSummary;
