import React from 'react';
import dayjs from 'dayjs';
import { Comment as CommentModel } from '../../models/CommentModel';
import './Comment.scss';
import UserPlaceholder from '../../assets/images/user.png';
import { BASE_URL } from '../../config/api';

type Props = {
  comment: CommentModel;
};

const Comment: React.FC<Props> = (props: Props) => {
  const { comment } = props;

  return (
    <div className="comment">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <img
            src={comment.user.picture ? BASE_URL + comment.user.picture.path : UserPlaceholder}
            alt={`${comment.user.firstname}_profil`}
          />
          <span className="font-weight-bold">{`${comment.user.firstname} ${comment.user.lastname}`}</span>
        </div>

        <span className="float-right">{dayjs(comment.createdAt).format('Le DD MMMM YYYY à HH:mm')}</span>
      </div>
      <div className="comment-content">
        {comment.content}
      </div>
    </div>
  );
};

export default Comment;
