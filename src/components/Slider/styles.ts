import styled from "styled-components"

export const SliderContainer = styled.div`
  width: 100%;

  .swiper {
    width: 100%;
    height: 400px;

    padding: 0 3rem;
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;

    /* border: 1px solid red; */
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-button-next,
  .swiper-button-prev {
    width: 48px;
    height: 48px;

    background: transparent;
    border: none;

    color: ${({ theme }) => theme.COLORS.ORANGE};

    &::after {
      display: none;
    }
  }

  .swiper-button-prev {
    left: 0;
  }

  .swiper-button-next {
    right: 0;
  }
`
