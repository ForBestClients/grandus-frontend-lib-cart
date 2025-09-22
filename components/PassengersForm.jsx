'use client';

import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

// LODASH
import isEmpty from 'lodash/isEmpty';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
import first from 'lodash/first';
import map from 'lodash/map';

import useWebInstance from 'grandus-lib/hooks/useWebInstance';
import useCart from 'grandus-lib/hooks/useCart';
import useUser from 'grandus-lib/hooks/useUser';

import {
  LETTERS_ONLY_REGEX,
  BUSINESS_ID_REGEX,
  VAT_ID_REGEX,
  VAT_NUMBER_REGEX,
  STREET_REGEX,
} from 'grandus-lib/constants/ValidatorConstants';
import { ZIP_REGEX, PHONE_NUMBER_REGEX, CART_STEPS, CART_PASSENGERS_REDIS_KEY } from 'constants/AppConstants';

import TextInput from '@/components/_other/form/TextInput';
import CheckboxInput from '@/components/_other/form/CheckboxInput';
import TownInput from '@/components/_other/form/TownInput';
import Button from '@/components/_other/button/Button';
import { useRouter } from 'next/navigation';
import Box from '@/components/_other/box/Box';
import { createPortal } from 'react-dom';
import TextAreaInput from '@/components/_other/form/TextAreaInput';
import { useTranslation } from '@/app/i18n/client';
import find from 'lodash/find';
import useStaticBlock from '@/grandus-lib/hooks/useStaticBlock';
import Select2Input from '@/components/_other/form/Select2Input';
import { BackButtonContent } from '@/modules/cart/components/CheckoutButton';
import { useCartStep } from '@/utils/cart';
import DateInput from '@/components/_other/form/DateInput';
import { merge } from 'lodash';
import dayjs from 'dayjs';

function SectionTitle({ children }) {
  return <h3 className="text-lg font-bold mt-6 mb-3">{children}</h3>;
}

