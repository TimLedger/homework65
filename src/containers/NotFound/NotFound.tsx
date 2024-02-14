import { NavLink } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className='not-found'>
      <div className="not-found-frame">
        <h1 className='not-found-title'>4О4</h1>
        <p className='not-found-link'><NavLink to="/" end>На главную</NavLink></p>
      </div>
    </div>
  );
}

export default NotFound;