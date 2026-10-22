'use client';

import Image from '@/grandus-utils/wrappers/image/Image';
import PlaceHolderImage from '@/components/_other/placeholder/PlaceHolderImage';

// Product thumbnail for the cart lists: fixed rounded box (brand-soft until the
// photo loads), the photo covers it. `width` / `height` = requested thumbnail.
const SIZES = {
  // cart table: 50 x 60 on phones, 80 x 100 from sm
  lg: {
    box: 'h-[60px] w-[50px] rounded-[10px] sm:h-[100px] sm:w-20 sm:rounded-[12px]',
    width: 80,
    height: 100,
  },
  // mini cart
  md: { box: 'h-20 w-16 rounded-[12px]', width: 64, height: 80 },
  // order summary
  sm: { box: 'h-[60px] w-[50px] rounded-[10px]', width: 50, height: 60 },
  // additional services (gift wrap)
  square: { box: 'h-[50px] w-[50px] rounded-[10px]', width: 50, height: 50 },
};

const CartThumb = ({ photo, alt = '', title, size = 'sm', className = '' }) => {
  const config = SIZES[size] ?? SIZES.sm;
  const imageAlt = alt || ' ';
  const imageProps = {
    width: config.width,
    height: config.height,
    type: 'jpg',
    title,
    sizes: `${config.width}px`,
    className: 'h-full w-full object-cover',
  };

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-brand-soft ${config.box} ${className}`}
    >
      {photo ? (
        <Image photo={photo} alt={imageAlt} {...imageProps} />
      ) : (
        <PlaceHolderImage alt={imageAlt} {...imageProps} />
      )}
    </div>
  );
};

export default CartThumb;