const PassengersForm = ({ countries, towns, contactFormRef, contact = {}, passengersData = {} }) => {
  const { settings } = useWebInstance();
  const { cart, cartUpdate } = useCart();
  const router = useRouter();
  const { user, createUser } = useUser();
  const { t } = useTranslation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const getDefaultCountryValue = (attribute = 'countryId') => {
    let countryId = get(passengersData, attribute, null);
    if (!countryId) {
      countryId = get(user, ['attributes', attribute]);
    }
    if (!countryId) {
      countryId = get(settings, 'default_delivery_country');
    }
    if (!countryId) {
      countryId = get(first(countries), 'id');
    }

    return toNumber(countryId);
  };

  const cartContainsDigitalProduct = find(cart?.items, item => {
      const kindName = item?.product?.kind?.name;
      return kindName === 'digitalny produkt';
    },
  ) !== undefined;

  // === Schemas for per-product users ===
  const UserRowSchema = yup.object({
    sameAsContact: yup.bool().transform(v => !!toNumber(v)),
    name: yup.string().trim()
      .matches(LETTERS_ONLY_REGEX, {
        excludeEmptyString: true,
        message: t('contact_form.firstname.matches_validation'),
      })
      .min(2, t('contact_form.firstname.min_validation'))
      .required(t('contact_form.firstname.required_validation')),
    surname: yup.string().trim()
      .matches(LETTERS_ONLY_REGEX, { excludeEmptyString: true, message: t('contact_form.surname.matches_validation') })
      .min(2, t('contact_form.surname.min_validation'))
      .required(t('contact_form.surname.required_validation')),
    street: yup.string().trim()
      .matches(STREET_REGEX, { excludeEmptyString: true, message: t('contact_form.street.matches_validation') })
      .required(t('contact_form.street.required_validation')),
    city: yup.string().trim()
      .matches(LETTERS_ONLY_REGEX, { excludeEmptyString: true, message: t('contact_form.city.matches_validation') })
      .required(t('contact_form.city.required_validation')),
    zip: yup.string().trim()
      .required(t('contact_form.zip.required_validation'))
      .matches(ZIP_REGEX, t('contact_form.zip.matches_validation')),
    phone: yup.string().trim()
      .required(t('contact_form.phone.required_validation'))
      .matches(PHONE_NUMBER_REGEX, { excludeEmptyString: true, message: t('contact_form.phone.matches_validation') }),
    email: yup.string().trim()
      .email(t('contact_form.email.email_validation'))
      .required(t('contact_form.email.required_validation')),
    countryId: yup.number().nullable().required(t('contact_form.country.required_validation')),
    isCompany: yup.bool().transform(v => !!toNumber(v)),
    companyName: yup.string().nullable().trim().when('isCompany', {
      is: true, then: s => s.required(t('contact_form.company_name.required_validation')),
    }),
    ico: yup.string().nullable().when('isCompany', {
      is: true,
      then: s => s.trim()
        .required(t('contact_form.ico.required_validation'))
        .matches(BUSINESS_ID_REGEX, { excludeEmptyString: true, message: t('contact_form.ico.matches_validation') })
        .trim(),
    }),
    dic: yup.string().trim().nullable()
      .matches(VAT_ID_REGEX, { excludeEmptyString: true, message: t('contact_form.dic.matches_validation') }).trim(),
    icDPH: yup.string().trim().nullable()
      .matches(VAT_NUMBER_REGEX, {
        excludeEmptyString: true,
        message: t('contact_form.ic_dph.matches_validation'),
      }).trim(),
    params: yup.object({
      ID_NUMBER: yup.string().trim()
        .min(2, t('contact_form.id_number.min_validation'))
        .required(t('contact_form.global.required_validation')),
      ID_EXPIRATION_DATE: yup.date()
        .min(dayjs(), t('contact_form.global.date_min_validation'))
        .required(t('contact_form.global.required_validation')),
      // PASSPORT_NUMBER: yup.string().trim()
      //   .min(2, t('contact_form.passport_number.min_validation'))
      //   .required(t('contact_form.global.required_validation')),
      // PASSPORT_EXPIRATION_DATE: yup.date()
      //   .min(dayjs(), t('contact_form.global.date_min_validation'))
      //   .required(t('contact_form.global.required_validation')),
      INSTAGRAM_ACCOUNT: yup.string().trim(),
      BIRTH_DATE: yup.date()
        .max(dayjs(), t('contact_form.global.date_max_validation'))
        .required(t('contact_form.global.required_validation')),
      NAMEDAY_DATE: yup.string().trim(),
      ICE_CONTACT_NAME: yup.string().trim()
        .required(t('contact_form.global.required_validation')),
      ICE_CONTACT_PHONE: yup.string().trim()
        .required(t('contact_form.global.required_validation')),
      // JOB: yup.string().trim()
      //   .required(t('contact_form.global.required_validation')),
      TRIP_EXPECTATIONS: yup.string().trim()
        .required(t('contact_form.global.required_validation')),
    })
  });

  const CartItemSchema = yup.object({
    cartItemId: yup.mixed().required('Missing cartItem id'),
    name: yup.string().nullable(),
    userCount: yup.number().min(1, 'At least one user per product').required('Missing user count'),
    users: yup.array().of(UserRowSchema)
      .min(1, t('contact_form.users.min_validation') || 'At least one user per product')
      .test('len-equals-count', t('contact_form.users.min_validation') || 'Please fill all users for this product', function(arr) {
        const desired = Math.max(1, Number(this.parent?.userCount) || 1);
        return Array.isArray(arr) && arr.length === desired;
      }),
  });

  const initialProducts = cart?.items?.map(item => {
    const cartItemUsers = find(passengersData?.products, { cartItemId: item?.id })?.users || [];
    const product = {
      cartItemId: item.id,
      name: item?.product?.name,
      userCount: item?.count,
      users: Array.from({ length: item?.count }, (_, index) => {
        const isFirst = index === 0;
        return ({
          sameAsContact: isFirst,
          name: isFirst ? contact?.firstname : '',
          surname: isFirst ? contact?.surname : '',
          street: isFirst ? contact?.street : '',
          city: isFirst ? contact?.city : '',
          countryId: isFirst ? contact?.countryId : '',
          zip: isFirst ? contact?.zip : '',
          phone: isFirst ? contact?.phone : '',
          email: isFirst ? contact?.email : '',
          isCompany: isFirst ? contact?.isCompany : false,
          companyName: isFirst ? contact?.companyName : '',
          ico: isFirst ? contact?.ico : '',
          dic: isFirst ? contact?.dic : '',
          icDPH: isFirst ? contact?.icDPH : '',
          params: {
            ID_NUMBER: '',
            ID_EXPIRATION_DATE: '',
            // PASSPORT_NUMBER: '',
            // PASSPORT_EXPIRATION_DATE: '',
            INSTAGRAM_ACCOUNT: '',
            BIRTH_DATE: '',
            NAMEDAY_DATE: '',
            ICE_CONTACT_NAME: '',
            ICE_CONTACT_PHONE: '',
            // JOB: '',
            TRIP_EXPECTATIONS: ''
          }
        })}
      )
    }

    if (cartItemUsers.length > 0) {
      product.users = merge(product.users, cartItemUsers);
    }

    return product;
  });

  const formProps = {
    enableReinitialize: true,
    initialValues: {
      products: initialProducts,
    },
    validationSchema: yup.object({
      products: yup.array().of(CartItemSchema).notRequired(),
    }),
    onSubmit: async (values, { setSubmitting }) => {

      const passengersDataJson = { passengers: { ...passengersData, ...values }};

      await cartUpdate({ jsonData: passengersDataJson }, (cart) => {
        setSubmitting(false);
        setIsRedirecting(true);
        router.push(CART_STEPS[3]);
      });

      setSubmitting(false);
    },
  };

  return (
    <Formik {...formProps} innerRef={contactFormRef}>
      {formikProps => (
        <Form
          {...formikProps}
          towns={towns}
          countries={countries}
          user={user}
          isRedirecting={isRedirecting}
          emailExists={emailExists}
          setEmailExists={setEmailExists}
          isRegistrationRequired={cartContainsDigitalProduct}
        />
      )}
    </Formik>
  );
};

