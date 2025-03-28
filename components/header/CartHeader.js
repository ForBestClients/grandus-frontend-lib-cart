'use client';
import { useTranslation } from '@/app/i18n/client';
import { CART_STEPS } from '@/constants/AppConstants';
import { useCartStep } from '@/utils/cart';

// LODASH
import find from 'lodash/find';
import upperFirst from 'lodash/upperFirst';
import Link from 'next/link';

import styles from './CartHeader.module.scss';

const CartHeader = () => {
  let step = useCartStep();
  const { t } = useTranslation();

  if (step === undefined) {
    step = 0;
  }

  step += 1;

  const steps = [
    {
      step: 1,
      text: upperFirst(t('cart_title.step1.short')),
      link: CART_STEPS[0],
      title: {
        text: upperFirst(t('cart_title.step1.description')),
        link: CART_STEPS[0],
      },
    },
    {
      step: 2,
      text: upperFirst(t('cart_title.step2.short')),
      link: CART_STEPS[1],
      title: {
        text: upperFirst(t('cart_title.step2.description')),
        link: '/kosik',
      },
    },
    {
      step: 3,
      text: upperFirst(t('cart_title.step3.short')),
      link: CART_STEPS[2],
      title: {
        text: upperFirst(t('cart_title.step3.description')),
        link: '/kosik/kontakt',
      },
    },
    // {
    //   step: 4,
    //   text: upperFirst(t('cart_title.step4.short')),
    //   link: CART_STEPS[3],
    //   title: {
    //     text: upperFirst(t('cart_title.step4.description')),
    //     link: '/kosik/doprava-a-platba',
    //   },
    // },
  ];

  const currentStep = find(steps, { step: step });

  return (
    <nav className={styles.wrapper}>
      {steps.map(stepItem => {
        if (stepItem.step === currentStep.step) {
          return (
            <Link
              href={stepItem?.link}
              key={`step-${stepItem?.step}`}
              className={`${styles.navLink} ${styles.active}`}
            >
              <span className={styles.stepCount}>{stepItem.step}</span>
              <span>{stepItem?.text}</span>
            </Link>
          );
        }

        if (stepItem.step < currentStep.step) {
          return (
            <Link
              href={stepItem?.link}
              key={`step-${stepItem?.step}`}
              className={`${styles.navLink} ${styles.finished}`}
            >
              <span className={styles.stepCount}>{stepItem.step}</span>
              <span>{stepItem?.text}</span>
            </Link>
          );
        }

        return (
          <span className={styles.navLink} key={`step-${stepItem?.step}`}>
            <span className={styles.stepCount}>{stepItem.step}</span>
            <span>{stepItem?.text}</span>
          </span>
        );
      })}
    </nav>
  );
};
export default CartHeader;
