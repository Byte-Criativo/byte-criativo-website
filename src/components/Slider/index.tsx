import { Navigation, Pagination } from "swiper/modules"
import { SwiperSlide, Swiper } from "swiper/react"
import { SliderContainer } from "./styles"

import "swiper/css"
import "swiper/css/navigation"
import { TeamCard } from "../TeamCard"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"

import carlosferrer from "../../assets/team_photos/carlosferrer.jpg"
import brunaporato from "../../assets/team_photos/brunaporato.jpg"
import marcellacavalcanti from "../../assets/team_photos/marcellacavalcanti.jpg"
import brunacairo from "../../assets/team_photos/brunacairo.jpg"
import victorparanhos from "../../assets/team_photos/victorparanhos.jpg"

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
            image={carlosferrer}
            url="https://www.linkedin.com/in/ferrercarlos/"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Bruna Porato"
            occupation="Front-end dev"
            image={brunaporato}
            url="https://linkedin.com/in/brunaporato/"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Marcella Cavalcanti"
            occupation="Product Designer"
            image={marcellacavalcanti}
            url="https://www.linkedin.com/in/marcellacavalcanti2106"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Bruna Cairo"
            occupation="Copywriter"
            image={brunacairo}
            url="https://www.linkedin.com/in/cairobruna/"
          />
        </SwiperSlide>
        <SwiperSlide>
          <TeamCard
            name="Victor Paranhos"
            occupation="Developer Intern"
            image={victorparanhos}
            url="https://www.linkedin.com/in/victor-paranhos-470b75210/"
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
