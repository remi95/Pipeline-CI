import React, { useState } from 'react';
import {
  Carousel as BootstrapCarousel, CarouselControl, CarouselIndicators, CarouselItem,
} from 'reactstrap';
import { Picture } from '../../models/PictureModel';
import { BASE_URL } from '../../config/api';
import './Carousel.scss';

interface Props {
  pictures: Picture[];
}

const Carousel: React.FC<Props> = (props: Props) => {
  const { pictures } = props;
  const [activeIndex, setActiveIndex] = useState(0);


  const next = (): void => {
    const nextIndex = activeIndex === pictures.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = (): void => {
    const nextIndex = activeIndex === 0 ? pictures.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number): void => {
    setActiveIndex(newIndex);
  };

  return (
    <BootstrapCarousel next={next} previous={previous} activeIndex={activeIndex}>
      <CarouselIndicators items={pictures} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {
        pictures.map((picture) => (
          <CarouselItem key={picture.id} className="carousel-item">
            <img src={BASE_URL + picture.path} alt={picture.originalName} />
          </CarouselItem>
        ))
      }
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </BootstrapCarousel>
  );
};

Carousel.defaultProps = {
  pictures: [],
};

export default Carousel;
