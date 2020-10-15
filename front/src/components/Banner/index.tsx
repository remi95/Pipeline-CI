import React from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Banner.scss';

type BannerProps = {
  content: {
    title: string;
    image: {
      src: string;
    };
    btn: {
      title: string;
      href: string;
    };
    subtitle?: {
      content: string;
      href: string;
    };
  };
}

const Banner: React.FC<BannerProps> = (props: BannerProps) => {
  const { content } = props;
  const {
    title, image, btn, subtitle,
  } = content;

  return (
    <Row className="banner">
      <Col className="banner-left">
        <h1>{title}</h1>
        <Link to={btn.href} className="btn btn-secondary">{btn.title}</Link>
        {
          subtitle
            ? <p><a href={subtitle.href}>{subtitle.content}</a></p>
            : null
        }
      </Col>
      <Col className="banner-right">
        <div className="bg-img" style={{ backgroundImage: `url("${image.src}")` }} />
      </Col>
    </Row>
  );
};

export default Banner;
