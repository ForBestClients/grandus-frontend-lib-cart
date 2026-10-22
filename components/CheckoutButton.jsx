'use client';
import Button from '@/components/_other/button/Button';
import useCart from '@/grandus-lib/hooks/useCart';
import { CART_STEPS } from '@/constants/AppConstants';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import { useState } from 'react';
import CheckboxInput from '@/components/_other/form/CheckboxInput';
import Link from 'next/link';
import useWebInstance from '@/grandus-lib/hooks/useWebInstance';
import { useTranslation } from '@/app/i18n/client';
import { getValidationScheme } from '@/grandus-lib/components/v2/delivery/provider';
import * as yup from 'yup';
import find from 'lodash/find';
import map from 'lodash/map';
import Alert from '@/components/_other/alert/Alert';
import toNumber from 'lodash/toNumber';
import omit from 'lodash/omit';
import { useCheckoutSelection } from '@/modules/cart/components/delivery/CheckoutSelection';

import { trackCheckoutSteps } from '@/utils/tracking';

const ButtonContent = ({ step }) => {
  const { t } = useTranslation();
  let buttonText = '';
  switch (step) {
    case 0:
      buttonText = t('cart_title.step1.button');
      break;
    case 1:
      buttonText = t('cart_title.step2.button');
      break;
    case 2:
      buttonText = t('cart_title.step3.button');
      break;
  }

  return <span>{buttonText}</span>
};

export const BackButtonContent = ({ step }) => {
  const { t } = useTranslation();
  switch (step) {
    case 1:
      return t('cart_title.step2.back_button');
    case 2:
      return t('cart_title.step3.back_button');
    default:
      return '';
  }
};

