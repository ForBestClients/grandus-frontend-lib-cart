'use client';

import { useEffect, useRef, useState } from 'react';
import {Formik} from 'formik';
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
import { ZIP_REGEX, PHONE_NUMBER_REGEX, CART_STEPS } from 'constants/AppConstants';

import TextInput from '@/components/_other/form/TextInput';
import CheckboxInput from '@/components/_other/form/CheckboxInput';
import TownInput from '@/components/_other/form/TownInput';
import Button from '@/components/_other/button/Button';
import { useRouter } from 'next/navigation';
import Box from "@/components/_other/box/Box";
import { createPortal } from 'react-dom';
import TextAreaInput from "@/components/_other/form/TextAreaInput";
import EmailChecker from "@/modules/cart/components/emailChecker/EmailChecker";
import LoggedUserInfo from "@/modules/cart/components/loggedUserInfo/LoggedUserInfo";
import {useTranslation} from "@/app/i18n/client";
import find from "lodash/find";
import useStaticBlock from "@/grandus-lib/hooks/useStaticBlock";
import Alert from "@/components/_other/alert/Alert";
import Select2Input from "@/components/_other/form/Select2Input";
import {BackButtonContent} from "@/modules/cart/components/CheckoutButton";
import {useCartStep} from "@/utils/cart";

