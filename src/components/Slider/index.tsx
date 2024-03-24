import { Navigation, Pagination } from "swiper/modules"
import { SwiperSlide, Swiper } from "swiper/react"
import { SliderContainer } from "./styles"

import "swiper/css"
import "swiper/css/navigation"
import { TeamCard } from "../TeamCard"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"

export function Slider() {
  return (
    <SliderContainer>
      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          430: {
            slidesPerView: 1,
            spaceBetween: 8,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          689: {
            slidesPerView: 3,
            spaceBetween: 8,
          },
          900: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 64,
          },
          1350: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
          1750: {
            slidesPerView: 4,
            spaceBetween: 32,
          },
          2400: {
            slidesPerView: 5,
            spaceBetween: 32,
          },
          3000: {
            slidesPerView: 6,
            spaceBetween: 32,
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <TeamCard
            name="Carlos Ferrer"
            occupation="CEO | full-stack dev"
            image="https://github.com/carlosferrerdev.png"
            url="https://www.linkedin.com/in/ferrercarlos/"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Julia Paranhos"
            occupation="CTO | back-end dev"
            image="https://github.com/juliarparanhos.png"
            url="https://linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Bruna Porato"
            occupation="front-end dev"
            image="https://github.com/brunaporato.png"
            url="https://linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Victor Paranhos"
            occupation="Dev"
            image="https://github.com/VRParanhos.png"
            url="https://www.linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Julia Paranhos"
            occupation="CTO | back-end dev"
            image="https://github.com/juliarparanhos.png"
            url="https://linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Bruna Porato"
            occupation="front-end dev"
            image="https://github.com/brunaporato.png"
            url="https://linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Carlos Ferrer"
            occupation="CEO | full-stack dev"
            image="https://github.com/carlosferrerdev.png"
            url="https://www.linkedin.com/in/ferrercarlos/"
          />
        </SwiperSlide>
      </Swiper>
      <div className="swiper-button-prev swiper-button">
        <ArrowLeft size={48} />
      </div>
      <div className="swiper-button-next swiper-button">
        <ArrowRight size={48} />
      </div>
    </SliderContainer>
  )
}
