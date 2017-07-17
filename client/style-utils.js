import { css } from 'styled-components';

export const sizes = [
  {
    device: 'phone',
    width: 400
  },
  {
    device: 'phablet',
    width: 550
  },
  {
    device: 'tablet',
    width: 750
  },
  {
    device: 'desktop',
    width: 1000
  },
  {
    device: 'desktopHD',
    width: 1200
  }
];

export const margins = [
  .5,
  .75,
  1,
  1.25,
  1.5
];

export const radius = 0;

export const transition = 'linear';

export const media = sizes.reduce((acc, size, index) => {
  const emSize = size.width / 16;
  acc[size.device] = (...args) => css`
    ${size.width == 400 &&
      css(...args)
    }
    @media(min-width: ${emSize}em) {
      ${css(...args)}
    }
  `
  return acc;
}, {});

export default {
  sizes,
  margins,
  radius,
  transition,
  media
};