const Form = ({
  values,
  errors,
  touched,
  isSubmitting,
  isValid,
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  setFieldTouched,
  countries,
  towns,
  user = null,
  isRedirecting = false,
  emailExists,
  setEmailExists,
  innerRef,
  isRegistrationRequired,
}) => {
  const { t } = useTranslation();
  const { isLoading } = useCart();
  const step = useCartStep();
  const [buttonContainer, setButtonContainer] = useState(null);

  const { staticBlocks: onlineProductCartMessages } = useStaticBlock({ group: 'online_product_cart_messages' });
  const emailExistsLoginMessage = find(onlineProductCartMessages, { hash: 'ONLINE_PRODUCT_EMAIL_EXISTS_LOGIN' });
  const createAccountMessage = find(onlineProductCartMessages, { hash: 'ONLINE_PRODUCT_CREATE_ACCOUNT' });

  const isCompany = !!toNumber(values?.isCompany);

  useEffect(() => {
    setButtonContainer(document ? document.getElementById('contact_confirm') : null);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box className={'mb-8 !p-0'}>
            {/* === Products & Users (fixed counts per product) === */}
            {values?.products && values.products.length > 0 && (
              <div className="mb-8">
                {values.products.map((prod, pIdx) => (
                  <div key={prod?.id ?? pIdx} className="border border-alt rounded-2xl mb-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-4 bg-white py-4 px-6">
                      <div className="font-bold text-xl">
                        {prod?.name || `Product ${pIdx + 1}`}{' '}
                      </div>
                    </div>

                    {/* Users for this product (fixed count) */}
                    {prod.users?.map((u, uIdx) => {
                      const isCompanyForUser = !!toNumber(u?.isCompany);
                        const isSameAsContact = !!toNumber(u?.sameAsContact);
                      return (
                        <div key={uIdx} className="[&:not(:last-child)]:border-b border-b-alt b-8 [&:not(:last-child)]:mb-8 px-6 pb-4">
                          <SectionTitle>
                            {u?.name || u?.surname
                              ? `${[u?.name, u?.surname].filter(Boolean).join(' ')}`
                              : `${t('contact_form.user.title') || 'User'} ${uIdx + 1}`
                            }
                          </SectionTitle>

                          <Box className="!p-0">
                            <div className={'grid grid-cols-2 gap-4 mt-4'}>
                              {uIdx === 0 && (
                                <div className={'col-span-2'}>
                                  <CheckboxInput
                                    required
                                    label={t('contact_form.same_as_contact.label')}
                                    error={
                                      get(touched, ['products', pIdx, 'users', uIdx, 'sameAsContact']) &&
                                      get(errors, ['products', pIdx, 'users', uIdx, 'sameAsContact'])
                                        ? get(errors, ['products', pIdx, 'users', uIdx, 'sameAsContact'])
                                        : ''
                                    }
                                    inputProps={{
                                      id: `products.${pIdx}.users.${uIdx}.sameAsContact`,
                                      name: `products.${pIdx}.users.${uIdx}.sameAsContact`,
                                      onChange: handleChange,
                                      onBlur: handleBlur,
                                      checked: u?.sameAsContact
                                    }}
                                  />
                                </div>
                              )}
                              <div className={'col-span-2 md:col-span-1'}>
                                <TextInput
                                  required
                                  label={t('contact_form.firstname.label')}
                                  error={
                                    get(touched, ['products', pIdx, 'users', uIdx, 'name']) &&
                                    get(errors, ['products', pIdx, 'users', uIdx, 'name'])
                                      ? get(errors, ['products', pIdx, 'users', uIdx, 'name'])
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.name`,
                                    name: `products.${pIdx}.users.${uIdx}.name`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.name,
                                    autoComplete: 'given-name',
                                    placeholder: t('contact_form.firstname.placeholder'),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                />
                              </div>

                              <div className={'col-span-2 md:col-span-1'}>
                                <TextInput
                                  required
                                  label={t('contact_form.surname.label')}
                                  error={
                                    get(touched, ['products', pIdx, 'users', uIdx, 'surname']) &&
                                    get(errors, ['products', pIdx, 'users', uIdx, 'surname'])
                                      ? get(errors, ['products', pIdx, 'users', uIdx, 'surname'])
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.surname`,
                                    name: `products.${pIdx}.users.${uIdx}.surname`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.surname,
                                    autoComplete: 'family-name',
                                    placeholder: t('contact_form.surname.placeholder'),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                />
                              </div>

                              <div className={'col col-span-2 md:col-span-1'}>
                                <TextInput
                                  required
                                  label={t('contact_form.phone.label')}
                                  hint={t('contact_form.phone.hint')}
                                  error={
                                    get(touched, ['products', pIdx, 'users', uIdx, 'phone']) &&
                                    get(errors, ['products', pIdx, 'users', uIdx, 'phone'])
                                      ? get(errors, ['products', pIdx, 'users', uIdx, 'phone'])
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.phone`,
                                    name: `products.${pIdx}.users.${uIdx}.phone`,
                                    type: 'tel',
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.phone,
                                    autoComplete: 'tel',
                                    placeholder: t('contact_form.phone.placeholder'),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                  setFieldTouched={setFieldTouched}
                                  setFieldValue={setFieldValue}
                                />
                              </div>

                              <div className={'col col-span-2 md:col-span-1'}>
                                <TextInput
                                  required
                                  label={t('contact_form.email.label')}
                                  error={
                                    get(touched, ['products', pIdx, 'users', uIdx, 'email']) &&
                                    get(errors, ['products', pIdx, 'users', uIdx, 'email'])
                                      ? get(errors, ['products', pIdx, 'users', uIdx, 'email'])
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.email`,
                                    name: `products.${pIdx}.users.${uIdx}.email`,
                                    type: 'mail',
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.email,
                                    autoComplete: 'tel',
                                    placeholder: t('contact_form.email.placeholder'),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                  setFieldTouched={setFieldTouched}
                                  setFieldValue={setFieldValue}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-4 pb-4">
                              <div className="col col-span-4 md:col-span-3">
                                <TownInput
                                  required
                                  label={t('contact_form.city.label')}
                                  error={
                                    get(touched, ['products', pIdx, 'users', uIdx, 'city']) &&
                                    get(errors, ['products', pIdx, 'users', uIdx, 'city'])
                                      ? get(errors, ['products', pIdx, 'users', uIdx, 'city'])
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.city`,
                                    name: `products.${pIdx}.users.${uIdx}.city`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.city,
                                    autoComplete: 'address-level2',
                                    placeholder: t('contact_form.city.placeholder'),
                                    options: map(towns, option => {
                                      return { value: option?.id, label: option?.name };
                                    }),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                />
                              </div>

                              <div className="col col-span-4 md:col-span-1">
                                <TextInput
                                  required
                                  label={t('contact_form.zip.label')}
                                  error={
                                    get(touched, ['products', pIdx, 'users', uIdx, 'zip']) &&
                                    get(errors, ['products', pIdx, 'users', uIdx, 'zip'])
                                      ? get(errors, ['products', pIdx, 'users', uIdx, 'zip'])
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.zip`,
                                    name: `products.${pIdx}.users.${uIdx}.zip`,
                                    type: 'text',
                                    pattern: '[0-9]*',
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.zip,
                                    autoComplete: 'postal-code',
                                    placeholder: t('contact_form.zip.placeholder'),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                />
                              </div>

                              <div className="col col-span-4">
                                <TextInput
                                  required
                                  label={t('contact_form.street.label')}
                                  error={
                                    get(touched, ['products', pIdx, 'users', uIdx, 'street']) &&
                                    get(errors, ['products', pIdx, 'users', uIdx, 'street'])
                                      ? get(errors, ['products', pIdx, 'users', uIdx, 'street'])
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.street`,
                                    name: `products.${pIdx}.users.${uIdx}.street`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.street,
                                    autoComplete: 'address-line1',
                                    placeholder: t('contact_form.street.placeholder'),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                />
                              </div>

                              <div className="col col-span-4">
                                <Select2Input
                                  label={t('contact_form.country.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.countryId`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.countryId`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.countryId`)
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.countryId`,
                                    name: `products.${pIdx}.users.${uIdx}.countryId`,
                                    value: u?.countryId,
                                    onChange: selectedValue => {
                                      setFieldValue(`products.${pIdx}.users.${uIdx}.countryId`, selectedValue?.value);
                                      setFieldTouched(`products.${pIdx}.users.${uIdx}.countryId`);
                                    },
                                    onBlur: handleBlur,
                                    autoComplete: 'country',
                                    options: map(countries, country => {
                                      return { value: country?.id, label: country?.name };
                                    }),
                                    placeholder: t('contact_form.country.placeholder'),
                                    disabled: isSameAsContact,
                                    readonly: isSameAsContact
                                  }}
                                />
                              </div>
                            </div>

                            <div className="mt-3 pl-2 md:pl-2">
                              <CheckboxInput
                                label={t('contact_form.company.label')}
                                error={
                                  get(touched, ['products', pIdx, 'users', uIdx, 'isCompany']) &&
                                  get(errors, ['products', pIdx, 'users', uIdx, 'isCompany'])
                                    ? get(errors, ['products', pIdx, 'users', uIdx, 'isCompany'])
                                    : ''
                                }
                                inputProps={{
                                  id: `products.${pIdx}.users.${uIdx}.isCompany`,
                                  name: `products.${pIdx}.users.${uIdx}.isCompany`,
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  value: 1,
                                  checked: isCompanyForUser,
                                  disabled: isSameAsContact,
                                  readonly: isSameAsContact
                                }}
                              />
                            </div>

                            <section className={`${!isCompanyForUser ? 'hidden' : 'block'}`}>
                              <h4 className="text-lg ms-1.5 font-bold mt-6 mb-3">
                                {t('contact_form.company.title')}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
                                <div className="col">
                                  <TextInput
                                    required
                                    label={t('contact_form.company_name.label')}
                                    error={
                                      get(touched, ['products', pIdx, 'users', uIdx, 'companyName']) &&
                                      get(errors, ['products', pIdx, 'users', uIdx, 'companyName'])
                                        ? get(errors, ['products', pIdx, 'users', uIdx, 'companyName'])
                                        : ''
                                    }
                                    inputProps={{
                                      id: `products.${pIdx}.users.${uIdx}.companyName`,
                                      name: `products.${pIdx}.users.${uIdx}.companyName`,
                                      onChange: handleChange,
                                      onBlur: handleBlur,
                                      value: u?.companyName,
                                      autoComplete: 'organization',
                                      placeholder: t('contact_form.company_name.placeholder'),
                                      disabled: isSameAsContact,
                                      readonly: isSameAsContact
                                    }}
                                  />
                                </div>
                                <div className="col">
                                  <TextInput
                                    required
                                    label={t('contact_form.ico.label')}
                                    error={
                                      get(touched, ['products', pIdx, 'users', uIdx, 'ico']) &&
                                      get(errors, ['products', pIdx, 'users', uIdx, 'ico'])
                                        ? get(errors, ['products', pIdx, 'users', uIdx, 'ico'])
                                        : ''
                                    }
                                    inputProps={{
                                      id: `products.${pIdx}.users.${uIdx}.ico`,
                                      name: `products.${pIdx}.users.${uIdx}.ico`,
                                      onChange: handleChange,
                                      value: u?.ico,
                                      placeholder: t('contact_form.ico.placeholder'),
                                      disabled: isSameAsContact,
                                      readonly: isSameAsContact
                                    }}
                                  />
                                </div>
                                <div className="col">
                                  <TextInput
                                    label={t('contact_form.dic.label')}
                                    error={
                                      get(touched, ['products', pIdx, 'users', uIdx, 'dic']) &&
                                      get(errors, ['products', pIdx, 'users', uIdx, 'dic'])
                                        ? get(errors, ['products', pIdx, 'users', uIdx, 'dic'])
                                        : ''
                                    }
                                    inputProps={{
                                      id: `products.${pIdx}.users.${uIdx}.dic`,
                                      name: `products.${pIdx}.users.${uIdx}.dic`,
                                      onChange: handleChange,
                                      value: u?.dic,
                                      placeholder: t('contact_form.dic.placeholder'),
                                      disabled: isSameAsContact,
                                      readonly: isSameAsContact
                                    }}
                                  />
                                </div>
                                <div className="col">
                                  <TextInput
                                    label={t('contact_form.ic_dph.label')}
                                    error={
                                      get(touched, ['products', pIdx, 'users', uIdx, 'icDPH']) &&
                                      get(errors, ['products', pIdx, 'users', uIdx, 'icDPH'])
                                        ? get(errors, ['products', pIdx, 'users', uIdx, 'icDPH'])
                                        : ''
                                    }
                                    inputProps={{
                                      id: `products.${pIdx}.users.${uIdx}.icDPH`,
                                      name: `products.${pIdx}.users.${uIdx}.icDPH`,
                                      onChange: handleChange,
                                      value: u?.icDPH,
                                      placeholder: t('contact_form.ic_dph.placeholder'),
                                      disabled: isSameAsContact,
                                      readonly: isSameAsContact
                                    }}
                                  />
                                </div>
                              </div>
                            </section>

                            <div className={'grid grid-cols-2 gap-4 mt-4'}>
                              <div className={'col-span-2 md:col-span-1'}>
                                <TextInput
                                  required
                                  label={t('contact_form.id_number.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.ID_NUMBER`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.ID_NUMBER`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.ID_NUMBER`)
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.ID_NUMBER`,
                                    name: `products.${pIdx}.users.${uIdx}.params.ID_NUMBER`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.params?.ID_NUMBER,
                                    placeholder: t('contact_form.id_number.placeholder'),
                                  }}
                                />
                              </div>
                              <div className={'col-span-2 md:col-span-1'}>
                                <DateInput
                                  required
                                  label={t('contact_form.id_expiration_date.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.ID_EXPIRATION_DATE`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.ID_EXPIRATION_DATE`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.ID_EXPIRATION_DATE`)
                                      : ''
                                  }
                                  withHeader={true}
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.ID_EXPIRATION_DATE`,
                                    name: `products.${pIdx}.users.${uIdx}.params.ID_EXPIRATION_DATE`,
                                    value: u?.params?.ID_EXPIRATION_DATE,
                                    placeholder: t('contact_form.id_expiration_date.placeholder'),
                                    minDate: new Date(),
                                    maxDate: null,
                                  }}
                                />
                              </div>

                              {/*<div className={'col-span-2 md:col-span-1'}>*/}
                              {/*  <TextInput*/}
                              {/*    required*/}
                              {/*    label={t('contact_form.passport_number.label')}*/}
                              {/*    error={*/}
                              {/*      get(touched, `products.${pIdx}.users.${uIdx}.params.PASSPORT_NUMBER`) &&*/}
                              {/*      get(errors, `products.${pIdx}.users.${uIdx}.params.PASSPORT_NUMBER`)*/}
                              {/*        ? get(errors, `products.${pIdx}.users.${uIdx}.params.PASSPORT_NUMBER`)*/}
                              {/*        : ''*/}
                              {/*    }*/}
                              {/*    inputProps={{*/}
                              {/*      id: `products.${pIdx}.users.${uIdx}.params.PASSPORT_NUMBER`,*/}
                              {/*      name: `products.${pIdx}.users.${uIdx}.params.PASSPORT_NUMBER`,*/}
                              {/*      onChange: handleChange,*/}
                              {/*      onBlur: handleBlur,*/}
                              {/*      value: u?.params?.PASSPORT_NUMBER,*/}
                              {/*      placeholder: t('contact_form.passport_number.placeholder'),*/}
                              {/*    }}*/}
                              {/*  />*/}
                              {/*</div>*/}
                              {/*<div className={'col-span-2 md:col-span-1'}>*/}
                              {/*  <DateInput*/}
                              {/*    required*/}
                              {/*    label={t('contact_form.passport_expiration_date.label')}*/}
                              {/*    error={*/}
                              {/*      get(touched, `products.${pIdx}.users.${uIdx}.params.PASSPORT_EXPIRATION_DATE`) &&*/}
                              {/*      get(errors, `products.${pIdx}.users.${uIdx}.params.PASSPORT_EXPIRATION_DATE`)*/}
                              {/*        ? get(errors, `products.${pIdx}.users.${uIdx}.params.PASSPORT_EXPIRATION_DATE`)*/}
                              {/*        : ''*/}
                              {/*    }*/}
                              {/*    withHeader={true}*/}
                              {/*    inputProps={{*/}
                              {/*      id: `products.${pIdx}.users.${uIdx}.params.PASSPORT_EXPIRATION_DATE`,*/}
                              {/*      name: `products.${pIdx}.users.${uIdx}.params.PASSPORT_EXPIRATION_DATE`,*/}
                              {/*      value: u?.params?.PASSPORT_EXPIRATION_DATE,*/}
                              {/*      placeholder: t('contact_form.passport_expiration_date.placeholder'),*/}
                              {/*      minDate: new Date(),*/}
                              {/*      maxDate: null,*/}
                              {/*    }}*/}
                              {/*  />*/}
                              {/*</div>*/}

                              <div className={'col-span-2 md:col-span-1'}>
                                <DateInput
                                  required
                                  label={t('contact_form.birth_date.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.BIRTH_DATE`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.BIRTH_DATE`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.BIRTH_DATE`)
                                      : ''
                                  }
                                  withHeader={true}
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.BIRTH_DATE`,
                                    name: `products.${pIdx}.users.${uIdx}.params.BIRTH_DATE`,
                                    value: u?.params?.BIRTH_DATE,
                                    placeholder: t('contact_form.birth_date.placeholder'),
                                    minDate: null,
                                    maxDate: new Date(),
                                  }}
                                />
                              </div>
                              <div className={'col-span-2 md:col-span-1'}>
                                <TextInput
                                  label={t('contact_form.nameday_date.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.NAMEDAY_DATE`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.NAMEDAY_DATE`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.NAMEDAY_DATE`)
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.NAMEDAY_DATE`,
                                    name: `products.${pIdx}.users.${uIdx}.params.NAMEDAY_DATE`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.params?.NAMEDAY_DATE,
                                    placeholder: t('contact_form.nameday_date.placeholder'),
                                  }}
                                />
                              </div>
                              <div className={'col-span-2'}>
                                <TextInput
                                  label={t('contact_form.instagram_account.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.INSTAGRAM_ACCOUNT`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.INSTAGRAM_ACCOUNT`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.INSTAGRAM_ACCOUNT`)
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.INSTAGRAM_ACCOUNT`,
                                    name: `products.${pIdx}.users.${uIdx}.params.INSTAGRAM_ACCOUNT`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.params?.INSTAGRAM_ACCOUNT,
                                    placeholder: t('contact_form.instagram_account.placeholder'),
                                  }}
                                />
                              </div>
                              <div className={'col-span-2 md:col-span-1'}>
                                <TextInput
                                  required
                                  label={t('contact_form.ice_contact_name.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_NAME`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_NAME`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_NAME`)
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_NAME`,
                                    name: `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_NAME`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.params?.ICE_CONTACT_NAME,
                                    placeholder: t('contact_form.ice_contact_name.placeholder'),
                                  }}
                                />
                              </div>
                              <div className={'col-span-2 md:col-span-1'}>
                                <TextInput
                                  required
                                  label={t('contact_form.ice_contact_phone.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_PHONE`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_PHONE`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_PHONE`)
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_PHONE`,
                                    name: `products.${pIdx}.users.${uIdx}.params.ICE_CONTACT_PHONE`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.params?.ICE_CONTACT_PHONE,
                                    placeholder: t('contact_form.ice_contact_phone.placeholder'),
                                  }}
                                />
                              </div>
                              {/*<div className={'col-span-2'}>*/}
                              {/*  <TextInput*/}
                              {/*    required*/}
                              {/*    label={t('contact_form.job.label')}*/}
                              {/*    error={*/}
                              {/*      get(touched, `products.${pIdx}.users.${uIdx}.params.JOB`) &&*/}
                              {/*      get(errors, `products.${pIdx}.users.${uIdx}.params.JOB`)*/}
                              {/*        ? get(errors, `products.${pIdx}.users.${uIdx}.params.JOB`)*/}
                              {/*        : ''*/}
                              {/*    }*/}
                              {/*    inputProps={{*/}
                              {/*      id: `products.${pIdx}.users.${uIdx}.params.JOB`,*/}
                              {/*      name: `products.${pIdx}.users.${uIdx}.params.JOB`,*/}
                              {/*      onChange: handleChange,*/}
                              {/*      onBlur: handleBlur,*/}
                              {/*      value: u?.params?.JOB,*/}
                              {/*      placeholder: t('contact_form.job.placeholder'),*/}
                              {/*    }}*/}
                              {/*  />*/}
                              {/*</div>*/}
                              <div className={'col-span-2'}>
                                <TextAreaInput
                                  required
                                  label={t('contact_form.trip_expectations.label')}
                                  error={
                                    get(touched, `products.${pIdx}.users.${uIdx}.params.TRIP_EXPECTATIONS`) &&
                                    get(errors, `products.${pIdx}.users.${uIdx}.params.TRIP_EXPECTATIONS`)
                                      ? get(errors, `products.${pIdx}.users.${uIdx}.params.TRIP_EXPECTATIONS`)
                                      : ''
                                  }
                                  inputProps={{
                                    id: `products.${pIdx}.users.${uIdx}.params.TRIP_EXPECTATIONS`,
                                    name: `products.${pIdx}.users.${uIdx}.params.TRIP_EXPECTATIONS`,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    value: u?.params?.TRIP_EXPECTATIONS,
                                    placeholder: t('contact_form.trip_expectations.placeholder'),
                                  }}
                                />
                              </div>
                            </div>
                          </Box>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
        </Box>
        {buttonContainer ? createPortal(
          <>
            <Button
              loading={isLoading || isSubmitting}
              htmlType={'submit'}
              type={'primary'}
              fullWidth
              onClick={() => handleSubmit()}
              round
            >
              <span>{t('cart_title.step3.button')} </span>
            </Button>
            <Button
              type="link"
              fullWidth
              htmlType={'a'}
              href={CART_STEPS[step - 1]}
              loading={isLoading}
              prefetch
              className="mt-3"
              round
            >
              <BackButtonContent step={step} />
            </Button>
          </>,
          buttonContainer,
        ) : ''}

      </form>
    </>
  );
};

export default PassengersForm;
