'use client';
import InfoIcon from '@/components/_other/icons/InfoIcon';
import useCart from '@/grandus-lib/hooks/useCart';
import { isEmpty, map } from 'lodash';

import filter from "lodash/filter";
import Alert from '@/components/_other/alert/Alert';

export const CartMessages = () => {
  const { cart } = useCart();

  if (isEmpty(cart?.messages)) {
    return null;
  }

  const messages = filter(cart?.messages, message => !isEmpty(message?.text));

  return (
    <div className={'mb-4'}>
      <div className={'flex flex-col gap-4'}>
        {map(messages, message => (
          <Alert type="info" key={`cart-message-${message.id}`} className={'py-4'}>
            <div className="flex gap-x-4 items-center">
              <InfoIcon className="leading-4" />
              <div
                className={'[&_p:first-child]:mb-0 [&_strong]:font-bold'}
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
