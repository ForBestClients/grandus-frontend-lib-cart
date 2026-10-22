"use client"
import BaseDeliveryProvider from "@/grandus-lib/components/v2/delivery/provider";
import {useTranslation} from "@/app/i18n/client";
import {lowerCase} from "lodash";

const DeliveryProvider = ({ delivery, country, selected = false, className = '' }) => {
    const { t } = useTranslation();

    // deliveries without a provider widget (e.g. courier) render nothing
    if (!delivery?.serviceProviderType) {
        return null;
    }

    const options = {
        packetery: {
            country: lowerCase(country?.twoLetterCode),
            text: {
                choosePlaceLabel: t('cart_form.delivery.choose_pickup_point'),
                changePlaceLabel: t('cart_form.delivery.change')
            }
        }
    }
    return (
    <div className={`${!selected ? 'hidden' : ''} ${className}`}>
        <BaseDeliveryProvider
            options={options}
            delivery={delivery}
            deliveryProviderType={delivery?.serviceProviderType}
        />
    </div>
    );

}

export default DeliveryProvider;
