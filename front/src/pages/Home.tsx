import React, { useEffect } from 'react';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner/index';
import TukTuk from '../assets/images/tuk_tuk.png';
import CardList from '../components/CardList';
import { getFavors } from '../actions/favor';
import Loader from '../components/Loader';
import Layout from '../components/Layout/Layout';
import ROUTES from '../config/routes';

const bannerContent = {
  title: 'Prêt à aider quelqu\'un dans le besoin ?',
  btn: {
    href: ROUTES.NEW_FAVOR,
    title: 'Rendre un service',
  },
  image: {
    src: TukTuk,
  },
  subtitle: {
    content: 'Découvrir comment ça marche',
    href: '#',
  },
};

const Home: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const favors = useSelector((reducers: RootStateOrAny) => reducers.favorReducer.favors);
  const isLoading = useSelector((reducers: RootStateOrAny) => reducers.favorReducer.isLoading);

  useEffect(() => {
    dispatch(getFavors());
  }, []);

  return (
    <Layout>
      <Banner content={bannerContent} />
      {
        isLoading
          ? (
            <div className="text-center pt-2 pb-2">
              <Loader size={4} />
            </div>
          )
          : (
            <div>
              <CardList
                col={3}
                items={favors.results !== undefined ? favors.results : []}
              />
              <div className="pt-3 pb-4 text-center">
                <Link to={ROUTES.FAVORS} className="d-inline-block m-auto btn btn-primary" color="primary">
                  Découvrir plus de services
                </Link>
              </div>
            </div>
          )
      }
    </Layout>
  );
};

export default Home;
