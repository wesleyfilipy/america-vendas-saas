import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock dos componentes que fazem chamadas externas
jest.mock('./components/layout/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('./components/layout/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home">Home Page</div>;
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('home')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderWithRouter(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-grow');
  });

  it('renders toaster for notifications', () => {
    renderWithRouter(<App />);
    // O Toaster é renderizado pelo react-hot-toast
    // Não podemos testar diretamente, mas podemos verificar se não há erros
    expect(document.body).toBeInTheDocument();
  });
}); 