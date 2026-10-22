'use client';

import { createContext, useContext, useMemo, useState } from 'react';

// Doprava a platba: the delivery and payment picked in the form and whether
// they are still being saved. The order button and the summary read the cart,
// so they wait until the cart holds the same choice.
const CheckoutSelectionContext = createContext(null);

export const CheckoutSelectionProvider = ({ children }) => {
  // { deliveryId, paymentId, isSaving } while the form is mounted, else null
  const [selection, setSelection] = useState(null);
  const value = useMemo(() => ({ selection, setSelection }), [selection]);

  return (
    <CheckoutSelectionContext.Provider value={value}>
      {children}
    </CheckoutSelectionContext.Provider>
  );
};

export const useCheckoutSelection = () => useContext(CheckoutSelectionContext);

export default CheckoutSelectionProvider;