const OrderButton = ({ setIsProcessing, contact }) => {
  const { cart, createOrder, removeContact, cartDestroy, isLoading } = useCart();
  const { t } = useTranslation();
  const selection = useCheckoutSelection()?.selection;

  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  const [errors, setErrors] = useState({});

  const { webInstance } = useWebInstance();
  const settings = get(webInstance, 'globalSettings');
  const requirePrivacyPolicyAgreement = toNumber(get(settings, 'require_consent_for_processing_personal_data'));

  const providerSchema = getValidationScheme(find(cart?.deliveryOptions, { id: cart?.delivery?.id })?.serviceProviderType);
  const schemaFields = {
    termsAndConditions: yup
      .bool()
      .required()
      .isTrue(t('cart_summary.terms_and_conditions.required_validation')),
    ...(providerSchema !== null ? providerSchema.fields : {}),
  };

  if (requirePrivacyPolicyAgreement) {
    schemaFields.privacyPolicy = yup
      .bool()
      .required()
      .isTrue(t('cart_summary.privacy_policy.required_validation'));
  }

  const schema = yup.object().shape(schemaFields);

  // the order takes the delivery and payment saved in the cart: wait until the
  // options picked in the form are chosen and saved
  const savedDeliveryId = cart?.delivery?.id ?? null;
  const savedPaymentId = cart?.payment?.id ?? null;
  const deliveryId = selection ? selection.deliveryId : savedDeliveryId;
  const paymentId = selection ? selection.paymentId : savedPaymentId;
  const isSaving = Boolean(selection?.isSaving);
  let missingChoice = null;
  if (!deliveryId) {
    missingChoice = t('cart_summary.order_hint.delivery');
  } else if (!paymentId) {
    missingChoice = t('cart_summary.order_hint.payment');
  }
  const isOrderBlocked =
    isSaving ||
    Boolean(missingChoice) ||
    deliveryId !== savedDeliveryId ||
    paymentId !== savedPaymentId;

  const handleSubmit = async e => {
    e.preventDefault();

    if (isOrderBlocked) {
      return;
    }

    const params = {};

    const values = {
      ...{ params: params },
      privacyPolicy: privacyPolicyAccepted,
      termsAndConditions: termsAndConditionsAccepted,
      specificDeliveryType: cart?.specificDeliveryType ?? null,
    };

    schema.validate(values, { abortEarly: false })
      .then(async _ => {
        setIsProcessing(true);

        // GA4 add_shipping_info + add_payment_info, Meta AddPaymentInfo. The
        // purchase is tracked once on the thank-you page (OrderAnalytics).
        trackCheckoutSteps(cart);

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
                  return;
                } else {
                  window.location.replace(
                    `/objednavka/dakujeme?orderToken=${get(
                      order,
                      'accessToken',
                    )}`,
                  );
                  return;
                }
              } else if (order?.messages) {
                const orderErrors = {};
                forEach(get(order, 'messages', []), (error, key) => {

                  if (error?.field) {
                    orderErrors[error?.field] = error?.message;
                  } else {
                    orderErrors[key] = error?.message;
                  }
                });
                setErrors(orderErrors);
              }

              setIsProcessing(false);
            })
            .catch(error => {
              setIsProcessing(false);
            });
        });
      }).catch(e => {
      let err = {};

      e.inner.forEach((error) => {
        err[error.path] = error.message;
      });

      setErrors(err);
    });
  };
  // consent errors are shown inline under their checkbox; the rest (pickup
  // point, API messages) has no field on screen, so it goes to an Alert
  const alertErrors = omit(errors, ['termsAndConditions', 'privacyPolicy']);

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        {requirePrivacyPolicyAgreement
          ? (
            <CheckboxInput
              label={
                <>
                  {t('cart_summary.privacy_policy.label')}
                  {get(settings, 'conditions_for_processing_personal_data_link')
                    ? <>
                      {' '} (
                      <Link
                        className="ac-link"
                        href={get(settings, 'conditions_for_processing_personal_data_link', '#')}
                        target="_blank"
                        passHref
                      >
                        {t('cart_summary.privacy_policy.read_more')}
                      </Link>)
                    </>
                    : null}
                </>
              }
              error={errors?.privacyPolicy}
              inputProps={{
                id: 'privacy_policy',
                name: 'privacy_policy',
                onChange: e => {
                  setPrivacyPolicyAccepted(e.target.checked);
                  setErrors(prev => omit(prev, ['privacyPolicy']));
                },
                value: 1,
                checked: privacyPolicyAccepted,
                groupClassName: 'indent-label',
              }}
            />
          )
          : null
        }

        <CheckboxInput
          label={
            <>
              {t('cart_summary.terms_and_conditions.label')}
              {get(settings, 'terms_and_conditions_link')
                ? <>
                  {' '} (<Link
                  className="ac-link"
                  href={get(
                    settings,
                    'terms_and_conditions_link',
                    '#',
                  )}
                  target="_blank"
                  passHref
                >
                  {t('cart_summary.terms_and_conditions.read_more')}
                </Link>)
                </>
                : null}
            </>
          }
          error={errors?.termsAndConditions}
          inputProps={{
            id: 'termsAndConditions',
            name: 'termsAndConditions',
            onChange: e => {
              setTermsAndConditionsAccepted(e.target.checked);
              setErrors(prev => omit(prev, ['termsAndConditions']));
            },
            value: 1,
            checked: termsAndConditionsAccepted,
            groupClassName: 'indent-label',
          }}
        />
      </div>

      {!isEmpty(alertErrors) ? (
        <div className={'mt-4 flex flex-col gap-2'}>
          {map(alertErrors, (error, field) => <Alert type="error" message={error} key={field} />)}
        </div>
      ) : null}

      <div className={'mt-5'}>
        {/* narrower padding and tracking on phones: the legally required
            wording stays on one line */}
        <Button
          fullWidth
          loading={isLoading || isSaving}
          disabled={isOrderBlocked}
          aria-describedby={missingChoice ? 'order-missing-choice' : undefined}
          onClick={handleSubmit}
          className="max-sm:!px-4 max-sm:!tracking-[0.08em]"
        >
          <ButtonContent step={2} />
        </Button>
        {missingChoice ? (
          <p
            id="order-missing-choice"
            role="status"
            className="mb-0 mt-2 text-center text-[13px] leading-snug text-ink-muted"
          >
            {missingChoice}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export const CheckoutButton = ({ step, setIsProcessing, contact }) => {
  const { t } = useTranslation();
  const { cart, isLoading } = useCart();

  if (step === 2) {
    return (
      <div className={'md:px-6'}>
        <OrderButton setIsProcessing={setIsProcessing} contact={contact} />
        <Button
          className="mt-3"
          type="link"
          fullWidth
          htmlType={'a'}
          href={CART_STEPS[step - 1]}
          loading={isLoading}
          prefetch
        >
          <BackButtonContent step={step} />
        </Button>
      </div>
    )
  }

  return (
    <div id={'contact_confirm'} className={'mt-4 text-center md:px-6'}>
      {step !== 1 ?
        <Button
          type="primary"
          fullWidth
          htmlType={'a'}
          href={CART_STEPS[step + 1]}
          loading={isLoading}
          prefetch
        >
          <ButtonContent step={step} />
        </Button> : ''}
      {step > 1 ?
        <Button
          type="link"
          fullWidth
          htmlType={'a'}
          href={CART_STEPS[step - 1]}
          loading={isLoading}
          prefetch
        >
          <BackButtonContent step={step} />
        </Button>
        : null}
    </div>
  );
};
