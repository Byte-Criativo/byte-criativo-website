import styled from "styled-components"

export const SliderContainer = styled.div`
  width: 100%;

  position: relative;

  cursor: grab;

  .swiper {
    width: 100%;
    height: 29rem;

    padding: 0 3rem;

    /* tablet screen */
    @media (max-width: 897px) {
      padding: 0;
    }
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-button {
    width: 48px;
    height: 48px;

    background: transparent;
    border: none;

    color: ${({ theme }) => theme.COLORS.ORANGE};

    &::after {
      display: none;
    }

    @media (max-width: 897px) {
      position: absolute;
      top: 29rem;
    }
  }

  .swiper-button-prev {
    left: 0;
  }

  .swiper-button-next {
    right: 0;
  }
`
