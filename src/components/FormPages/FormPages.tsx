import React, { useState, useEffect } from 'react';
import axiosApi from '../../axiosApi'; 
import './FormPages.css';

interface Page {
  id: string; 
  pageName: string; 
  title: string; 
  content: string; 
}

const FormPages: React.FC = () => {
  const [formData, setFormData] = useState<{ selectedPageId: string, newPageName: string, title: string, content: string }>({
    selectedPageId: '', 
    newPageName: '', 
    title: '', 
    content: '' 
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

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axiosApi.get('/pages.json');
        const pagesData: { [key: string]: Page } = response.data;
        if (pagesData) {
          const pagesList = Object.values(pagesData);
          setPages(pagesList);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };
    fetchPages(); 
  }, []); 

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axiosApi.get(`/pages/${formData.selectedPageId}.json`);
        const { title, content } = response.data || {}; 
        setFormData(prevState => ({ ...prevState, title: title || '', content: content || '' }));
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    if (formData.selectedPageId !== '') {
      fetchContent(); 
    }
  }, [formData.selectedPageId]); 

  const handleSave = async () => {
    try {
      const newContent = { title: formData.title, content: formData.content, pageName: formData.selectedPageId };
      await axiosApi.put(`/pages/${formData.selectedPageId}.json`, newContent);
      window.location.href = `/pages/${formData.selectedPageId}`;
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleNewPage = async () => {
    try {
      const newPageId = russianToTranslit(formData.newPageName).toLowerCase().replace(/\s+/g, '-');
      const newContent = { title: formData.title, content: formData.content, pageName: newPageId};
      await axiosApi.put(`/pages/${newPageId}.json`, newContent);
      window.location.href = `/pages/${newPageId}`;
    } catch (error) {
      console.error('Error creating new page:', error);
    }
  };

  const handlePageSelect = (selectedId: string) => {
    setFormData(prevState => ({ ...prevState, selectedPageId: selectedId }));
    const selectedPage = pages.find(page => page.id === selectedId);
    if (selectedPage) {
      setFormData(prevState => ({ ...prevState, title: selectedPage.title, content: selectedPage.content }));
    } else {
      setFormData(prevState => ({ ...prevState, title: '', content: '' }));
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <select value={formData.selectedPageId} onChange={(e) => handlePageSelect(e.target.value)}>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>{page.pageName}</option>
        ))}
        <option value="">Add new page</option>
      </select>
      {formData.selectedPageId === '' && (
        <input type="text" placeholder="New Page Name" value={formData.newPageName} onChange={(e) => setFormData(prevState => ({ ...prevState, newPageName: e.target.value }))} />
      )}
      <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData(prevState => ({ ...prevState, title: e.target.value }))} /> 
      <textarea value={formData.content} onChange={(e) => setFormData(prevState => ({ ...prevState, content: e.target.value }))} />
      <button onClick={formData.selectedPageId === '' ? handleNewPage : handleSave}>
        {formData.selectedPageId === '' ? 'Create Page' : 'Save'}
      </button>
    </div>
  );
};

export default FormPages;
