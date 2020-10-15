import React from 'react';
import { MdClose } from 'react-icons/md';
import './Tag.scss';

type Tag = {
  id?: number;
  title: string;
  onDelete: Function;
}

const Tag: React.FC<Tag> = (props: Tag) => {
  const { title, onDelete } = props;

  return (
    <span className="tag">
      <span>{title}</span>
      <button onClick={(): Function => onDelete()}><MdClose /></button>
    </span>
  );
};

export default Tag;
