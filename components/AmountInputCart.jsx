import { startTransition } from 'react';
import NumberInput from '@/components/_other/form/NumberInput';
import debounce from 'lodash/debounce';

// "− 1 +" pill from the foundation NumberInput (white, 1px #DDF7F6 border)
const AmountInputCart = ({
                           amount,
                           setAmount,
                           afterChange,
                           loading = false,
                           pillSize = 'md',
                           inputClassName = '',
                         }) => {
  const MAX = 999;

  const handleChange = debounce((value) => {
    if (value !== amount) {
      const newValue = value > MAX ? MAX : value;
      startTransition(() => {
          setAmount?.(newValue || 1),
            afterChange?.(newValue);
        },
      );
    }
  }, 500);

  return (
    <NumberInput key={amount} onValueChange={handleChange} loading={loading} showButtons={true} size={pillSize} inputProps={{
      name: 'amount',
      groupClassName: '!m-0',
      // while saving, the loader dots replace the digit (the loader overlay
      // is translucent, so the digit would show through them)
      className: `${inputClassName} ${loading ? '!text-transparent' : ''}`,
      readOnly: true,
      min: 1,
      max: MAX,
      value: amount,
    }} hasFeedback={false} />
  );
};

export default AmountInputCart;
