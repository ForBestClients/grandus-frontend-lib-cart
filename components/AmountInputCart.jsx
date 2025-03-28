import { startTransition } from 'react';
import NumberInput from "@/components/_other/form/NumberInput";
import debounce from "lodash/debounce";

const AmountInputCart = ({
   amount,
   setAmount,
   afterChange,
   loading = false
 }) => {
  const MAX = 999;

  const handleChange = debounce((value) => {
    if (value !== amount) {
      const newValue = value > MAX ? MAX : value;
      startTransition(()=> {
        setAmount?.(newValue || 1),
          afterChange?.(newValue);
        }
      );
    }
  }, 500);

  return (
      <NumberInput key={amount} onValueChange={handleChange} loading={loading} inputProps={{ name: 'amount', groupClassName: '!mb-0', readOnly: true, min: 1, max: MAX, value: amount }} />
  );
};

export default AmountInputCart;