const ContactForm = ({ countries, towns, contact, contactFormRef }) => {
    const {settings} = useWebInstance();
    const {cart, saveContact, cartUpdate} = useCart();
    const router = useRouter()
    const {user, createUser} = useUser();
    const {t} = useTranslation();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [emailExists, setEmailExists] = useState(false);

    const getDefaultCountryValue = (attribute = 'countryId') => {
        let countryId = get(contact, attribute, null);
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
        return kindName === 'digitalny produkt' }
    ) !== undefined;

    const formProps = {
        enableReinitialize: true,
        initialValues: {
            firstname: contact?.firstname || user?.attributes?.name || '',
            surname: contact?.surname || user?.attributes?.surname || '',
            street: contact?.street || user?.attributes?.street || '',
            city: contact?.city || user?.attributes?.city || '',
            zip: contact?.zip || user?.attributes?.zip || '',
            phone: contact?.phone || user?.attributes?.phone || '',
            email: contact?.email || user?.attributes?.email || '',
            countryId: getDefaultCountryValue(),
            isCompany: contact?.isCompany || !!(contact?.ico || contact?.companyName) || !!(user?.attributes?.companyName || user?.attributes?.ico) || false,
            companyName: contact?.companyName || user?.attributes?.companyName || '',
            ico: contact?.ico || user?.attributes?.ico || '',
            dic: contact?.dic || user?.attributes?.dic || '',
            icDPH: contact?.icDPH || user?.attributes?.icDPH || '',
            createAccount: (isEmpty(user) && cartContainsDigitalProduct) || contact?.createAccount || false,
            registerPassword: contact?.registerPassword || '',
            registerPasswordConfirm: contact?.registerPasswordConfirm || '',
            isDifferentDeliveryAddress: contact?.isDifferentDeliveryAddress || false,
            deliveryName: contact?.deliveryName || '',
            deliverySurname: contact?.deliverySurname || '',
            deliveryStreet: contact?.deliveryStreet || '',
            deliveryCity: contact?.deliveryCity || '',
            deliveryZip: contact?.deliveryZip || '',
            deliveryPhone: contact?.deliveryPhone || '',
            deliveryEmail: contact?.deliveryEmail || '',
            note: contact?.note || '',
            birthNumber: contact?.birthNumber || '',
            deliveryCountryId: getDefaultCountryValue('deliveryCountryId'),
        },
        validationSchema: yup.object({
            firstname: yup
                .string()
                .trim()
                .matches(LETTERS_ONLY_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.firstname.matches_validation'),
                })
                .min(2, t('contact_form.firstname.min_validation'))
                .required(t('contact_form.firstname.required_validation')),
            surname: yup
                .string()
                .trim()
                .matches(LETTERS_ONLY_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.surname.matches_validation'),
                })
                .min(2, t('contact_form.surname.min_validation'))
                .required(t('contact_form.surname.required_validation')),
            street: yup
                .string()
                .trim()
                .matches(STREET_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.street.matches_validation'),
                })
                .required(t('contact_form.street.required_validation')),
            city: yup
                .string()
                .trim()
                .matches(LETTERS_ONLY_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.city.matches_validation'),
                })
                .required(t('contact_form.city.required_validation')),
            zip: yup
                .string()
                .trim()
                .required(t('contact_form.zip.required_validation'))
                .matches(
                    ZIP_REGEX,
                    t('contact_form.zip.matches_validation'),
                ),
            phone: yup
                .string()
                .trim()
                .required(t('contact_form.phone.required_validation'))
                .matches(PHONE_NUMBER_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.phone.matches_validation'),
                }),
            email: yup
                .string()
                .trim()
                .email(t('contact_form.email.email_validation'))
                .required(t('contact_form.email.required_validation')),
            countryId: yup
                .number()
                .nullable()
                .required(t('contact_form.country.required_validation')),
            createAccount: yup.bool(),
            registerPassword: yup
                .string()
                .nullable()
                .when('createAccount', {
                    is: true,
                    then: schema =>
                        schema
                            .min(6, t('contact_form.password.min_validation'))
                            .required(t('contact_form.password.required_validation')),
                }),
            registerPasswordConfirm: yup
                .string()
                .nullable()
                .when('createAccount', {
                    is: true,
                    then: schema =>
                        schema
                            .oneOf([yup.ref('registerPassword'), null], t('contact_form.password_confirm.confirm_validation'))
                            .required(t('contact_form.password_confirm.required_validation')),
                }),
            isCompany: yup.bool().transform(v => !!toNumber(v)), //convert to boolean before validation
            companyName: yup
                .string()
                .nullable()
                .trim()
                .when('isCompany', {
                    is: true,
                    then: schema => schema.required(t('contact_form.company_name.required_validation')),
                }),
            ico: yup
                .string()
                .nullable()
                .when('isCompany', {
                    is: true,
                    then: schema =>
                        schema
                            .trim()
                            .required(t('contact_form.ico.required_validation'))
                            .matches(BUSINESS_ID_REGEX, {
                                excludeEmptyString: true,
                                message: t('contact_form.ico.matches_validation'),
                            })
                            .trim(),
                }),
            dic: yup
                .string()
                .trim()
                .nullable()
                .matches(VAT_ID_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.dic.matches_validation'),
                })
                .trim(),
            icDPH: yup
                .string()
                .trim()
                .nullable()
                .matches(VAT_NUMBER_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.ic_dph.matches_validation'),
                })
                .trim(),
            isDifferentDeliveryAddress: yup.bool().transform(v => !!toNumber(v)), //convert to boolean before validation
            deliveryName: yup
                .string()
                .trim()
                .nullable()
                .when('isDifferentDeliveryAddress', {
                    is: true,
                    then: schema =>
                        schema
                            .matches(LETTERS_ONLY_REGEX, {
                                excludeEmptyString: true,
                                message: t('contact_form.delivery_name.matches_validation'),
                            })
                            .min(2, t('contact_form.delivery_name.min_validation'))
                            .required(t('contact_form.delivery_name.required_validation')),
                }),
            deliverySurname: yup
                .string()
                .trim()
                .nullable()
                .when('isDifferentDeliveryAddress', {
                    is: true,
                    then: schema =>
                        schema
                            .matches(LETTERS_ONLY_REGEX, {
                                excludeEmptyString: true,
                                message: t('contact_form.delivery_surname.matches_validation'),
                            })
                            .min(2, t('contact_form.delivery_surname.min_validation'))
                            .required(t('contact_form.delivery_surname.min_validation')),
                }),
            deliveryStreet: yup
                .string()
                .trim()
                .nullable()
                .matches(STREET_REGEX, {
                    excludeEmptyString: true,
                    message: t('contact_form.delivery_street.matches_validation'),
                })
                .when('isDifferentDeliveryAddress', {
                    is: true,
                    then: schema => schema.required(t('contact_form.delivery_street.required_validation')),
                }),
            deliveryCity: yup
                .string()
                .trim()
                .nullable()
                .when('isDifferentDeliveryAddress', {
                    is: true,
                    then: schema =>
                        schema
                            .nullable()
                            .matches(LETTERS_ONLY_REGEX, {
                                excludeEmptyString: true,
                                message: t('contact_form.delivery_city.matches_validation'),
                            })
                            .required(t('contact_form.delivery_city.required_validation')),
                }),
            deliveryZip: yup
                .string()
                .trim()
                .nullable()
                .when('isDifferentDeliveryAddress', {
                    is: true,
                    then: schema =>
                        schema
                            .required(t('contact_form.delivery_zip.required_validation'))
                            .matches(ZIP_REGEX, t('contact_form.delivery_zip.matches_validation')),
                }),
            deliveryPhone: yup
                .string()
                .trim()
                .nullable()
                .when("isDifferentDeliveryAddress", {
                    is: true,
                    then: schema =>
                        schema
                            .nullable()
                            .required(t('contact_form.delivery_phone.required_validation'))
                            .matches(PHONE_NUMBER_REGEX, {
                                excludeEmptyString: true,
                                message: t('contact_form.delivery_phone.matches_validation'),
                            }),
                }),
            deliveryCountryId: yup
                .number()
                .nullable()
                .when('isDifferentDeliveryAddress', {
                    is: true,
                    then: schema => schema.required(t('contact_form.delivery_country.required_validation')),
                }),
            note: yup.string().trim().nullable(),
        }),
        onSubmit: async (values, {setSubmitting}) => {

            const newContact = {...contact, ...values};

            if (newContact?.createAccount) {
                const newUserData = {
                    cart: {accessToken: cart?.accessToken},
                    user: {
                        ...newContact,
                        password: newContact?.registerPassword,
                        passwordRepeat: newContact?.registerPasswordConfirm,
                    },
                };

                if (newContact?.isCompany) {
                    newUserData.company = {
                        name: newContact?.companyName,
                        businessId: newContact?.ico,
                        taxId: newContact?.dic,
                        vatNumber: newContact?.icDPH,
                    };
                }
                await createUser(newUserData);
            }

            //remove sensitive data before saving to session
            delete newContact?.registerPassword;
            delete newContact?.registerPasswordConfirm;

            await saveContact(newContact, async savedValues => {
                const countryId = get(savedValues, 'countryId');
                const deliveryCountryId = get(savedValues, 'deliveryCountryId');
                const city = get(savedValues, 'city');
                const deliveryCity = get(savedValues, 'deliveryCity');
                const reqData = {
                    countryId,
                    city,
                };
                if (savedValues['isDifferentDeliveryAddress']) {
                    reqData.countryId = deliveryCountryId;
                    reqData.city = deliveryCity;
                }

                setIsRedirecting(true);
                await cartUpdate(reqData, () => {
                    //router.push('/kosik/doprava-a-platba');
                });
            });

            setSubmitting(false);
            router.push(CART_STEPS[2])
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
                  isRegistrationRequired
              }) => {
    const {t} = useTranslation();
    const {isLoading} = useCart();
    const step = useCartStep();
    const [buttonContainer, setButtonContainer] = useState(null);

    const { staticBlocks: onlineProductCartMessages } = useStaticBlock({ group: 'online_product_cart_messages'});
    const emailExistsLoginMessage = find(onlineProductCartMessages, {hash: 'ONLINE_PRODUCT_EMAIL_EXISTS_LOGIN'});
    const createAccountMessage = find(onlineProductCartMessages, {hash: 'ONLINE_PRODUCT_CREATE_ACCOUNT'});

    const isCompany = !!toNumber(values?.isCompany);
    const isDifferentDeliveryAddress = !!toNumber(
        values?.isDifferentDeliveryAddress,
    );

    useEffect(() => {
        setButtonContainer(document?document.getElementById("contact_confirm"):null)
    }, []);

    return (
        <>
            <Box className="mb-8 p-6">
                {!isEmpty(user) ? (
                    <LoggedUserInfo />
                ) : (
                    <>
                        {isRegistrationRequired && emailExists && emailExistsLoginMessage
                            ? <Alert type="info" message={<div dangerouslySetInnerHTML={{ __html: emailExistsLoginMessage.content }} />} />
                            : null
                        }
                        <EmailChecker
                            email={values?.email}
                            emailExists={emailExists}
                            setEmailExists={setEmailExists}
                            error={touched?.email && errors?.email ? errors?.email : ''}
                            handleChange={e => {
                                handleChange(e);
                                if (!e?.target?.value) {
                                    setEmailExists(null);
                                }
                            }}
                            handleBlur={e => {
                                handleBlur(e);
                                if (!e?.target?.value) {
                                    setEmailExists(null);
                                }
                            }}
                        />
                    </>
                )}
            </Box>
            {isEmpty(user) && emailExists && isRegistrationRequired
                ? null
                : (
                    <form onSubmit={handleSubmit}>
                        <Box className={"mb-8"}>
                            <div className={'grid grid-cols-2 gap-4 mt-4'}>
                                <div className={'col-span-2 md:col-span-1'}>
                                    <TextInput
                                        required
                                        label={t('contact_form.firstname.label')}
                                        error={
                                            touched.firstname && errors.firstname ? errors.firstname : ''
                                        }
                                        inputProps={{
                                            id: 'firstname',
                                            name: 'firstname',
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            value: values?.firstname,
                                            autoComplete: 'given-name',
                                            placeholder: t('contact_form.firstname.placeholder'),
                                        }}
                                    />
                                </div>
                                <div className={'col-span-2 md:col-span-1'}>
                                    <TextInput
                                        required
                                        label={t('contact_form.surname.label')}
                                        error={touched.surname && errors.surname ? errors.surname : ''}
                                        inputProps={{
                                            id: 'surname',
                                            name: 'surname',
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            value: values?.surname,
                                            autoComplete: 'family-name',
                                            placeholder: t('contact_form.surname.placeholder'),
                                        }}
                                    />
                                </div>
                                <div className={'col col-span-2'}>
                                    <TextInput
                                        required
                                        label={t('contact_form.phone.label')}
                                        hint={t('contact_form.phone.hint')}
                                        error={touched.phone && errors.phone ? errors.phone : ''}
                                        inputProps={{
                                            id: 'phone',
                                            name: 'phone',
                                            type: 'tel',
                                            // pattern: "[0-9]*",
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            value: values?.phone,
                                            autoComplete: 'tel',
                                            placeholder: t('contact_form.phone.placeholder'),
                                        }}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-4 gap-4 mt-4 pb-4'>
                                <div className='col col-span-4 md:col-span-3'>
                                    <TownInput
                                        required
                                        label={t('contact_form.city.label')}
                                        error={touched.city && errors.city ? errors.city : ''}
                                        inputProps={{
                                            id: 'city',
                                            name: 'city',
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            value: values?.city,
                                            autoComplete: 'address-level2',
                                            placeholder: t('contact_form.city.placeholder'),
                                            options: map(towns, option => ({
                                                value: option?.id,
                                                label: option?.name,
                                            })),
                                        }}
                                    />
                                </div>
                                <div className='col col-span-4 md:col-span-1'>
                                    <TextInput
                                        required
                                        label={t('contact_form.zip.label')}
                                        error={touched.zip && errors.zip ? errors.zip : ''}
                                        inputProps={{
                                            id: 'zip',
                                            name: 'zip',
                                            type: 'text',
                                            pattern: '[0-9]*',
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            value: values?.zip,
                                            autoComplete: 'postal-code',
                                            placeholder: t('contact_form.zip.placeholder'),
                                        }}
                                    />
                                </div>

                                <div className={'col col-span-4'}>
                                    <TextInput
                                        required
                                        label={t('contact_form.street.label')}
                                        error={touched.street && errors.street ? errors.street : ''}
                                        inputProps={{
                                            id: 'street',
                                            name: 'street',
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            value: values?.street,
                                            autoComplete: 'address-line1',
                                            placeholder: t('contact_form.street.placeholder'),
                                        }}
                                    />
                                </div>

                                <div className='col col-span-4'>
                                    <Select2Input
                                        label={t('contact_form.country.label')}
                                        error={
                                            touched.countryId && errors.countryId
                                                ? errors.countryId
                                                : ''
                                        }
                                        inputProps={{
                                            id: 'countryId',
                                            name: 'countryId',
                                            value: values?.countryId,
                                            onChange: selectedValue => {
                                                setFieldValue('countryId', selectedValue?.value);
                                                setFieldTouched('countryId');
                                            },
                                            onBlur: handleBlur,
                                            autoComplete: 'country',
                                            options: map(countries, country => {
                                                return {
                                                    value: country?.id,
                                                    label: country?.name,
                                                };
                                            }),
                                            placeholder: t('contact_form.country.placeholder'),
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 pl-2 md:pl-2">
                                <CheckboxInput
                                    label={t('contact_form.delivery_address.label')}
                                    error={
                                        touched.isDifferentDeliveryAddress &&
                                        errors.isDifferentDeliveryAddress
                                            ? errors.isDifferentDeliveryAddress
                                            : ''
                                    }
                                    inputProps={{
                                        id: 'isDifferentDeliveryAddress',
                                        name: 'isDifferentDeliveryAddress',
                                        onChange: handleChange,
                                        onBlur: handleBlur,
                                        value: 1,
                                        checked: isDifferentDeliveryAddress,
                                    }}
                                />
                            </div>


                            <section
                                className={`${!isDifferentDeliveryAddress ? 'hidden' : 'block'}`}
                            >
                                <h4 className="text-lg ms-1.5 mt-6 font-bold mb-3">
                                    {t('contact_form.delivery_address.title')}
                                </h4>

                                <div className={'grid grid-cols-4 gap-4 mt-4 pb-4'}>
                                    <div className={'col col-span-4 md:col-span-2'}>
                                        <TextInput
                                            required
                                            label={t('contact_form.delivery_name.label')}
                                            error={
                                                touched.deliveryName && errors.deliveryName
                                                    ? errors.deliveryName
                                                    : ''
                                            }
                                            inputProps={{
                                                id: 'deliveryName',
                                                name: 'deliveryName',
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                value: values?.deliveryName,
                                                autoComplete: 'given-name',
                                                placeholder: t('contact_form.delivery_name.placeholder'),
                                            }}
                                        />
                                    </div>
                                    <div className={'col col-span-4 md:col-span-2'}>
                                        <TextInput
                                            required
                                            label={t('contact_form.delivery_surname.label')}
                                            error={
                                                touched.deliverySurname && errors.deliverySurname
                                                    ? errors.deliverySurname
                                                    : ''
                                            }
                                            inputProps={{
                                                id: 'deliverySurname',
                                                name: 'deliverySurname',
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                value: values?.deliverySurname,
                                                autoComplete: 'family-name',
                                                placeholder: t('contact_form.delivery_surname.placeholder'),
                                            }}
                                        />
                                    </div>

                                    <div className={'col col-span-4'}>
                                        <TextInput
                                            required
                                            label={t('contact_form.delivery_phone.label')}
                                            hint={t('contact_form.delivery_phone.hint')}
                                            error={touched.deliveryPhone && errors.deliveryPhone ? errors.deliveryPhone : ''}
                                            inputProps={{
                                                id: 'deliveryPhone',
                                                name: 'deliveryPhone',
                                                type: 'tel',
                                                // pattern: "[0-9]*",
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                value: values?.deliveryPhone,
                                                autoComplete: 'tel',
                                                placeholder: t('contact_form.delivery_phone.placeholder'),
                                            }}
                                            setFieldTouched={setFieldTouched}
                                            setFieldValue={setFieldValue}
                                        />
                                    </div>

                                    <div className='col-span-4 md:col-span-3'>
                                        <TownInput
                                            required
                                            label={t('contact_form.delivery_city.label')}
                                            error={
                                                touched.deliveryCity && errors.deliveryCity
                                                    ? errors.deliveryCity
                                                    : ''
                                            }
                                            inputProps={{
                                                id: 'deliveryCity',
                                                name: 'deliveryCity',
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                value: values?.deliveryCity,
                                                autoComplete: 'address-level2',
                                                placeholder: t('contact_form.delivery_city.placeholder'),
                                                options: map(towns, option => ({
                                                    value: option?.id,
                                                    label: option?.name,
                                                })),
                                            }}
                                        />
                                    </div>
                                    <div className='col-span-4 md:col-span-1'>
                                        <TextInput
                                            required
                                            label={t('contact_form.delivery_zip.label')}
                                            error={
                                                touched.deliveryZip && errors.deliveryZip
                                                    ? errors.deliveryZip
                                                    : ''
                                            }
                                            inputProps={{
                                                id: 'deliveryZip',
                                                name: 'deliveryZip',
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                value: values?.deliveryZip,
                                                autoComplete: 'postal-code',
                                                placeholder: t('contact_form.delivery_zip.placeholder'),
                                            }}
                                        />
                                    </div>
                                    <div className={'col-span-4'}>
                                        <TextInput
                                            required
                                            label={t('contact_form.delivery_street.label')}
                                            error={
                                                touched.deliveryStreet && errors.deliveryStreet
                                                    ? errors.deliveryStreet
                                                    : ''
                                            }
                                            inputProps={{
                                                id: 'deliveryStreet',
                                                name: 'deliveryStreet',
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                value: values?.deliveryStreet,
                                                autoComplete: 'address-line1',
                                                placeholder: t('contact_form.delivery_street.placeholder'),
                                            }}
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <Select2Input
                                            label={t('contact_form.delivery_country.label')}
                                            error={
                                                touched.deliveryCountryId && errors.deliveryCountryId
                                                    ? errors.deliveryCountryId
                                                    : ''
                                            }
                                            inputProps={{
                                                id: 'deliveryCountryId',
                                                name: 'deliveryCountryId',
                                                value: values?.deliveryCountryId,
                                                onChange: selectedValue => {
                                                    setFieldValue('deliveryCountryId', selectedValue?.value);
                                                    setFieldTouched('deliveryCountryId');
                                                },
                                                onBlur: handleBlur,
                                                autoComplete: 'country',
                                                placeholder: t('contact_form.country.placeholder'),
                                                options: map(countries, country => {
                                                    return {
                                                        value: country?.id,
                                                        label: country?.name,
                                                    };
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="mt-3 pl-2 md:pl-2">
                                <CheckboxInput
                                    label={t('contact_form.company.label')}
                                    error={
                                        touched.isCompany && errors.isCompany ? errors.isCompany : ''
                                    }
                                    inputProps={{
                                        id: 'isCompany',
                                        name: 'isCompany',
                                        onChange: handleChange,
                                        onBlur: handleBlur,
                                        value: 1,
                                        checked: isCompany,
                                    }}
                                />
                            </div>

                            <section className={`${!isCompany ? 'hidden' : 'block'}`}>

                                <h4 className="text-lg ms-1.5 font-bold mt-6 mb-3">
                                    {t('contact_form.company.title')}
                                </h4>
                                <div className={'grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4'}>
                                    <div className={'col'}>
                                        <TextInput
                                            required
                                            label={t('contact_form.company_name.label')}
                                            error={
                                                touched.companyName && errors.companyName
                                                    ? errors.companyName
                                                    : ''
                                            }
                                            inputProps={{
                                                id: 'companyName',
                                                name: 'companyName',
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                value: values?.companyName,
                                                autoComplete: 'organization',
                                                placeholder: t('contact_form.company_name.placeholder'),
                                            }}
                                        />
                                    </div>
                                    <div className={'col'}>
                                        <TextInput
                                            required
                                            label={t('contact_form.ico.label')}
                                            error={touched.ico && errors.ico ? errors.ico : ''}
                                            inputProps={{
                                                id: 'ico',
                                                name: 'ico',
                                                onChange: handleChange,
                                                value: values?.ico,
                                                placeholder: t('contact_form.ico.placeholder'),
                                            }}
                                        />
                                    </div>
                                    <div className={'col'}>
                                        <TextInput
                                            label={t('contact_form.dic.label')}
                                            error={touched.dic && errors.dic ? errors.dic : ''}
                                            inputProps={{
                                                id: 'dic',
                                                name: 'dic',
                                                onChange: handleChange,
                                                value: values?.dic,
                                                placeholder: t('contact_form.dic.placeholder'),
                                            }}
                                        />
                                    </div>
                                    <div className={'col'}>
                                        <TextInput
                                            label={t('contact_form.ic_dph.label')}
                                            error={touched.icDPH && errors.icDPH ? errors.icDPH : ''}
                                            inputProps={{
                                                id: 'icDPH',
                                                name: 'icDPH',
                                                onChange: handleChange,
                                                value: values?.icDPH,
                                                placeholder: t('contact_form.ic_dph.placeholder'),
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className={'mt-4 pb-4'}>
                                <div className={'col'}>
                                    <TextAreaInput
                                        label={t('contact_form.note.label')}
                                        error={
                                            touched.note && errors.note
                                                ? errors.note
                                                : ''
                                        }
                                        inputProps={{
                                            id: 'note',
                                            name: 'note',
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            value: values?.note,
                                            autoComplete: 'note',
                                            placeholder: t('contact_form.note.placeholder'),
                                        }}
                                    />
                                </div>
                            </div>
                        </Box>
                        <Box>
                            {isEmpty(user) ? (
                                <div className={`${emailExists ? 'hidden' : 'block'}`}>
                                    {isRegistrationRequired
                                        ? <Alert type="info" className="mb-3" message={<div dangerouslySetInnerHTML={{__html: createAccountMessage?.content}} />} />
                                        : (
                                            <CheckboxInput
                                                label={t('contact_form.account.label')}
                                                error={
                                                    touched.createAccount && errors.createAccount
                                                        ? errors.createAccount
                                                        : ''
                                                }
                                                inputProps={{
                                                    disabled: isRegistrationRequired,
                                                    id: 'createAccount',
                                                    name: 'createAccount',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    value: 1,
                                                    checked: values?.createAccount,
                                                    groupClassName: `${values?.createAccount ? '' : '!mb-0'}`,
                                                }}
                                            />
                                        )
                                    }


                                    <div
                                        className={
                                            values?.createAccount ? 'block' : 'hidden'
                                        }
                                    >
                                        <div className='col-12 col-md-6'>
                                            <TextInput
                                                required
                                                label={t('contact_form.password.label')}
                                                error={
                                                    touched.registerPassword && errors.registerPassword
                                                        ? errors.registerPassword
                                                        : ''
                                                }
                                                inputProps={{
                                                    id: 'registerPassword',
                                                    name: 'registerPassword',
                                                    type: 'password',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    value: values?.registerPassword,
                                                    autoComplete: 'new-password',
                                                }}
                                            />
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <TextInput
                                                required
                                                label={t('contact_form.password_confirm.label')}
                                                error={
                                                    touched.registerPasswordConfirm &&
                                                    errors.registerPasswordConfirm
                                                        ? errors.registerPasswordConfirm
                                                        : ''
                                                }
                                                inputProps={{
                                                    id: 'registerPasswordConfirm',
                                                    name: 'registerPasswordConfirm',
                                                    type: 'password',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    value: values?.registerPasswordConfirm,
                                                    autoComplete: 'new-password',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </Box>
                        {buttonContainer? createPortal(
                            <>
                                <Button
                                    loading={isLoading || isSubmitting}
                                    htmlType={"submit"}
                                    type={"primary"}
                                    fullWidth
                                    onClick ={()=> handleSubmit()}
                                    round
                                >
                                    <span>{t('cart_title.step2.button')} </span>
                                </Button>
                                <Button
                                    type="link"
                                    fullWidth
                                    htmlType={"a"}
                                    href={CART_STEPS[step-1]}
                                    loading={isLoading}
                                    prefetch
                                    className="mt-3"
                                    round
                                >
                                    <BackButtonContent step={step}/>
                                </Button>
                            </>,
                            buttonContainer
                        ): ""}

                    </form>
                )
            }
        </>
    );
};

export default ContactForm;
