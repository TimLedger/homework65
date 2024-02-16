import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axiosApi from '../../axiosApi';
import { Page } from '../../types';
import './Toolbar.css';

const Toolbar = () => {
    const location = useLocation();
    const [pages, setPages] = useState<Page[]>([]);

    useEffect(() => {
        const fetchPages = async () => {
        try {
            const response = await axiosApi.get<{ [key: string]: Page }>('/pages.json');
            const pagesData = response.data;
            const filteredPages = Object.values(pagesData).filter(page => page.id !== 'home');
            setPages(filteredPages);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
        };

        fetchPages();
    }, [[location.pathname]]);

    return (
        <nav className='main-nav'>
            <ul>
                {pages.map((page) => (
                    <li key={page.id}>
                    <NavLink to={'/pages/' + page.id} className={({ isActive }) => isActive ? 'active-link' : 'link'}>{page.pageName}</NavLink>
                    </li>
                ))}
                <li>
                    <NavLink to={'/pages/admin'} className={({ isActive }) => isActive ? 'active-link' : 'link'}>Admin</NavLink>
                </li>
            </ul>                       
        </nav>
    );
}

export default Toolbar;