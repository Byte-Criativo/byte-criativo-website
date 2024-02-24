import { Navigation } from "swiper/modules"
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
        slidesPerView={3}
        slidesPerGroup={3}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Navigation]}
        className="mySwiper"
      >
        <div className="swiper-button-prev swiper-button">
          <ArrowLeft size={48} />
        </div>
        <div className="swiper-button-next swiper-button">
          <ArrowRight size={48} />
        </div>

        <SwiperSlide style={{ justifyContent: "flex-end" }}>
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
        <SwiperSlide style={{ justifyContent: "flex-start" }}>
          <TeamCard
            name="Bruna Porato"
            occupation="front-end dev"
            image="https://github.com/brunaporato.png"
            url="https://linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
        <SwiperSlide style={{ justifyContent: "flex-end" }}>
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
        <SwiperSlide style={{ justifyContent: "flex-start" }}>
          <TeamCard
            name="Bruna Porato"
            occupation="front-end dev"
            image="https://github.com/brunaporato.png"
            url="https://linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
        <SwiperSlide style={{ justifyContent: "flex-end" }}>
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
        <SwiperSlide style={{ justifyContent: "flex-start" }}>
          <TeamCard
            name="Bruna Porato"
            occupation="front-end dev"
            image="https://github.com/brunaporato.png"
            url="https://linkedin.com/in/brunaporato"
          />
        </SwiperSlide>
      </Swiper>
    </SliderContainer>
  )
}
