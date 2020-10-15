import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import {
  Button, Row, Col, CustomInput, Form, FormGroup, Input, Label,
} from 'reactstrap';
import { initCategory, getCategories } from '../../actions/category';
import { getFavors } from '../../actions/favor';
import CardList from '../../components/CardList';
import { Category } from '../../models/CategoryModel';
import Loader from '../../components/Loader';
import Layout from '../../components/Layout/Layout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import AutocompleteCities from '../../components/Form/AutocompleteCities';

const initialFormState = {
  categories: [],
  date: '',
};

interface FormCategory {
  id: string;
  name: string;
  checked: boolean;
}

const Favors: React.FC = () => {
  const dispatch = useDispatch();

  const categories = useSelector((reducers: RootStateOrAny) => reducers.categoryReducer.categories);
  const isLoading = useSelector((reducers: RootStateOrAny) => reducers.categoryReducer.categoriesLoading);
  const favors = useSelector((reducers: RootStateOrAny) => reducers.favorReducer.favors);
  const isFavorsLoading = useSelector((reducers: RootStateOrAny) => reducers.favorReducer.isLoading);
  const customFieldsData = useSelector((reducers: RootStateOrAny) => reducers.form.customFieldsData);
  const { formFilters } = customFieldsData;

  const [form, setForm] = useState<any>(initialFormState);
  const [currentPage, setCurrentPage] = useState(1);

  const handleScroll = (): void => {
    if (window.innerHeight + document.documentElement.scrollTop
      !== document.documentElement.offsetHeight) return;
    if (currentPage < favors.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const setInitialFormState = (): void => {
    if (categories.results) {
      const formCategories: FormCategory[] = categories.results.map((cat: Category) => ({
        id: cat.id,
        name: cat.name,
        checked: false,
      }));
      form.categories = formCategories;
      form.date = '';
    }
    setForm({ ...form });
  };

  const filterFavors = (page: number): Function => {
    const categoriesSelected = form.categories.filter((cat: FormCategory) => cat.checked);
    return dispatch(getFavors({
      page,
      categories: categoriesSelected,
      cities: formFilters,
      dateStart: form.date,
    }));
  };

  useEffect(() => {
    dispatch(getFavors({ page: 1 }));
    dispatch(getCategories());

    return (): void => { dispatch(initCategory()); };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, [favors]);

  useEffect(() => {
    setInitialFormState();
  }, [categories]);

  useEffect(() => {
    if (currentPage > 1) {
      filterFavors(currentPage);
    }
  }, [currentPage]);

  const handleCheckboxChange = (e: ChangeEvent, index: number): void => {
    // @ts-ignore
    form.categories[index].checked = e.target.checked;
    setForm({ ...form });
  };

  const handleInputChange = (e: any): void => {
    form[e.target.name] = e.target.value;
    setForm({ ...form });
  };

  const sendForm = (): void => {
    const page = 1;
    window.scrollTo(0, 0);
    setCurrentPage(page);
    filterFavors(page);
  };

  return (
    <Layout>
      <Breadcrumb items={[{ label: 'Services' }]} />

      {
        isLoading
          ? <div className="text-center pt-4 pb-4"><Loader size={4} /></div>
          : (
            <div>
              <Row>
                <Col md={3} className="pt-3">
                  <div
                    className="border rounded position-fixed p-3"
                    style={{ width: '255px' }}
                  >
                    <div className="text-right">
                      <Button color="link" onClick={setInitialFormState}>Vider les filtres</Button>
                    </div>
                    <div>
                      <Form>
                        <FormGroup>
                          <label className="text-primary font-weight-bold">Catégorie</label>
                          <div>
                            {
                              form.categories
                                ? form.categories.map((cat: any, i: number) => (
                                  <CustomInput
                                    id={cat.name.toLowerCase()}
                                    key={cat.id}
                                    type="checkbox"
                                    name={cat.name.toLowerCase()}
                                    label={cat.name}
                                    checked={cat.checked}
                                    onChange={(e: ChangeEvent): void => handleCheckboxChange(e, i)}
                                  />
                                ))
                                : null
                            }
                            <div>
                              <Button color="link">Voir plus</Button>
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <Label className="text-primary font-weight-bold">Ville(s)</Label>
                          <AutocompleteCities field={{ key: 'formFilters', type: 'text', required: false }} />
                        </FormGroup>

                        <FormGroup>
                          <Label className="text-primary font-weight-bold">Date</Label>
                          <Input
                            type="date"
                            name="date"
                            id="date"
                            value={form.date}
                            placeholder="Date de début"
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                        <Button onClick={sendForm}>Filtrer</Button>
                      </Form>
                    </div>
                  </div>
                </Col>

                <Col>
                  <div>
                    {
                      // eslint-disable-next-line no-nested-ternary
                      isFavorsLoading
                        ? <div className="text-center"><Loader /></div>
                        : favors && favors.results && favors.results.length >= 1
                          ? (
                            <CardList
                              col={4}
                              items={favors.results}
                            />
                          )
                          : (
                            <div className="text-center pt-2 pb-2">
                              Aucun service ne correspond à votre recherche.
                            </div>
                          )
                    }
                  </div>
                </Col>
              </Row>
            </div>
          )
      }
    </Layout>
  );
};

export default Favors;
