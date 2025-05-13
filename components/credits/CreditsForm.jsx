'use client';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
import styles from '@/modules/cart/components/credits/CreditsForm.module.scss';
import isEmpty from 'lodash/isEmpty';
import NumberInput from '@/components/_other/form/NumberInput';
import Button from '@/components/_other/button/Button';
import Alert from '@/components/_other/alert/Alert';
import { useState } from 'react';
import find from 'lodash/find';
import useWebInstance from '@/grandus-lib/hooks/useWebInstance';
import useStaticBlock from '@/grandus-lib/hooks/useStaticBlock';
import useCart from '@/grandus-lib/hooks/useCart';
import useUser from '@/grandus-lib/hooks/useUser';
import { useTranslation } from '@/app/i18n/client';

const Feedback = ({ touched, status, message }) => {
  if (touched && message && status) {
    return (
      <Alert type={status} message={message} className={styles?.feedback} />
    );
  }
  return null;
};

const CreditsForm = ({}) => {

  const { t } = useTranslation();

  const { user } = useUser();
  const { staticBlocks } = useStaticBlock();
  const { cart, mutateCart, isLoading, applyCredits } = useCart();
  const { webInstance, settings } = useWebInstance();

  const fieldName = 'credits';
  const cartCredit = get(cart, 'credit');
  const cartHasCredit = !isEmpty(cartCredit);

  const [touched, setTouched] = useState(cartHasCredit);
  const [value, setValue] = useState(cartCredit);
  const [message, setMessage] = useState();
  const [validateStatus, setValidateStatus] = useState(
    cartHasCredit ? 'success' : '',
  );


  const cartCreditDescription = get(
    find(staticBlocks, ['hash', 'cart_credit_description']),
    'content',
    '',
  );


  const handleChange = async value => {
    setValue(value);
    setTouched(true);
  };

  const handleBlur = e => {
    setValue(e.target.value);
    setTouched(true);
    setMessage(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched(true);
    setMessage(null);
    setValidateStatus(null);

    if (toNumber(value) < 0) {
      setValidateStatus('danger');
      setMessage(t('credits_form.credits.min_value'));
    }

    const response = await applyCredits(value);
    if (response) {
      if (!get(response, 'status', true)) {
        setValidateStatus('danger');
      } else {
        setValidateStatus('success');
        mutateCart(get(response, 'data'), false);
      }
      setMessage(get(response, 'message', ''));
    }
  };

  return (
    <div className={styles?.creditsForm}>
      {!isEmpty(cartCreditDescription) ? (
        <div dangerouslySetInnerHTML={{ __html: cartCreditDescription }} />
      ) : (
        <div>
          {t('credits_form.description', {
              name: settings?.credits_name,
              value: settings?.credits_value,
              currency: webInstance?.currencySymbol,
            },
          )}
        </div>
      )}

      <Feedback
        touched={touched}
        status={validateStatus}
        message={message}
      />

      <form onSubmit={handleSubmit}>
        <NumberInput
          showButtons={false}
          inputProps={{
            id: fieldName,
            name: fieldName,
            value: value,
            placeholder: t('credits_form.credits.placeholder'),
            onChange: handleChange,
            onBlur: handleBlur,
            groupClassName: styles?.inputGroup,
            className: styles?.input,
            min: 0,
            max: get(user, 'credit', 0),
          }}
        />
        <span className="px-3">{t('credits_form.credits.from', { credits: user?.credit })}</span>
        <Button
          htmlType="submit"
          size="smallWithNormalText"
          type={value ? 'primary' : 'disabled'}
          // size="small"
          disabled={value <= 0 || isLoading}
          loading={isLoading}
        >
          {t('credits_form.submit.button')}
        </Button>
      </form>
    </div>
  );
};

export default CreditsForm;
