'use client';
import get from "lodash/get";
import Box from "@/components/_other/box/Box";
import Price from "@/components/price/Price";
import Divider from "@/components/_other/divider/Divider";
import { useTranslation } from "@/app/i18n/client";
import useWebInstance from "@/grandus-lib/hooks/useWebInstance";
import { BANK_TRANSFER_TYPE } from "@/grandus-lib/components/v2/payment/provider";

const Row = ({ label, children }) => (
  <div className={'grid grid-cols-3 gap-3 py-1.5'}>
    <dt className={'col-span-1 text-sm leading-relaxed text-ink-muted'}>{label}</dt>
    <dd className={'col-span-2 m-0 break-words font-semibold tabular-nums text-ink'}>{children}</dd>
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
    <Box className="!border-brand-soft !bg-brand-soft">
      <h2 className={'mb-1 text-lg font-medium leading-snug text-ink md:text-xl'}>
        {t('order.thank_you.transfer_title')}
      </h2>
      <p className={'mb-4 text-sm text-ink'}>{t('order.thank_you.transfer_info')}</p>

      <dl className="m-0">
        {holder ? (
          <Row label={t('order.thank_you.transfer_account_holder')}>{holder}</Row>
        ) : null}
        <Row label={t('order.thank_you.transfer_iban')}>{iban}</Row>
        {bic ? <Row label={t('order.thank_you.transfer_bic')}>{bic}</Row> : null}
        {bankName ? <Row label={t('order.thank_you.transfer_bank')}>{bankName}</Row> : null}
      </dl>

      <Divider className="!border-brand/30" />

      <dl className="m-0">
        <Row label={t('order.thank_you.transfer_vs')}>{order.orderNumber}</Row>
        <Row label={t('order.thank_you.transfer_amount')}>
          <span className="text-lg">
            <Price priceData={order.totalSumData} />
          </span>
        </Row>
      </dl>
    </Box>
  );
};

export default BankTransferInfo;
