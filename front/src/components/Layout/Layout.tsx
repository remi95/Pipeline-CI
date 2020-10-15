import React, { ReactElement } from 'react';
import { Container } from 'reactstrap';
import Navbar from '../Navbar';
import FlashMessage from '../FlashMessage/FlashMessage';

type Props = {
  children: ReactElement | ReactElement[];
}

const Layout: React.FC<Props> = ({ children }: Props) => (
  <Container>
    <Navbar />
    <FlashMessage />
    {children}
  </Container>
);

export default Layout;
