import { useCallback, useEffect, useState } from 'react';
import Preloader from '../Preloader/Preloader';
import { useParams, useNavigate } from 'react-router-dom';
import { Page } from '../../types';
import axiosApi from '../../axiosApi';
import './Page.css';

const Page = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback( async () => {
    setLoading(true); 
    const response = await axiosApi.get<Page | null>('/pages/' + params.id +'.json');
    setPage(response.data);
    setLoading(false); 

  }, [params.id]);

  useEffect(() => {
    void fetchPage();
  }, [fetchPage]);

  const deletePage = async () => {
    if (confirm('Вы точно хотите удалить эту страницу?')) {
      await axiosApi.delete('/pages/' + params.id +'.json');
    }
    navigate('/');
  };

  let postArea = <Preloader />;

  if (!loading && page) {
    postArea = (
      <div>
        <div className="page"> 
            <h2 className='page-title'>{page.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
            <button className='delete-btn' onClick={deletePage}>Удалить</button>
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

export default Page;