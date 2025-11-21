import useCart from 'grandus-lib/hooks/useCart';
import useStaticBlock from 'grandus-lib/hooks/useStaticBlock';
import first from 'lodash/first';
import useWebInstance from 'grandus-lib/hooks/useWebInstance';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
import replace from 'lodash/replace';
import { formatter } from 'utils/price';
import Box from 'components/_other/box/Box';

const PossibleCredits = () => {
  const { cart } = useCart();
  const { staticBlocks } = useStaticBlock({ hash: 'CART_POSSIBLE_CREDITS' });
  const { webInstance } = useWebInstance();

  const creditValue = toNumber(get(webInstance, 'globalSettings.credits_value', 0));

  const block = first(staticBlocks);

  if (!block?.content) {
    return '';
  }

  let content = block.content;
  content = replace(content, '{credits}', cart?.possibleCredits ?? 0);
  content = replace(content, '{value}', formatter.format((cart?.possibleCredits ?? 0) * creditValue));

  return <Box>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </Box>;
};

export default PossibleCredits;
