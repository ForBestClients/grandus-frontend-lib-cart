"use client"
import upperFirst from 'lodash/upperFirst';

import styles from './ProcessingOrder.module.scss';
import {useTranslation} from "@/app/i18n/client";
import LoadingIcon from "@/components/_other/icons/LoadingIcon";

const ProcessingOrder = () => {
    const { t } = useTranslation();
    return (
        <div className={styles?.wrapper}>
            <div className={styles?.icon}>
                <LoadingIcon />
            </div>

            <h2 className="d-block mb-4">
                {upperFirst(t('cart.processing_order'))}
            </h2>
        </div>
    );
};

export default ProcessingOrder;
