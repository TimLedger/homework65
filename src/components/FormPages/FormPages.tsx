import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';
import { Page, PageApi } from '../../types';
import axiosApi from '../../axiosApi'; 
import './FormPages.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

const FormPages: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PageApi>({
    selectedPageId: '', 
    newPageName: '', 
    title: '', 
    content: '', 
    pageName: ''
  });
  const [pages, setPages] = useState<Page[]>([]); 
  const russianToTranslit = (text: string) => {
    const rusToEngMap: {[key: string]: string} = { 
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
      'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    return text.split('').map(char => rusToEngMap[char] || char).join('');
  };
  const [contentChanged, setContentChanged] = useState<boolean>(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axiosApi.get('/pages.json');
        const pagesData: { [key: string]: Page } = response.data;
        const pagesList = Object.values(pagesData);
        setPages(pagesList);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };
    fetchPages(); 
  }, []); 

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axiosApi.get('/pages/' + formData.selectedPageId + '.json');
        const { title, content } = response.data || {}; 
        setFormData(prevState => ({ 
          ...prevState, 
          title: title || '', 
          content: content || '' 
        }));
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    if (formData.selectedPageId !== '') {
      fetchContent(); 
    }
  }, [formData.selectedPageId]); 
  
  const savePage = async () => {
    try {
      setLoading(true);
      const newContent = { 
        id: formData.selectedPageId, 
        title: formData.title, 
        content: formData.content, 
        pageName: formData.pageName
      };
      await axiosApi.put('/pages/' + formData.selectedPageId + '.json', newContent);
      navigate('/pages/' + formData.selectedPageId);
    } finally {
      setLoading(false);
    }
  };
  
  const newPage = async () => {
    try {
      setLoading(true);
      const newPageId = russianToTranslit(formData.newPageName).toLowerCase().replace(/\s+/g, '-');
      const newContent = { 
        id: newPageId, 
        title: formData.title, 
        content: formData.content, 
        pageName: formData.newPageName
      };
      await axiosApi.put('/pages/' + newPageId + '.json', newContent);
      navigate('/pages/' + newPageId);
    } finally {
      setLoading(false);
    }
  };

  const pageSelect = (selectedId: string) => {
    const selectedPage = pages.find(page => page.id === selectedId);
    if (selectedPage) {
      setFormData(prevState => ({ 
        ...prevState, 
        selectedPageId: selectedId, 
        title: selectedPage.title, 
        content: selectedPage.content,
        pageName: selectedPage.pageName 
      }));
    } else {
      setFormData(prevState => ({ 
        ...prevState, 
        selectedPageId: selectedId, 
        title: '', 
        content: '',
        pageName: '' 
      }));
    }
  };

  const contentChange = (value: string) => {
    if (value !== formData.content) { 
      setFormData(prevState => ({ ...prevState, content: value }));
      setContentChanged(true); 
    } else {
      setContentChanged(false); 
    }
  };
  
  const isFormValid = () => {
    if (formData.selectedPageId === '') {
      return formData.newPageName.trim() !== '' && formData.title.trim() !== '' && formData.content.trim() !== '';
    } else {
      return formData.title.trim() !== '' && formData.content.trim() !== '';
    }
  };
  
  return (
    <div className='form-frame'>
      <h1>Admin</h1>
      <div className='form'>
        <select 
          className="form-select"
          value={formData.selectedPageId} 
          onChange={(e) => pageSelect(e.target.value)}
        >
          {pages.map((page) => (
            <option key={page.id} value={page.id} className='form-option'>
              {page.pageName}
            </option>
          ))}
          <option value="" className='form-option'>Добавить новую страницу</option>
        </select>
        {formData.selectedPageId === '' && (
          <input 
            type="text" 
            className="form-input-name"
            required
            placeholder="Имя новой страницы" 
            value={formData.newPageName} 
            onChange={(e) => setFormData(prevState => ({ ...prevState, newPageName: e.target.value }))} 
          />
        )}
        <input 
          type="text" 
          className="form-input"
          placeholder="Заголовок" 
          required
          value={formData.title} 
          onChange={(e) => setFormData(prevState => ({ ...prevState, title: e.target.value }))} 
        /> 
        <ReactQuill
          className="form-textarea"
          placeholder="Описание" 
          value={formData.content} 
          onChange={contentChange}
        />
        <button onClick={formData.selectedPageId === '' ? newPage : savePage} disabled={!isFormValid() || !contentChanged} >
        {formData.selectedPageId === '' ? 'Создать страницу' : 'Сохранить'}
        </button>
      </div>
      {loading && <Preloader />}
    </div>
  );
};

export default FormPages;