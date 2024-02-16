import { useCallback, useEffect, useState } from 'react';
import Preloader from '../../components/Preloader/Preloader';
import { Page } from '../../types';
import axiosApi from '../../axiosApi';

const Home = () => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback( async () => {
    setLoading(true); 
    const response = await axiosApi.get<Page | null>('/pages/home.json');
    setPage(response.data);
    setLoading(false); 

  }, []);

  useEffect(() => {
    void fetchPage();
  }, [fetchPage]);

  let postArea = <Preloader />;

  if (!loading && page) {
    postArea = (
      <div>
        <div className="page"> 
            <h2 className='page-title'>{page.title}</h2>
            <p className="page-text">{page.content}</p>
        </div>
      </div>
    )
  } else if (!loading && page) {
    postArea = (
      <h1>Страница не найдена</h1>
    )
  }
   
  return (
    <div>
        {postArea}
    </div>
  );
}

export default Home;