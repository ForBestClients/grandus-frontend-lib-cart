'use client';
import {useState} from 'react';
import * as yup from 'yup';
import {useFormikContext, Formik} from 'formik';
import useCart from 'grandus-lib/hooks/useCart';
import get from 'lodash/get';
import toNumber from 'lodash/toNumber';
import Button from 'components/_other/button/Button';
import TextInput from 'components/_other/form/TextInput';
import isEmpty from "lodash/isEmpty";
import Alert from "components/_other/alert/Alert";
import {useTranslation} from "@/app/i18n/client";

const Isic = () => {
  const {mutateCart, applyIsic} = useCart();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const {t} = useTranslation();
  const formProps = {
    enableReinitialize: true,
    initialValues: {
      code: '',
      surname: '',
    },
    validationSchema: yup.object({
      code: yup
        .string()
        .nullable()
        .trim()
        .max(30, t('isic.code.max_validation')),
      surname: yup.string().nullable().trim(),
    }),
    onSubmit: async (values, {setErrors}) => {
      const {code, surname} = values;

      try {
        setMessage('');
        setSuccess(false);
        const response = await applyIsic(surname, code);
        const success = toNumber(get(response, 'status', false));
        setMessage(get(response, 'message'));
        if (success) {
          await mutateCart(get(response, 'data'), false);
          setSuccess(true);
        }
      } catch (error) {
        console.error('An unexpected error happened:', error);
        setErrors(error.data.message);
      }

      return false;
    },
  };

  return (
    <>
      {!isEmpty(message) ? (
        <Alert
          type={success ? 'success' : 'danger'}
          message={message}
          className="mt-2"
        />
      ) : null}

      <Formik {...formProps}>
        <IsicForm/>
      </Formik>
    </>
  );
};

const IsicForm = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormikContext();
  const {t} = useTranslation();
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col lg:flex-row gap-4 mt-2 lg:items-end">
        <div className="lg:flex-grow">
          <TextInput
            required
            label={t('isic.code.label')}
            error={touched.code && errors.code ? errors.code : ''}
            inputProps={{
              id: 'code',
              name: 'code',
              onChange: handleChange,
              onBlur: handleBlur,
              value: values?.code,
              placeholder: t('isic.code.placeholder'),
            }}
          />
        </div>
        <div className="lg:flex-grow">
          <TextInput
            required
            label={t('isic.surname.label')}
            error={touched.surname && errors.surname ? errors.surname : ''}
            inputProps={{
              id: 'surname',
              name: 'surname',
              onChange: handleChange,
              onBlur: handleBlur,
              value: values?.surname,
              placeholder: t('isic.surname.placeholder'),
            }}
          />
        </div>
      </div>
      <Button
        size={"smallWithNormalText"}
        fullWidth
        disabled={!(values?.code && values?.surname)}
        htmlType="submit"
        loading={isSubmitting}
        className={'mb-2 md:mb-3'}
      >
        {t('isic.apply')}
      </Button>
    </form>
  );
};

export default Isic;
