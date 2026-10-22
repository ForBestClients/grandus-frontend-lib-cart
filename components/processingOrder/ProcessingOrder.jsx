"use client"
import upperFirst from 'lodash/upperFirst';

import styles from './ProcessingOrder.module.scss';
import {useTranslation} from "@/app/i18n/client";
import LoadingIcon from "@/components/_other/icons/LoadingIcon";

const ProcessingOrder = () => {
    const { t } = useTranslation();
    return (
        <div className={styles?.wrapper} role="status" aria-live="polite">
            <div className={styles?.icon}>
                <LoadingIcon className="h-4 w-12" />
            </div>

            <h2 className="mb-0 text-xl font-medium leading-snug text-ink md:text-2xl">
                {upperFirst(t('cart.processing_order'))}
            </h2>
        </div>
    );
};

export default ProcessingOrder;
