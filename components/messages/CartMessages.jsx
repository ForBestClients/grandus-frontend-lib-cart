'use client';
import InfoIcon from '@/components/_other/icons/InfoIcon';
import useCart from '@/grandus-lib/hooks/useCart';
import { isEmpty, map } from 'lodash';

import filter from "lodash/filter";
import Alert from '@/components/_other/alert/Alert';

export const CartMessages = ({ className = 'mb-4' }) => {
  const { cart } = useCart();

  if (isEmpty(cart?.messages)) {
    return null;
  }

  const messages = filter(cart?.messages, message => !isEmpty(message?.text));

  if (isEmpty(messages)) {
    return null;
  }

  return (
    <div className={className}>
      <div className={'flex flex-col gap-3'}>
        {map(messages, message => (
          <Alert type="info" key={`cart-message-${message.id}`}>
            <div className="flex items-start gap-3">
              <InfoIcon className="mt-[3px] shrink-0 text-brand-deep" />
              <div
                className={'min-w-0 [&_a]:text-brand-deep [&_a]:underline [&_a]:underline-offset-2 [&_p:last-child]:mb-0 [&_p]:text-sm [&_strong]:font-bold'}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default CartMessages;
