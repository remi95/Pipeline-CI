import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import './ChooseGeozone.scss';
import { fetchAllDepartments, getGeoRegions } from '../../actions/mapAction';
import ConcertoMap from '../../components/map/ConcertoMap/ConcertoMap';
import Layout from '../../components/Layout/Layout';

const ChooseGeozone: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGeoRegions());
    dispatch(fetchAllDepartments());
  }, []);

  return (
    <Layout>
      <h1 className="my-5 text-center">Choisissez votre zone géographique</h1>

      <p>
        Afin de vous offrir la meilleure expérience possible,
        nous avons besoin de connaitre la zone géographique dans laquelle vous vous trouvez,
        pour vous proposer des
        <strong> services près de chez vous.</strong>
      </p>
      <p>
        Si vous souhaitez vous même proposer des services,
        cela nous permettra de les proposer à vos voisins !
      </p>

      <ConcertoMap
        displayRegions
        displayDepartments
      />
    </Layout>
  );
};

export default ChooseGeozone;
