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

  if (step === undefined || step < 0) {
    step = 0;
  }

  step += 1;

  const steps = [
    {
      step: 1,
      text: upperFirst(t('cart_title.step1.short')),
      link: CART_STEPS[0],
    },
    {
      step: 2,
      text: upperFirst(t('cart_title.step2.short')),
      link: CART_STEPS[1],
    },
    {
      step: 3,
      text: upperFirst(t('cart_title.step3.short')),
      link: CART_STEPS[2],
    },
  ];

  const currentStep = find(steps, { step: step }) ?? steps[0];

  return (
    <nav aria-label={t('cart_title.steps_label')} className={styles.wrapper}>
      <ol className={styles.list}>
        {steps.map(stepItem => {
          const content = (
            <>
              <span className={styles.stepCount}>{stepItem.step}</span>
              <span className={styles.label}>{stepItem.text}</span>
            </>
          );

          // finished steps stay links back, the active one is marked as current
          if (stepItem.step < currentStep.step) {
            return (
              <li key={`step-${stepItem.step}`} className={styles.item}>
                <Link
                  href={stepItem.link}
                  className={`${styles.navLink} ${styles.done}`}
                >
                  {content}
                </Link>
              </li>
            );
          }

          const isActive = stepItem.step === currentStep.step;

          return (
            <li key={`step-${stepItem.step}`} className={styles.item}>
              <span
                className={`${styles.navLink} ${isActive ? styles.active : styles.upcoming}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {content}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
export default CartHeader;
