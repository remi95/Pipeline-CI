import React from 'react';
import './Loader.scss';
import { FiLoader } from 'react-icons/fi';

type Props = {
  size?: number;
};

const Loader: React.FC<Props> = (props: Props) => {
  const { size } = props;

  const style = {
    fontSize: size ? `${size}rem` : '3rem',
  };

  return (
    <div className="loader" style={style}>
      <FiLoader />
    </div>
  );
};

export default Loader;
