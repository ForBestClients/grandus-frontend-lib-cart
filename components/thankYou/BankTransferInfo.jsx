'use client';
import get from "lodash/get";
import Box from "@/components/_other/box/Box";
import Price from "@/components/price/Price";
import Divider from "@/components/_other/divider/Divider";
import { useTranslation } from "@/app/i18n/client";
import useWebInstance from "@/grandus-lib/hooks/useWebInstance";
import { BANK_TRANSFER_TYPE } from "@/grandus-lib/components/v2/payment/provider";

const Row = ({ label, children }) => (
  <div className={'grid grid-cols-3 gap-2 py-1'}>
    <div className={'col-span-1 text-gray-500'}>{label}</div>
    <div className={'col-span-2 font-semibold break-words'}>{children}</div>
  </div>
);

const BankTransferInfo = ({ order, settings: settingsProp = null }) => {
  const { t } = useTranslation();
  const { settings: settingsFromHook } = useWebInstance();
  const settings = settingsProp ?? settingsFromHook;

  if (get(order, 'paymentObject.type') !== BANK_TRANSFER_TYPE) {
    return null;
  }

  const iban = get(settings, 'bank_IBAN');
  const bic = get(settings, 'bank_BIC');
  const holder = get(settings, 'name_of_company');
  const bankName = get(settings, 'bank_name');

  if (!iban) {
    return null;
  }

  return (
    <Box className="bg-white mt-6">
      <h2 className={'text-lg md:text-xl mb-1'}>
        <strong>{t('order.thank_you.transfer_title')}</strong>
      </h2>
      <p className={'text-gray-600 mb-4'}>{t('order.thank_you.transfer_info')}</p>

      {holder ? (
        <Row label={t('order.thank_you.transfer_account_holder')}>{holder}</Row>
      ) : null}
      <Row label={t('order.thank_you.transfer_iban')}>{iban}</Row>
      {bic ? <Row label={t('order.thank_you.transfer_bic')}>{bic}</Row> : null}
      {bankName ? <Row label={t('order.thank_you.transfer_bank')}>{bankName}</Row> : null}

      <Divider />

      <Row label={t('order.thank_you.transfer_vs')}>{order.orderNumber}</Row>
      <Row label={t('order.thank_you.transfer_amount')}>
        <Price priceData={order.totalSumData} />
      </Row>
    </Box>
  );
};

export default BankTransferInfo;
