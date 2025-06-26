'use client';

import useStaticBlock from '@/grandus-lib/hooks/useStaticBlock';
import find from 'lodash/find';
import Box from '@/components/_other/box/Box';
import * as yup from 'yup';
import toNumber from 'lodash/toNumber';
import { Form, Formik } from 'formik';
import CheckboxInput from '@/components/_other/form/CheckboxInput';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/_other/button/Button';
import { CART_ITEM_TYPE_VIRTUAL, CART_STEPS } from '@/constants/AppConstants';
import useCart from '@/grandus-lib/hooks/useCart';
import { useTranslation } from '@/app/i18n/client';
import { useCartStep } from '@/utils/cart';
import { useRouter } from 'next/navigation';
import { formatter } from '@/utils/price';

const INSURANCE_VAT = 23;

const InsuranceForm = ({ textBlock, priceBlock, titleBlock }) => {
  const [buttonContainer, setButtonContainer] = useState(null);
  const { cart, isLoading, itemsAdd, itemRemove } = useCart();
  const { t } = useTranslation();
  const step = useCartStep();
  const router = useRouter();

  const cartItem = find(cart?.items, [
    'parameters.externalId',
    'cart_insurance',
  ]);

  useEffect(() => {
    setButtonContainer(
      document ? document.getElementById('contact_confirm') : null,
    );
  }, []);

  const formProps = {
    enableReinitialize: true,
    initialValues: {
      insuranceActive: !!cartItem,
    },
    validationSchema: yup.object({
      insuranceActive: yup.bool().transform(v => !!toNumber(v)), //convert to boolean before validation
    }),
    onSubmit: async values => {
      console.log(values, cartItem);

      if (values?.insuranceActive) {
        if (!cartItem) {
          const virtualItem = {
            productId: null,
            sizeId: null,
            count: 1,
            externalId: 'cart_insurance',
            type: CART_ITEM_TYPE_VIRTUAL,
            parameters: {
              type: CART_ITEM_TYPE_VIRTUAL,
              name: titleBlock?.perex ?? 'Cart Insurance',
              externalId: 'cart_insurance',
              externalProductId: 'cart_insurance',
              price: toNumber(priceBlock?.perex ?? 0),
              productId: 'cart_insurance',
              vat: INSURANCE_VAT,
              virtualProductType: 'virtual',
              group: 'cart_insurance',
            },
          };

          await itemsAdd([virtualItem]);
        }
      } else {
        console.log('aaaaa', cartItem);
        if (cartItem) {
          await itemRemove(cartItem.id);
        }
      }

      router.push(CART_STEPS[step + 1]);
    },
  };

  return (
    <Formik {...formProps}>
      {({
        handleSubmit,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit} className={'text-sm'}>
          <>
            <CheckboxInput
              label={textBlock.perex}
              error={
                touched.insuranceActive && errors.insuranceActive
                  ? errors.insuranceActive
                  : ''
              }
              inputProps={{
                id: 'insuranceActive',
                name: 'insuranceActive',
                onChange: handleChange,
                onBlur: handleBlur,
                value: 1,
                checked: values?.insuranceActive,
                inputClassName: 'text-sm',
              }}
            />

            {buttonContainer
              ? createPortal(
                  <>
                    <Button
                      loading={isLoading || isSubmitting}
                      htmlType={'submit'}
                      type={'primary'}
                      fullWidth
                      onClick={() => handleSubmit()}
                      round
                    >
                      <span>{t('cart_title.step1.button')} </span>
                    </Button>
                  </>,
                  buttonContainer,
                )
              : ''}
          </>
        </Form>
      )}
    </Formik>
  );
};

const Insurance = ({}) => {
  const { staticBlocks } = useStaticBlock({ group: 'cart_insurance' });

  const titleBlock = find(staticBlocks, ['hash', 'cart_insurance_title']);
  const priceBlock = find(staticBlocks, ['hash', 'cart_insurance_price']);
  const textBlock = find(staticBlocks, ['hash', 'cart_insurance_text']);

  if (!titleBlock || !priceBlock || !textBlock) {
    return '';
  }

  return (
    <Box className="">
      <div className={'text-primary font-normal mb-4'}>
        {titleBlock.perex} ({formatter.format(priceBlock?.perex)})
      </div>
      <div>
        <InsuranceForm
          priceBlock={priceBlock}
          textBlock={textBlock}
          titleBlock={titleBlock}
        />
      </div>
    </Box>
  );
};

export default Insurance;
