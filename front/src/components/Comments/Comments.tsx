import React, {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { Comment as CommentModel } from '../../models/CommentModel';
import Comment from './Comment';
import ROUTES from '../../config/routes';
import { postComment } from '../../actions/favor';

type Props = {
  comments: CommentModel[];
  favorId: number;
};

const Comments: React.FC<Props> = (props: Props) => {
  const { comments, favorId } = props;
  const [commentValue, setCommentValue] = useState<string>('');
  const [postedComments, setPostedComments] = useState<CommentModel[]>([]);
  const user = useSelector((state: RootStateOrAny) => state.user.user);
  const postedComment = useSelector((state: RootStateOrAny) => state.favorReducer.postedComment);
  const dispatch = useDispatch();

  useEffect(() => {
    if (postedComment) {
      if (postedComments.find((comment) => comment.id === postedComment.id) === undefined) {
        setPostedComments([...postedComments, postedComment]);
      }
    }
  }, [postedComment]);

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    dispatch(postComment(data, favorId));
  };

  return (
    <div className="comments">
      <h2>Commentaires</h2>
      <div>
        {
          [...comments, ...postedComments].map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))
        }
      </div>

      {
        user
          ? (
            <div className="form-group my-5">
              <form onSubmit={(e: FormEvent): void => onSubmit(e)}>
                <textarea
                  name="content"
                  id="content"
                  className="form-control"
                  cols={30}
                  rows={5}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => (
                    setCommentValue(e.target.value)
                  )}
                />

                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={commentValue.trim().length <= 0}
                >
                  Commenter
                </button>
              </form>
            </div>
          )
          : (
            <Alert color="info">
              <Link to={ROUTES.LOGIN}>Connectez-vous </Link>
              pour commenter ! :)
            </Alert>
          )
      }
    </div>
  );
};

export default Comments;
