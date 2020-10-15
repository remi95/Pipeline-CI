import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import Layout from '../../components/Layout/Layout';
import { getRequests } from '../../actions/request';
import Loader from '../../components/Loader';
import RequestCard from '../../components/Request';
import { Request } from '../../models/RequestModel';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const RequestList: React.FC = () => {
  const dispatch = useDispatch();
  const requests = useSelector((reducers: RootStateOrAny) => reducers.request.requests);
  const isLoading = useSelector((reducers: RootStateOrAny) => reducers.request.isLoading);

  useEffect(() => {
    dispatch(getRequests());
  }, []);

  return (
    <Layout>
      <Breadcrumb items={[{ label: 'Demandes' }]} />

      <h1 className="mt-2 mb-3">Les demandes</h1>

      {
        isLoading
          ? (
            <div className="text-center pt-2 pb-2">
              <Loader size={4} />
            </div>
          )
          : (
            <div>
              {
                (requests !== undefined && requests.results !== undefined)
                  ? requests.results.map((request: Request) => (
                    <RequestCard request={request} key={request.id} />
                  ))
                  : null
              }
            </div>
          )
      }
    </Layout>
  );
};

export default RequestList;
