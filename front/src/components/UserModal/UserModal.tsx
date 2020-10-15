import React from 'react';
import {
  Button, Table, Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { getParticipantStatus } from '../../models/FavorModel';
import { acceptUserFromFavor } from '../../actions/userAction';

type Props = {
  modal: boolean;
  toggleModal: any;
  users: any[];
}

const UserModal = (props: Props) => {
  const dispatch = useDispatch();

  const renderAcceptUserBtn = (user: any) => (
    <Button
      className="mt-1"
      onClick={(): Function => dispatch(acceptUserFromFavor(user.favor, user.user.id, true))}
      color="success"
    >
      Accepter
    </Button>
  );
  const renderRefuseUserBtn = (user: any) => (
    <Button
      className="mt-1"
      onClick={() => dispatch(acceptUserFromFavor(user.favor, user.user.id, false))}
      color="danger"
    >
      Refuser
    </Button>
  );

  const renderStatusButton = (user: any) => {
    let buttons = null;
    if (user.status === 0) {
      buttons = <td className="pt-0">{renderAcceptUserBtn(user)}</td>;
    }
    if (user.status === 1) {
      buttons = <td className="pt-0">{renderRefuseUserBtn(user)}</td>;
    }
    if (user.status === 2) {
      buttons = (
        <td className="pt-0">
          {renderAcceptUserBtn(user)}
          <span className="mr-2" />
          {renderRefuseUserBtn(user)}
        </td>
      );
    }
    return buttons;
  };

  const { modal, toggleModal, users } = props;

  return (
    <Modal isOpen={modal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Liste des bénéficiaires</ModalHeader>
      <ModalBody>
        <Table borderless>
          <thead>
            <tr>
              <th>Bénéficiaire</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user: any) => {
                const userStatus = getParticipantStatus(user.status);
                if (user.user !== undefined) {
                  return (
                    <tr key={user.id}>
                      <td>
                        {user.user.firstname}
                        {' '}
                        {user.user.lastname}
                      </td>
                      <td>
                        <span className={userStatus.className}>{userStatus.wording}</span>
                      </td>
                      {renderStatusButton(user)}
                    </tr>
                  );
                }
              })
            }
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default UserModal;
